# In-Between: Pinoy Version 🇵🇭

![Game Status](https://img.shields.io/badge/Status-Playable-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![Platform](https://img.shields.io/badge/Platform-Mobile%20%7C%20Desktop-orange)

A fully functional, mobile-responsive web implementation of the popular Filipino carnival (*peryahan*) card game **In-Between** (also known internationally as *Acey Deucey* or *Red Dog*).

This project is built as a **Single File Application**. It requires no installation, no external image assets, and no mp3 downloads. Everything—including the sound effects—is generated via code.

## 🎮 Play the Game
(https://raymartpanila.github.io/In-Between-Games-Pinoy-Version/)

## ✨ Features

* **Single-Player vs CPU:** Compete against an AI that manages its own bankroll and makes betting decisions based on probability.
* **Authentic "Pinoy" Rules:**
    * **Ace is Low (1):** Rank order is A, 2, 3...Q, K.
    * **"Taya" (Penalty):** Passing a turn or getting a bad hand (Pair/Consecutive) deducts a penalty fee.
* **Procedural Audio:** Custom Sound Manager uses the **Web Audio API** to synthesize shuffling, dealing, and winning sounds (no heavy audio files).
* **Physics Animations:** Cards visually "fly" from the deck to the player slots.
* **Customizable Settings:** Players can adjust starting money, penalty fees, and toggle sound.
* **Mobile Optimized:** "Safe Area" support for modern notched phones and touch-friendly controls.

## 🎲 How to Play

1.  **The Deal:** Two cards are placed face up.
2.  **The Spread:** You must judge the gap between the two cards.
3.  **The Bet:**
    * **Bet:** Wager that the *third* card dealt will be numerically **in between** the first two.
    * **Pass:** If the gap is too small, you can Pass (but you pay the Penalty Fee).
4.  **Winning/Losing:**
    * **Win:** The card is in between (Payout 1:1).
    * **Lose:** The card matches one of the posts or is outside the range.
    * **Burn:** If dealt a Pair or Consecutive cards, you automatically lose the Penalty Fee.

## 🛠️ Technical Overview

* **Stack:** HTML5, CSS3, Vanilla JavaScript (ES6+).
* **Architecture:** Class-based structure (`Game`, `Deck`, `SoundManager`).
* **Assets:** Zero external dependencies. All visuals are CSS/Unicode; all audio is synthesized.

## 🚀 Installation & Usage

### Option 1: Play Locally
1.  Clone the repository or download the ZIP.
    ```bash
    git clone [https://github.com/your-username/in-between-pinoy-version.git](https://github.com/your-username/in-between-pinoy-version.git)
    ```
2.  Open `index.html` in any modern web browser.

### Option 2: Host on GitHub Pages
1.  Go to your repository **Settings**.
2.  Navigate to the **Pages** section.
3.  Select `main` branch as the source.
4.  Your game will be live at `https://your-username.github.io/in-between-pinoy-version/`.

## ⚙️ Configuration

Click the **⚙ Settings** button on the landing page to modify:
* **Starting Cash:** Range $500 - $10,000.
* **Penalty Fee:** Range $5 - $500.
* **Sound:** On/Off.

## 🤝 Contributing

Contributions are welcome! If you have ideas for Multiplayer support or smarter AI:
1.  Fork the Project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
