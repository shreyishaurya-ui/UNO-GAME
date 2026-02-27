const colors = ["red", "green", "blue", "yellow"];
const specials = ["Skip", "Reverse", "Draw2"];

let deck = [];
let players = [[], [], [], []];
let currentPlayer = 0;
let direction = 1;
let discardPile = [];

function createDeck() {
  for (let color of colors) {
    for (let i = 0; i <= 9; i++) {
      deck.push({ color, value: i });
      if (i !== 0) deck.push({ color, value: i });
    }
    for (let s of specials) {
      deck.push({ color, value: s });
      deck.push({ color, value: s });
    }
  }
  for (let i = 0; i < 4; i++) {
    deck.push({ color: "wild", value: "Wild" });
    deck.push({ color: "wild", value: "WildDraw4" });
  }
}

function shuffle() {
  deck.sort(() => Math.random() - 0.5);
}

function deal() {
  for (let i = 0; i < 7; i++) {
    for (let p = 0; p < 4; p++) {
      players[p].push(deck.pop());
    }
  }
}

function start() {
  createDeck();
  shuffle();
  deal();
  discardPile.push(deck.pop());
  render();
}

function render() {
  const topCard = discardPile[discardPile.length - 1];
  const discard = document.getElementById("discard");

  discard.className = "card large " + topCard.color;
  discard.innerText = topCard.value;

  document.getElementById("turnInfo").innerText =
    "Player " + (currentPlayer + 1) + "'s Turn";

  players.forEach((hand, index) => {
    const div = document.getElementById("player" + (index + 1));
    div.innerHTML = "";

    if (index === 0) {
      // Bottom player sees cards
      hand.forEach((card, i) => {
        const cardDiv = document.createElement("div");
        cardDiv.className = "card " + card.color;
        cardDiv.innerText = card.value;
        cardDiv.onclick = () => playCard(i);
        div.appendChild(cardDiv);
      });
    } else {
      // Opponents show card count only
      div.innerText = "Cards: " + hand.length;
    }
  });
}

function playCard(index) {
  if (currentPlayer !== 0) return;

  const card = players[0][index];
  const top = discardPile[discardPile.length - 1];

  if (
    card.color === top.color ||
    card.value === top.value ||
    card.color === "wild"
  ) {
    discardPile.push(card);
    players[0].splice(index, 1);

    handleSpecial(card);

    if (players[0].length === 0) {
      alert("You Win!");
      location.reload();
    }

    nextPlayer();
    aiTurns();
    render();
  }
}

function aiTurns() {
  while (currentPlayer !== 0) {
    let played = false;

    for (let i = 0; i < players[currentPlayer].length; i++) {
      const card = players[currentPlayer][i];
      const top = discardPile[discardPile.length - 1];

      if (
        card.color === top.color ||
        card.value === top.value ||
        card.color === "wild"
      ) {
        discardPile.push(card);
        players[currentPlayer].splice(i, 1);
        handleSpecial(card);
        played = true;
        break;
      }
    }

    if (!played) players[currentPlayer].push(deck.pop());

    if (players[currentPlayer].length === 0) {
      alert("Player " + (currentPlayer + 1) + " Wins!");
      location.reload();
    }

    nextPlayer();
  }
}

function handleSpecial(card) {
  if (card.value === "Reverse") direction *= -1;
  if (card.value === "Skip") nextPlayer();
  if (card.value === "Draw2") {
    nextPlayer();
    players[currentPlayer].push(deck.pop(), deck.pop());
  }
  if (card.value === "WildDraw4") {
    nextPlayer();
    for (let i = 0; i < 4; i++) players[currentPlayer].push(deck.pop());
  }
}

function nextPlayer() {
  currentPlayer = (currentPlayer + direction + 4) % 4;
}

function drawCard() {
  if (currentPlayer !== 0) return;
  players[0].push(deck.pop());
  nextPlayer();
  aiTurns();
  render();
}

start();
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}