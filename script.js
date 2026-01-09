// Raffle Manager Application
class RaffleManager {
    constructor() {
        this.participants = [];
        this.winners = [];
        this.animationInterval = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Participant management
        document.getElementById('addParticipant').addEventListener('click', () => this.addParticipant());
        document.getElementById('bulkAdd').addEventListener('click', () => this.bulkAddParticipants());
        document.getElementById('clearAll').addEventListener('click', () => this.clearAllParticipants());
        
        // Drawing
        document.getElementById('startDraw').addEventListener('click', () => this.startDrawing());
        document.getElementById('resetDraw').addEventListener('click', () => this.resetDraw());
        document.getElementById('exportResults').addEventListener('click', () => this.exportResults());

        // Enter key support
        document.getElementById('participantName').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addParticipant();
        });
    }

    addParticipant() {
        const nameInput = document.getElementById('participantName');
        const classInput = document.getElementById('participantClass');
        const weightInput = document.getElementById('participantWeight');
        const name = nameInput.value.trim();
        const studentClass = classInput.value || 'N/A';
        const weight = parseInt(weightInput.value) || 1;

        if (!name) {
            alert('Please enter a participant name');
            return;
        }

        // Check if participant already exists - add tickets instead of creating duplicate
        const existing = this.participants.find(p => 
            p.name.toLowerCase() === name.toLowerCase() && 
            p.class.toLowerCase() === studentClass.toLowerCase()
        );
        
        if (existing) {
            existing.weight += weight;
            alert(`Added ${weight} ticket(s) to ${name}. Total tickets: ${existing.weight}`);
        } else {
            this.participants.push({ name, class: studentClass, weight, id: Date.now() });
        }
        
        this.renderParticipants();
        
        // Clear inputs
        nameInput.value = '';
        classInput.value = 'N/A';
        weightInput.value = '1';
        nameInput.focus();
    }

    bulkAddParticipants() {
        const textarea = document.getElementById('bulkParticipants');
        const lines = textarea.value.split('\n').filter(n => n.trim());
        
        if (lines.length === 0) {
            alert('Please enter at least one participant');
            return;
        }

        let added = 0;
        let updated = 0;

        lines.forEach(line => {
            line = line.trim();
            if (!line) return;
            
            // Parse: Name, Class, Tickets (or Name, Class or just Name)
            const parts = line.split(',').map(p => p.trim());
            const name = parts[0];
            const studentClass = parts[1] || 'N/A';
            const weight = parseInt(parts[2]) || 1;
            
            if (!name) return;
            
            const existing = this.participants.find(p => 
                p.name.toLowerCase() === name.toLowerCase() && 
                p.class.toLowerCase() === studentClass.toLowerCase()
            );
            
            if (existing) {
                existing.weight += weight;
                updated++;
            } else {
                this.participants.push({ 
                    name, 
                    class: studentClass, 
                    weight, 
                    id: Date.now() + Math.random() 
                });
                added++;
            }
        });

        this.renderParticipants();
        textarea.value = '';

        let message = `Added ${added} new participant(s).`;
        if (updated > 0) {
            message += ` Updated tickets for ${updated} existing participant(s).`;
        }
        alert(message);
    }

    removeParticipant(id) {
        this.participants = this.participants.filter(p => p.id !== id);
        this.renderParticipants();
    }

    clearAllParticipants() {
        if (this.participants.length === 0) return;
        
        if (confirm('Are you sure you want to remove all participants?')) {
            this.participants = [];
            this.renderParticipants();
        }
    }

    renderParticipants() {
        const list = document.getElementById('participantsList');
        const count = document.getElementById('participantCount');
        
        count.textContent = this.participants.length;
        
        list.innerHTML = this.participants.map(p => `
            <li class="participant-item">
                <div class="participant-info">
                    <span class="participant-name">${this.escapeHtml(p.name)}</span>
                    <span class="participant-class">${this.escapeHtml(p.class)}</span>
                    ${p.weight > 1 ? `<span class="participant-weight">×${p.weight}</span>` : ''}
                </div>
                <button class="remove-btn" onclick="raffleManager.removeParticipant(${p.id})">×</button>
            </li>
        `).join('');
    }

    async startDrawing() {
        if (this.participants.length === 0) {
            alert('Please add participants before drawing');
            return;
        }

        const numWinners = parseInt(document.getElementById('numWinners').value);
        const allowDuplicates = document.getElementById('allowDuplicates').checked;
        const useWeights = document.getElementById('useWeights').checked;

        if (numWinners > this.participants.length && !allowDuplicates) {
            alert(`Cannot draw ${numWinners} unique winners from ${this.participants.length} participants. Either reduce the number of winners or enable duplicates.`);
            return;
        }

        // Hide start button and show animation
        document.getElementById('startDraw').style.display = 'none';
        document.getElementById('animationArea').classList.remove('hidden');
        document.getElementById('winnersArea').classList.add('hidden');

        this.winners = [];
        const availableParticipants = [...this.participants];

        // Draw winners with animation
        for (let i = 0; i < numWinners; i++) {
            const winner = this.selectWinner(availableParticipants, useWeights);
            await this.animateDrawing(availableParticipants, winner);
            
            this.winners.push({...winner});

            // Subtract one ticket from winner if duplicates not allowed
            if (!allowDuplicates) {
                // Update the temporary pool
                const winnerInPool = availableParticipants.find(p => p.id === winner.id);
                if (winnerInPool) {
                    winnerInPool.weight -= 1;
                    // Remove from pool if no tickets left
                    if (winnerInPool.weight <= 0) {
                        const index = availableParticipants.findIndex(p => p.id === winner.id);
                        availableParticipants.splice(index, 1);
                    }
                }
                
                // Update the actual participant list
                const actualParticipant = this.participants.find(p => p.id === winner.id);
                if (actualParticipant) {
                    actualParticipant.weight -= 1;
                    // Remove from main list if no tickets left
                    if (actualParticipant.weight <= 0) {
                        this.participants = this.participants.filter(p => p.id !== winner.id);
                    }
                    this.renderParticipants();
                }
            }

            await this.delay(1000);
        }

        // Show winners
        this.showWinners();
    }

    async animateDrawing(participants, winner) {
        const wheel = document.getElementById('rouletteWheel');
        const currentName = document.getElementById('currentName');
        
        return new Promise((resolve) => {
            let iterations = 0;
            const maxIterations = 30;
            
            this.animationInterval = setInterval(() => {
                // Shuffle and show random names in wheel
                const shuffled = [...participants].sort(() => Math.random() - 0.5).slice(0, 8);
                wheel.innerHTML = shuffled.map(p => 
                    `<span class="roulette-name">${this.escapeHtml(p.name)}</span>`
                ).join('');

                // Show current name - use winner on last iteration
                if (iterations >= maxIterations - 1) {
                    currentName.textContent = winner.name;
                } else {
                    const randomParticipant = participants[Math.floor(Math.random() * participants.length)];
                    currentName.textContent = randomParticipant.name;
                }

                iterations++;
                
                if (iterations >= maxIterations) {
                    clearInterval(this.animationInterval);
                    resolve();
                }
            }, 100);
        });
    }

    selectWinner(participants, useWeights) {
        if (!useWeights) {
            return participants[Math.floor(Math.random() * participants.length)];
        }

        // Weighted selection
        const totalWeight = participants.reduce((sum, p) => sum + p.weight, 0);
        let random = Math.random() * totalWeight;

        for (const participant of participants) {
            random -= participant.weight;
            if (random <= 0) {
                return participant;
            }
        }

        return participants[participants.length - 1];
    }

    showWinners() {
        document.getElementById('animationArea').classList.add('hidden');
        document.getElementById('winnersArea').classList.remove('hidden');
        
        const winnersList = document.getElementById('winnersList');
        winnersList.innerHTML = this.winners.map((winner, index) => `
            <li class="winner-item">
                <span class="winner-rank">#${index + 1}</span>
                ${this.escapeHtml(winner.name)}
                <span class="winner-class">(${this.escapeHtml(winner.class)})</span>
            </li>
        `).join('');
    }

    resetDraw() {
        this.winners = [];
        document.getElementById('startDraw').style.display = 'block';
        document.getElementById('animationArea').classList.add('hidden');
        document.getElementById('winnersArea').classList.add('hidden');
        
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }
    }

    exportResults() {
        if (this.winners.length === 0) {
            alert('No winners to export');
            return;
        }

        const timestamp = new Date().toLocaleString();
        winnersList.innerHTML = this.winners.map((winner, index) => `
            <li class="winner-item">
                <span class="winner-rank">#${index + 1}</span>
                ${this.escapeHtml(winner.name)}
                <span class="winner-class">(${this.escapeHtml(winner.class)})</span>
            </li>
        `).join('');

        // Create downloadable file
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `raffle-results-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the application
const raffleManager = new RaffleManager();
