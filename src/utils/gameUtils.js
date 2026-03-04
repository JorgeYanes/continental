import { RAW_DATA } from '../data/historicalData';

// Menor puntaje gana
export function getWinners(players) {
    if (!players || players.length === 0) return [];
    const minScore = Math.min(...players.map(p => p.total));
    return players.filter(p => p.total === minScore).map(p => p.name);
}

// --- Utilidad para parsear los datos históricos ---
export function parseInitialData() {
    const lines = RAW_DATA.trim().split('\n');
    const games = [];
    let currentGamePlayers = [];
    let gameId = 1;
    // Iniciamos una fecha base ficticia hacia atrás para los datos históricos
    let dateObj = new Date();
    dateObj.setDate(dateObj.getDate() - (lines.length / 4) * 7);

    lines.forEach(line => {
        if (!line.trim()) return;
        const parts = line.split(':');
        if (parts.length < 2) return;

        const name = parts[0].trim();
        // Extraer todos los números, el último siempre será el total en este formato
        const numbers = parts[1].match(/\d+/g);
        if (!numbers) return;

        const parsedNumbers = numbers.map(Number);
        const total = parsedNumbers.pop();
        const scores = parsedNumbers;

        // Si el jugador ya está en la partida actual, iniciamos una nueva
        if (currentGamePlayers.some(p => p.name === name)) {
            games.push({
                id: gameId++,
                date: dateObj.toISOString().split('T')[0],
                players: [...currentGamePlayers],
                winners: getWinners(currentGamePlayers)
            });
            currentGamePlayers = [];
            dateObj.setDate(dateObj.getDate() + 7); // Avanzamos 1 semana simulada
        }

        currentGamePlayers.push({ name, scores, total });
    });

    if (currentGamePlayers.length > 0) {
        games.push({
            id: gameId,
            date: dateObj.toISOString().split('T')[0],
            players: currentGamePlayers,
            winners: getWinners(currentGamePlayers)
        });
    }

    return games;
}

export const calculateTotal = (scores) => {
    return scores.reduce((sum, val) => sum + (parseInt(val) || 0), 0);
};
