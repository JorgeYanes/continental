import { createClient } from '@supabase/supabase-js'
import { RAW_DATA } from './src/data/historicalData.js'

const supabaseUrl = 'https://qtazwauimmxbcumptzkq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0YXp3YXVpbW14YmN1bXB0emtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NTIwMTQsImV4cCI6MjA4NzUyODAxNH0.iLT_pTwJQDYr66E_gKi5SRmtSwK24L0i79N05hKsOK8'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function seed() {
    const lines = RAW_DATA.trim().split('\n');
    const games = [];
    let currentGamePlayers = [];
    let gameId = 1;
    let dateObj = new Date();
    dateObj.setDate(dateObj.getDate() - (lines.length / 4) * 7);

    lines.forEach(line => {
        if (!line.trim()) return;
        const parts = line.split(':');
        if (parts.length < 2) return;

        const name = parts[0].trim();
        const numbers = parts[1].match(/\d+/g);
        if (!numbers) return;

        const parsedNumbers = numbers.map(Number);
        const total = parsedNumbers.pop();
        const scores = parsedNumbers;

        if (currentGamePlayers.some(p => p.name === name)) {
            games.push({
                date: dateObj.toISOString().split('T')[0],
                players: [...currentGamePlayers],
            });
            currentGamePlayers = [];
            dateObj.setDate(dateObj.getDate() + 7);
        }

        currentGamePlayers.push({ name, scores, total });
    });

    if (currentGamePlayers.length > 0) {
        games.push({
            date: dateObj.toISOString().split('T')[0],
            players: currentGamePlayers,
        });
    }

    console.log(`Parsed ${games.length} games. Pushing to Supabase...`);

    // Map to hold player ids
    const playerIds = {};

    for (const game of games) {
        // Collect players inside this game and insert if missing
        for (const player of game.players) {
            if (!playerIds[player.name]) {
                // Try to insert
                const { data, error } = await supabase.from('players').insert({ name: player.name }).select('id').single();
                if (error) {
                    // might exist
                    const { data: ext, error: err2 } = await supabase.from('players').select('id').eq('name', player.name).single();
                    if (ext) {
                        playerIds[player.name] = ext.id;
                    } else {
                        console.error(err2);
                    }
                } else {
                    playerIds[player.name] = data.id;
                }
            }
        }
    }

    // Insert games and scores
    for (const game of games) {
        // insert game
        const { data: gameRow, error: gError } = await supabase.from('games').insert({ date: game.date }).select('id').single();
        if (gError) {
            console.error(gError);
            continue;
        }

        // insert scores for this game
        const scoreInserts = game.players.map(p => ({
            game_id: gameRow.id,
            player_id: playerIds[p.name],
            scores: p.scores,
            total: p.total
        }));

        const { error: sError } = await supabase.from('game_scores').insert(scoreInserts);
        if (sError) {
            console.error(sError);
        }
    }

    console.log('Done seeding.');
}

seed().catch(console.error);
