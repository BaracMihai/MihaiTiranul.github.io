const API_URL = 'https://deckofcardsapi.com/api/deck/new/shuffle/';

async function getNewDeck() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('New Deck Data:', data);
        return data.deck_id;
    } catch (error) {
        console.error('Error fetching new deck:', error);
    }
}

async function drawCards(deckId, count) {
    try {
        const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${count}`);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(`Draw ${count} Cards Data:`, data);
        return data.cards;
    } catch (error) {
        console.error('Error drawing cards:', error);
    }
}
