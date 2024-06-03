document.addEventListener('DOMContentLoaded', async () => {
    const deckId = await getNewDeck();
    if (!deckId) {
        console.error('Failed to get a new deck ID');
        return;
    }
    const stock = document.getElementById('stock');
    const waste = document.getElementById('waste');
    const foundations = document.getElementsByClassName('foundation');
    const tableaux = document.getElementsByClassName('tableau');

    // Draw initial cards for the tableau
    for (let i = 0; i < tableaux.length; i++) {
        if(i<7)
        {const cards = await drawCards(deckId, i + 1);
        if (cards) {
            renderCards2(cards, tableaux[i], i);
        } else {
            console.error('Failed to draw cards for tableau', i + 1);
        }}
        else
        {const cards = await drawCards(deckId, i + 1);
            if (cards) {
                renderCards1(cards, tableaux[i], i);
            } else {
                console.error('Failed to draw cards for tableau', i + 1);
            }}
    }

    
    // Draw the remaining cards for the stock
    const remainingCards = await drawCards(deckId, 24);
    if (remainingCards) {
        
        renderCards1(remainingCards, stock);
    } else {
        console.error('Failed to draw remaining cards for stock');
    }

    // Add event listeners for drag and drop functionality
    addDragAndDrop();
});

function renderCards1(cards, container, tableauIndex) {
    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.style.backgroundImage = `url(${card.image})`;
        cardElement.setAttribute('draggable', 'true');
        cardElement.setAttribute('data-code', card.code);
        cardElement.setAttribute('data-value', card.value);
        cardElement.setAttribute('data-suit', card.suit);

        // If it's a tableau, hide all cards except the last one
        if (container.classList.contains('tableau') && index < tableauIndex) {
            cardElement.classList.add('hidden');
        }

        container.appendChild(cardElement);
    });
}

const CARD_SPACING = 20; // Setăm spațiul între cărți în pixeli

function renderCards2(cards, container, tableauIndex) {
    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.style.backgroundImage = `url(${card.image})`;
        cardElement.setAttribute('draggable', 'true');
        cardElement.setAttribute('data-code', card.code);
        cardElement.setAttribute('data-value', card.value);
        cardElement.setAttribute('data-suit', card.suit);

        // If it's a tableau, hide all cards except the last one
        if (container.classList.contains('tableau') && index < tableauIndex) {
            cardElement.classList.add('hidden');
        }
        // Calculăm offsetul vertical pentru fiecare carte, bazat pe index și spațiul dintre cărți
        const offsetY = index * CARD_SPACING;
        cardElement.style.top = `${offsetY}px`;

        container.appendChild(cardElement);
    });
}

function addDragAndDrop() {
    const cards = document.querySelectorAll('.card');
    const foundations = document.querySelectorAll('.foundation');
    const tableaux = document.querySelectorAll('.tableau');

    cards.forEach(card => {
        card.addEventListener('dragstart', dragStart);
    });

    foundations.forEach(foundation => {
        foundation.addEventListener('dragover', dragOver);
        foundation.addEventListener('drop', dropCardToFoundation);
    });

    tableaux.forEach(tableau => {
        tableau.addEventListener('dragover', dragOver);
        tableau.addEventListener('drop', dropCardToTableau);
    });
}



function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.code);
    setTimeout(() => {
        e.target.classList.add('hide');
    }, 0);
}

function dragOver(e) {
    e.preventDefault();
}

function dropCardToFoundation(e) {
    e.preventDefault();
    const cardCode = e.dataTransfer.getData('text/plain');
    const cardElement = document.querySelector(`[data-code='${cardCode}']`);
    const foundation = e.target;

    if (isValidMoveToFoundation(cardElement, foundation)) {
        foundation.appendChild(cardElement);
        cardElement.classList.remove('hide');
    }
}

function dropCardToTableau(e) {
    e.preventDefault();
    const cardCode = e.dataTransfer.getData('text/plain');
    const cardElement = document.querySelector(`[data-code='${cardCode}']`);
    const tableau = e.target.closest('.tableau');

    if (isValidMoveToTableau(cardElement, tableau)) {
        tableau.appendChild(cardElement);
        cardElement.classList.remove('hide');
        revealHiddenCard(tableau);
    }
}

// Validation functions for game rules
function isValidMoveToFoundation(card, foundation) {
    const foundationCards = foundation.children;
    const cardValue = getValue(card.dataset.value);
    const cardSuit = card.dataset.suit;

    if (foundationCards.length === 0) {
        return cardValue === 1; // Only an Ace can be placed on an empty foundation
    } else {
        const lastCard = foundationCards[foundationCards.length - 1];
        const lastCardValue = getValue(lastCard.dataset.value);
        const lastCardSuit = lastCard.dataset.suit;

        return cardSuit === lastCardSuit && cardValue === lastCardValue + 1;
    }
}

function isValidMoveToTableau(card, tableau) {
    const tableauCards = tableau.children;
    const cardValue = getValue(card.dataset.value);
    const cardSuit = card.dataset.suit;

    if (tableauCards.length === 0) {
        return cardValue === 13; // Only a King can be placed on an empty tableau
    } else {
        const lastCard = tableauCards[tableauCards.length - 1];
        const lastCardValue = getValue(lastCard.dataset.value);
        const lastCardSuit = lastCard.dataset.suit;

        return isOppositeColor(cardSuit, lastCardSuit) && cardValue === lastCardValue - 1;
    }
}



function getValue(value) {
    switch (value) {
        case 'ACE':
            return 1;
        case '2':
            return 2;
        case '3':
            return 3;
        case '4':
            return 4;
        case '5':
            return 5;
        case '6':
            return 6;
        case '7':
            return 7;
        case '8':
            return 8;
        case '9':
            return 9;
        case '10':
            return 10;
        case 'JACK':
            return 11;
        case 'QUEEN':
            return 12;
        case 'KING':
            return 13;
        default:
            return 0;
    }
}

function isOppositeColor(suit1, suit2) {
    const redSuits = ['HEARTS', 'DIAMONDS'];
    const blackSuits = ['CLUBS', 'SPADES'];

    return (redSuits.includes(suit1) && blackSuits.includes(suit2)) || (blackSuits.includes(suit1) && redSuits.includes(suit2));
}

function revealHiddenCard(tableau) {
    const hiddenCards = tableau.querySelectorAll('.hidden');
    if (hiddenCards.length > 0) {
        hiddenCards[hiddenCards.length - 1].classList.remove('hidden');
    }
}
