const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static('public'));

// --- GAME CONFIG ---
const SUITS = ['♠', '♥', '♣', '♦'];
const RANKS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

class Card {
    constructor(val, suit, rank) {
        this.value = val; this.suit = suit; this.rank = rank;
        this.color = (suit === '♥' || suit === '♦') ? 'red' : 'black';
    }
}

class Deck {
    constructor() { this.cards = []; this.reset(); }
    reset() {
        this.cards = [];
        for(let s of SUITS) for(let i=0; i<RANKS.length; i++) this.cards.push(new Card(i+1, s, RANKS[i]));
        this.shuffle();
    }
    shuffle() {
        for(let i=this.cards.length-1; i>0; i--) {
            const j = Math.floor(Math.random()*(i+1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
    draw() { if(this.cards.length === 0) this.reset(); return this.cards.pop(); }
}

// --- SERVER STATE ---
let players = {}; 
let gameState = {
    deck: new Deck(),
    pot: 0,
    ante: 50,
    penalty: 10,
    card1: null,
    card2: null,
    activePlayer: 'p1', 
    firstPlayer: 'p1',
    turnDuration: 15,
};

let turnTimer = null;

// --- SOCKET LOGIC ---
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // 1. JOIN GAME (Identity Phase)
    socket.on('join_game', (userData) => {
        if (Object.keys(players).length >= 2) {
            socket.emit('room_full');
            return;
        }

        const role = Object.values(players).find(p => p.role === 'p1') ? 'p2' : 'p1';
        
        players[socket.id] = { 
            id: socket.id, 
            role: role, 
            name: userData.name.substring(0, 10),
            avatar: userData.avatar,
            money: 1000 
        };

        console.log(`${userData.name} joined as ${role}`);

        socket.emit('welcome', { role: role });
        broadcastPlayerUpdate();

        if (Object.keys(players).length === 2) {
            let p1 = Object.values(players).find(p => p.role === 'p1');
            let p2 = Object.values(players).find(p => p.role === 'p2');
            io.emit('game_ready', `${p1.name} vs ${p2.name}! Round 1 Starting...`);
        }
    });

    // 2. DISCONNECT
    socket.on('disconnect', () => {
        if(players[socket.id]) {
            console.log(`User ${players[socket.id].name} disconnected`);
            delete players[socket.id];
            gameState.pot = 0;
            clearTimeout(turnTimer);
            io.emit('reset_game');
            broadcastPlayerUpdate();
        }
    });

    // 3. START ROUND (This was likely missing!)
    socket.on('req_start_round', () => {
        console.log("Start Round Requested"); // Debug Log

        if(Object.keys(players).length < 2) return;
        
        let p1 = Object.values(players).find(p => p.role === 'p1');
        let p2 = Object.values(players).find(p => p.role === 'p2');
        let antePaid = false;

        // Auto Ante
        if(gameState.pot === 0) {
            p1.money -= gameState.ante;
            p2.money -= gameState.ante;
            gameState.pot += (gameState.ante * 2);
            antePaid = true;
        }

        gameState.activePlayer = gameState.firstPlayer;
        
        // Broadcast money update immediately so UI syncs
        broadcastPlayerUpdate();
        
        dealHandForActivePlayer(antePaid);
    });

    // 4. PLAYER ACTION
    socket.on('req_action', (data) => {
        const player = players[socket.id];
        if(!player || player.role !== gameState.activePlayer) return;

        clearTimeout(turnTimer);
        handleAction(player, data.action, data.amount);
    });

    // 5. REMATCH REQUEST
    socket.on('req_rematch', () => {
        Object.values(players).forEach(p => p.money = 1000);
        
        gameState.pot = 0;
        gameState.firstPlayer = 'p1';
        
        io.emit('game_reset');
        broadcastPlayerUpdate();
        io.emit('round_over', { nextStart: 'p1' });
    });
});

// --- HELPERS ---

function broadcastPlayerUpdate() {
    let p1 = Object.values(players).find(p => p.role === 'p1');
    let p2 = Object.values(players).find(p => p.role === 'p2');
    
    io.emit('update_players', {
        p1: p1 ? { name: p1.name, avatar: p1.avatar, money: p1.money } : null,
        p2: p2 ? { name: p2.name, avatar: p2.avatar, money: p2.money } : null
    });
}

function startTurnTimer() {
    clearTimeout(turnTimer); 
    io.emit('timer_start', gameState.turnDuration);

    turnTimer = setTimeout(() => {
        let activeSocketId = Object.keys(players).find(key => players[key].role === gameState.activePlayer);
        if(activeSocketId) {
            console.log("Timer Expired. Forcing Pass.");
            handleAction(players[activeSocketId], 'pass', 0);
        }
    }, gameState.turnDuration * 1000);
}

function handleAction(player, actionType, betAmount) {
    let resultType = 'pass';
    let amount = 0;
    let resultCard = null;

    if(actionType === 'pass') {
        player.money -= gameState.penalty;
        gameState.pot += gameState.penalty;
        resultType = 'pass';
    } else {
        amount = parseInt(betAmount);
        player.money -= amount;
        
        resultCard = gameState.deck.draw();
        let low = Math.min(gameState.card1.value, gameState.card2.value);
        let high = Math.max(gameState.card1.value, gameState.card2.value);
        let val = resultCard.value;
        let win = (val > low && val < high);

        if(win) {
            player.money += (amount * 2);
            gameState.pot -= amount;
            resultType = 'win';
        } else {
            gameState.pot += amount;
            resultType = 'lose';
        }
    }

    // Define players for emit
    let p1 = Object.values(players).find(p => p.role === 'p1');
    let p2 = Object.values(players).find(p => p.role === 'p2');
    
    io.emit('turn_resolved', {
        who: player.role,
        result: resultType,
        amount: amount,
        cardResult: resultCard,
        p1Money: p1.money, 
        p2Money: p2.money,
        pot: gameState.pot
    });

    // Sync names/money again to be safe
    broadcastPlayerUpdate();

    // BANKRUPTCY CHECK
    if(p1.money < gameState.ante || p2.money < gameState.ante) {
        let winner = (p1.money > p2.money) ? 'p1' : 'p2';
        io.emit('game_ended', { winner: winner });
        gameState.pot = 0; 
        return; 
    }

    // GAME LOOP PROCEED
    setTimeout(() => {
        if(gameState.pot === 0) {
            endRound();
            return;
        }
        if(gameState.activePlayer === gameState.firstPlayer) {
            gameState.activePlayer = (gameState.firstPlayer === 'p1') ? 'p2' : 'p1';
            dealHandForActivePlayer(false);
        } else {
            endRound();
        }
    }, 3000);
}

function dealHandForActivePlayer(antePaid) {
    gameState.card1 = gameState.deck.draw();
    gameState.card2 = gameState.deck.draw();
    
    let p1 = Object.values(players).find(p => p.role === 'p1');
    let p2 = Object.values(players).find(p => p.role === 'p2');

    io.emit('new_hand_dealt', {
        antePaid: antePaid,
        p1Money: p1.money,
        p2Money: p2.money,
        pot: gameState.pot,
        card1: gameState.card1,
        card2: gameState.card2,
        activePlayer: gameState.activePlayer
    });

    startTurnTimer();
}

function endRound() {
    gameState.firstPlayer = (gameState.firstPlayer === 'p1') ? 'p2' : 'p1';
    io.emit('round_over', { nextStart: gameState.firstPlayer });
}

server.listen(3000, () => { console.log('Server running on 3000'); });