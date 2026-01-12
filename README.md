In-Between: Pinoy Version 🇵🇭
In-Between (also known as Acey Deucey or Red Dog) is a fast-paced card betting game popular in Filipino carnivals (peryahan) and street gatherings.

This is a fully functional, mobile-responsive web application built in a single HTML file. It pits a Single Player against a CPU opponent using "Pinoy Rules" (Ace is Low).

🎮 Game Features
Single-Player vs. CPU: Battle against an AI that calculates odds and manages its own bankroll.

Pinoy Ruleset:

Ace is Low (1): The card order is A, 2, 3 ... J, Q, K.

The "Taya" Penalty: Passing a turn incurs a monetary deduction (default -10).

Burn Penalties: Drawing a Pair or Consecutive Cards results in an automatic monetary penalty.

Dynamic Animations:

Realistic card shuffling shake effects.

Cards "fly" from the deck to player slots.

Floating text animations for monetary deductions.

Synthesized Sound Effects:

Uses the Web Audio API to generate sounds (shuffling, winning chimes, buzzers) on the fly.

No external MP3/WAV files required.

Settings System:

Adjust Starting Money ($500 - $10,000).

Adjust Penalty/Pass Fees ($5 - $500).

Toggle Sound On/Off.

Mobile-First Design: Optimized for touchscreens with "Safe Area" support for modern iPhones (notch/home bar support).

🎲 How to Play
The Objective
You are dealt two cards face up. You must bet on whether the third card dealt will have a value numerically in between the first two cards.

The Card Rankings
Lowest: Ace (1)

Highest: King (13)

Order: A, 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K.

The Flow
The Deal: Two cards are placed on the table (e.g., a 3 and a 9).

The Spread: The game calculates the gap. (In the example above, the winning cards are 4, 5, 6, 7, 8).

The Decision:

BET: Choose an amount using the slider. If the third card is in between, you win 1:1. If it matches the posts or is outside, you lose the bet.

PASS: If the spread is too risky (e.g., a 5 and a 7), you can Pass. However, Passing costs a penalty fee (Standard: -10).

Automatic Penalties:

Pair: If you are dealt two identical cards (e.g., 5 and 5), it is a wash. You lose the penalty fee immediately.

Consecutive: If you are dealt numbers side-by-side (e.g., 5 and 6), there is no room to win. You lose the penalty fee immediately.

🛠 Technical Details
This project is built using Vanilla JavaScript, HTML5, and CSS3. It requires no build tools, frameworks (React/Vue), or external assets.

File Structure
The entire game is contained in one file: index.html.

Key Classes
Game: Manages the state machine (Player Turn -> CPU Turn -> Resolution), bankroll management, and UI updates.

Deck & Card: Handles card generation, shuffling logic, and rank values.

SoundManager: A custom class utilizing window.AudioContext. It creates oscillators and gain nodes to synthesize sound effects programmatically, ensuring the game loads instantly without waiting for audio file downloads.

Mobile Optimization
The CSS uses viewport-fit=cover and env(safe-area-inset-bottom) to ensure buttons are not hidden behind the iOS home bar or Android navigation buttons.

🚀 How to Run
On Desktop
Download the index.html file.

Double-click it to open it in any modern web browser (Chrome, Edge, Safari, Firefox).

On Mobile
Option A (Easy): Email the file to yourself or send it via Messenger/WhatsApp, then open the file attachment.

Option B (Hosting): Upload the file to a free static host like GitHub Pages or Netlify Drop.

GitHub Pages: Push the file as index.html to a repository and enable Pages in settings.

Netlify Drop: Drag and drop the folder containing the file onto the Netlify Drop website.

⚙️ Configuration
You can access the Settings Menu by clicking the "⚙ Settings" button on the landing page.

🔮 Future Roadmap
[ ] Local Storage: Save the player's bankroll so it persists after refreshing the page.

[ ] Multiplayer: Add a "Pass and Play" mode for two humans on one phone.

[ ] Difficulty Levels: Make the CPU smarter (calculating precise probabilities) or riskier.

📄 License
This project is open-source. You are free to modify, distribute, and use it for personal or educational purposes.

Created by: Raymart Panila Date: 2025
