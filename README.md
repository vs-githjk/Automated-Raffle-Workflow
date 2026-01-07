# 🎉 Raffle Manager

A modern, interactive web-based raffle/giveaway manager with live animations and advanced features.

## ✨ Features

### Core Features
- **Add Participants**: Add participants individually or in bulk
- **Randomized Drawing**: Fair random selection with optional weighted probabilities
- **Multiple Winners**: Draw multiple winners in a single session
- **Export Results**: Download results as a text file with timestamps

### Advanced Features
- **Prevent Duplicates**: Option to ensure each participant can only win once
- **Weighted Draws**: Assign weights (1-10) to participants for increased chances
- **Live Animation**: Engaging visual animation during the drawing process

## 🚀 Getting Started

### Quick Start

1. Open `index.html` in your web browser
2. Add participants using the form on the left
3. Configure drawing settings (number of winners, weights, duplicates)
4. Click "Start Drawing" to see the magic happen!

### How to Use

#### Adding Participants

**Single Entry:**
1. Enter participant name
2. Set weight (1-10, default is 1)
3. Click "Add" or press Enter

**Bulk Entry:**
1. Paste multiple names in the text area (one per line)
2. Click "Add All"
3. Duplicates will be automatically detected and skipped

#### Drawing Winners

1. Set the number of winners you want to draw
2. Choose your options:
   - **Allow duplicate winners**: Same person can win multiple times
   - **Use weighted drawing**: Higher weights = better chances
3. Click "Start Drawing"
4. Watch the live animation!
5. View and export results

## 🎨 Features in Detail

### Duplicate Prevention
The system automatically prevents adding duplicate participants (case-insensitive). During drawings, you can choose whether to allow the same person to win multiple prizes.

### Weighted Drawing
Assign weights from 1-10 to participants. Someone with weight 5 has 5× the chance of winning compared to someone with weight 1. Perfect for loyalty programs or VIP entries!

### Live Animation
Experience an exciting roulette-style animation that cycles through participant names before revealing each winner. The animation creates anticipation and makes the drawing process more engaging.

### Export Results
Download a complete text file containing:
- Drawing timestamp
- Total participants count
- Complete winner list with rankings
- Full participant roster with weights

## 🛠️ Technical Details

### Technologies Used
- **HTML5**: Semantic structure
- **CSS3**: Modern styling with animations and gradients
- **Vanilla JavaScript**: No dependencies, pure ES6+

### Browser Compatibility
Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

### File Structure
```
Automated Raffle 2026/
├── index.html       # Main application structure
├── styles.css       # Styling and animations
├── script.js        # Application logic
└── README.md        # This file
```

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🎯 Use Cases

- Company giveaways and contests
- Event door prizes
- Classroom activities
- Social media promotions
- Charity fundraisers
- Team building activities

## 🔒 Privacy

All data is processed locally in your browser. No information is sent to any server. Your participants' information stays private!

## 📄 License

Free to use for personal and commercial purposes.

## 🤝 Contributing

Feel free to fork, modify, and enhance this project!

---

**Enjoy your raffles!** 🎊
