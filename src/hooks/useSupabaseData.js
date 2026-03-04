import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getWinners } from '../utils/gameUtils';

export function useSupabaseData() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchGames = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('games')
                .select(`
          id,
          date,
          created_at,
          game_scores (
            scores,
            total,
            players (
              name
            )
          )
        `)
                .order('created_at', { ascending: true });

            if (error) throw error;

            const formattedGames = data.map((dbGame, index) => {
                const players = dbGame.game_scores.map(s => ({
                    name: s.players.name,
                    scores: s.scores,
                    total: s.total
                }));

                return {
                    id: index + 1, // Auto-increment para mostrar en la gráfica
                    dbId: dbGame.id,
                    date: dbGame.date,
                    players,
                    winners: getWinners(players)
                };
            });

            setGames(formattedGames);
        } catch (err) {
            console.error('Error fetching data from Supabase:', err);
        } finally {
            setLoading(false);
        }
    };

    const saveNewGame = async (gameData) => {
        try {
            // 1. Crear el juego
            const { data: gameResponse, error: gameError } = await supabase
                .from('games')
                .insert({ date: gameData.date })
                .select()
                .single();

            if (gameError) throw gameError;

            // 2. Resolver IDs de los jugadores (Crear si no existen)
            const playerIds = {};

            for (const player of gameData.players) {
                let playerId = null;

                // Intentar buscar
                const { data: foundPlayer, error: findError } = await supabase
                    .from('players')
                    .select('id')
                    .eq('name', player.name)
                    .single();

                if (foundPlayer) {
                    playerId = foundPlayer.id;
                } else {
                    // Intentar insertar
                    const { data: newPlayer, error: insertError } = await supabase
                        .from('players')
                        .insert({ name: player.name })
                        .select('id')
                        .single();

                    if (insertError) throw insertError;
                    playerId = newPlayer.id;
                }

                playerIds[player.name] = playerId;
            }

            // 3. Crear los Puntajes
            // Asegurarse de insertar el arreglo con los datos mapeados
            const scoreRows = gameData.players.map(p => ({
                game_id: gameResponse.id,
                player_id: playerIds[p.name],
                scores: p.scores,
                total: p.total
            }));

            const { error: scoresError } = await supabase
                .from('game_scores')
                .insert(scoreRows);

            if (scoresError) throw scoresError;

            // Volver a descargar los datos actualizados
            await fetchGames();
            return true;

        } catch (err) {
            console.error('Error saving game to Supabase:', err);
            return false;
        }
    };

    useEffect(() => {
        fetchGames();

        // (Opcional) Suscripción a Realtime changes
        const channel = supabase
            .channel('schema-db-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'game_scores' }, () => {
                console.log('Detected DB changes, fetching...');
                fetchGames();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return { games, loading, saveNewGame };
}
