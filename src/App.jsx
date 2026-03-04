import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Dashboard from './components/dashboard/Dashboard';
import PlayerStats from './components/stats/PlayerStats';
import NewGame from './components/game/NewGame';
import { calculateTotal } from './utils/gameUtils';
import { generateGeminiText } from './utils/api';
import { useSupabaseData } from './hooks/useSupabaseData';

// --- COMPONENTE PRINCIPAL ---
export default function App() {
  const { games, loading, saveNewGame: saveToSupabase } = useSupabaseData();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPlayer, setSelectedPlayer] = useState('');

  // Estados para las integraciones con IA (Gemini API)
  const [aiCommentary, setAiCommentary] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiTournamentRecap, setAiTournamentRecap] = useState("");
  const [isGeneratingRecap, setIsGeneratingRecap] = useState(false);

  // --- CÁLCULOS DE ESTADÍSTICAS ---
  const stats = useMemo(() => {
    if (!games || games.length === 0) return null;

    const playerStats = {};
    let globalLowest = { score: Infinity, player: '', date: '' };
    let globalHighest = { score: -Infinity, player: '', date: '' };

    games.forEach(game => {
      game.players.forEach(p => {
        // Inicializar jugador
        if (!playerStats[p.name]) {
          playerStats[p.name] = {
            name: p.name,
            gamesPlayed: 0,
            wins: 0,
            totalScore: 0,
            bestScore: Infinity,
            worstScore: -Infinity,
            history: []
          };
        }

        const ps = playerStats[p.name];
        ps.gamesPlayed += 1;
        ps.totalScore += p.total;

        if (p.total < ps.bestScore) ps.bestScore = p.total;
        if (p.total > ps.worstScore) ps.worstScore = p.total;

        if (game.winners.includes(p.name)) {
          ps.wins += 1;
        }

        ps.history.push({
          gameId: game.id,
          date: game.date,
          score: p.total
        });

        // Récords globales
        if (p.total < globalLowest.score) globalLowest = { score: p.total, player: p.name, date: game.date };
        if (p.total > globalHighest.score) globalHighest = { score: p.total, player: p.name, date: game.date };
      });
    });

    Object.values(playerStats).forEach(ps => {
      ps.avgScore = Math.round(ps.totalScore / ps.gamesPlayed);
      ps.winRate = Math.round((ps.wins / ps.gamesPlayed) * 100);
    });

    const playersArray = Object.values(playerStats).sort((a, b) => b.wins - a.wins);
    const topWinner = playersArray[0];

    return {
      totalGames: games.length,
      players: playerStats,
      playersList: playersArray,
      globalLowest,
      globalHighest,
      topWinner
    };
  }, [games]);


  // Selección automática del primer jugador en la pestaña de estadísticas
  useEffect(() => {
    if (activeTab === 'stats' && !selectedPlayer && stats?.playersList?.length > 0) {
      setSelectedPlayer(stats.playersList[0].name);
    }
  }, [activeTab, stats?.playersList, selectedPlayer]);

  // --- ESTADO PARA NUEVA PARTIDA ---
  const [newGameData, setNewGameData] = useState({
    date: new Date().toISOString().split('T')[0],
    players: [
      { name: 'Mari', scores: Array(8).fill('') },
      { name: 'Maye', scores: Array(8).fill('') },
      { name: 'Juank', scores: Array(8).fill('') },
      { name: 'Jorgito', scores: Array(8).fill('') }
    ]
  });

  const handleSaveGame = async () => {
    // Validar y preparar datos
    const validPlayers = newGameData.players.filter(p => p.name.trim() !== '');
    if (validPlayers.length < 2) {
      alert("Se necesitan al menos 2 jugadores para guardar.");
      return;
    }

    const playersToSave = validPlayers.map(p => ({
      name: p.name.trim(),
      scores: p.scores.map(s => parseInt(s) || 0),
      total: calculateTotal(p.scores)
    }));

    const success = await saveToSupabase({
      date: newGameData.date,
      players: playersToSave
    });

    if (success) {
      // Resetear formulario (manteniendo nombres)
      setNewGameData({
        ...newGameData,
        players: newGameData.players.map(p => ({ ...p, scores: Array(8).fill('') }))
      });

      setAiCommentary(""); // Limpiar comentario al guardar
      setActiveTab('dashboard');
    } else {
      alert("Hubo un error al guardar en la base de datos.");
    }
  };

  // --- FUNCIONES IA (GEMINI API) ---
  const handleGenerateMatchCommentary = async () => {
    setIsGeneratingAi(true);

    let matchData = newGameData.players.map(p => {
      const roundsStr = p.scores.map((s, i) => s !== '' ? `R${i + 1}:${s}` : `R${i + 1}:--`).join(', ');
      const total = calculateTotal(p.scores);
      return `${p.name} - Total actual: ${total} [${roundsStr}]`;
    }).join('\n');

    const prompt = `Analiza los números de esta partida en curso del juego de cartas Continental.\n\nDatos:\n${matchData}\n\nEscribe un comentario dramático, sarcástico y divertido sobre cómo va el juego. Recuerda la regla principal: en Continental, el que tiene MENOS puntos va ganando (0 puntos es la perfección). Alaba al que va mejor y búrlate amistosamente del que va perdiendo. Usa tono de comentarista de casino e-sports.`;
    const system = "Eres un comentarista experto en juegos de cartas. Tienes un estilo humorístico y ácido.";

    const response = await generateGeminiText(prompt, system);
    setAiCommentary(response);
    setIsGeneratingAi(false);
  };

  const handleGenerateTournamentRecap = async () => {
    setIsGeneratingRecap(true);
    const leaderboard = stats.playersList.map(p => `${p.name}: ${p.wins} victorias absolutas, Promedio por partida: ${p.avgScore} pts, Peor desastre: ${p.worstScore} pts, Mejor racha: ${p.bestScore} pts`).join('\n');

    const prompt = `Genera un resumen épico sobre el estado general de nuestro torneo de Continental.\n\nTabla de posiciones e historial:\n${leaderboard}\n\nEscribe un boletín emocionante simulando ser un presentador estrella. Destaca al líder indiscutible (basado en sus victorias y promedio bajo) y dedícale unas palabras sarcásticas al que tiene el peor desempeño. Termina con una frase épica animando a jugar la siguiente partida.`;
    const system = "Eres el presentador estrella del Torneo Continental Pro. Conoces perfectamente las métricas y tu trabajo es avivar la rivalidad sana entre los jugadores.";

    const response = await generateGeminiText(prompt, system);
    setAiTournamentRecap(response);
    setIsGeneratingRecap(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-emerald-500">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
        <p className="font-bold text-lg animate-pulse">Cargando base de datos del casino...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && stats && (
          <Dashboard
            stats={stats}
            aiTournamentRecap={aiTournamentRecap}
            isGeneratingRecap={isGeneratingRecap}
            onGenerateRecap={handleGenerateTournamentRecap}
          />
        )}

        {activeTab === 'stats' && stats && (
          <PlayerStats
            stats={stats}
            selectedPlayer={selectedPlayer}
            setSelectedPlayer={setSelectedPlayer}
          />
        )}

        {activeTab === 'new' && (
          <NewGame
            newGameData={newGameData}
            setNewGameData={setNewGameData}
            onSaveGame={handleSaveGame}
            aiCommentary={aiCommentary}
            isGeneratingAi={isGeneratingAi}
            onGenerateCommentary={handleGenerateMatchCommentary}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}