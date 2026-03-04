import React from 'react';
import { PlusCircle, Calendar, Bot, Loader2, Sparkles, Save } from 'lucide-react';
import { calculateTotal } from '../../utils/gameUtils';

export default function NewGame({
    newGameData,
    setNewGameData,
    onSaveGame,
    aiCommentary,
    isGeneratingAi,
    onGenerateCommentary
}) {

    const handleScoreChange = (playerIndex, scoreIndex, value) => {
        const updatedPlayers = [...newGameData.players];
        updatedPlayers[playerIndex].scores[scoreIndex] = value;
        setNewGameData({ ...newGameData, players: updatedPlayers });
    };

    const handleNameChange = (playerIndex, value) => {
        const updatedPlayers = [...newGameData.players];
        updatedPlayers[playerIndex].name = value;
        setNewGameData({ ...newGameData, players: updatedPlayers });
    };

    return (
        <div className="bg-casino-900 border border-[rgba(217,119,6,0.15)] p-1 sm:p-2 shadow-xl max-w-5xl mx-auto">
            <div className="bg-casino-950 border border-[rgba(217,119,6,0.10)] p-4 sm:p-6 mb-1">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 border-b border-[rgba(217,119,6,0.15)] pb-4 gap-4">
                    <h2 className="text-2xl font-serif font-bold text-ivory flex items-center gap-2">
                        <PlusCircle size={24} className="text-brass-500" /> Registro de Puntajes
                    </h2>
                    <div className="flex items-center gap-2 font-mono text-sm bg-casino-900 px-3 py-1.5 border border-[rgba(217,119,6,0.15)]">
                        <Calendar size={16} className="text-brass-500" />
                        <input
                            type="date"
                            value={newGameData.date}
                            onChange={(e) => setNewGameData({ ...newGameData, date: e.target.value })}
                            className="bg-transparent text-brass-400 focus:outline-none focus:text-brass-400 [color-scheme:dark]"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="p-3 text-ivory-muted font-sans font-medium text-xs uppercase tracking-widest border-b border-[rgba(217,119,6,0.15)] w-32">Jugador</th>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                    <th key={num} className="p-3 text-center text-ivory-muted font-mono text-xs uppercase border-b border-[rgba(217,119,6,0.15)] text-opacity-60">R{num}</th>
                                ))}
                                <th className="p-3 text-center text-brass-500 font-mono text-xs uppercase tracking-widest border-b border-[rgba(217,119,6,0.15)]">TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {newGameData.players.map((player, pIdx) => (
                                <tr key={pIdx} className="hover:bg-[rgba(217,119,6,0.02)] border-b border-[rgba(217,119,6,0.10)] last:border-0 transition-colors">
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            placeholder="Nombre"
                                            value={player.name}
                                            onChange={(e) => handleNameChange(pIdx, e.target.value)}
                                            className="w-full bg-transparent px-2 py-2 text-ivory focus:bg-casino-900 border-b border-transparent focus:border-brass-600/50 outline-none font-sans font-medium transition-colors"
                                        />
                                    </td>
                                    {player.scores.map((score, sIdx) => (
                                        <td key={sIdx} className="p-1">
                                            <input
                                                type="number"
                                                min="0"
                                                value={score}
                                                onChange={(e) => handleScoreChange(pIdx, sIdx, e.target.value)}
                                                className="w-12 h-12 mx-auto block text-center bg-casino-900 focus:bg-casino-800 border border-[rgba(255,255,255,0.03)] focus:border-brass-600 text-ivory font-mono text-lg outline-none appearance-none transition-all shadow-inner"
                                            />
                                        </td>
                                    ))}
                                    <td className="p-3 text-center bg-[rgba(217,119,6,0.03)] border-l border-[rgba(217,119,6,0.05)]">
                                        <span className={`text-2xl font-mono ${calculateTotal(player.scores) === 0 ? 'text-ivory-muted opacity-30' : 'text-brass-400'}`}>
                                            {calculateTotal(player.scores) || '0'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Sección IA Narrador de Partida */}
            <div className="mt-4 bg-casino-950 border border-[rgba(217,119,6,0.10)] p-4 sm:p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brass-600/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
                    <div>
                        <h4 className="text-brass-400 font-serif font-bold text-lg flex items-center gap-2">
                            <Bot size={20} className="text-brass-500" /> El Oráculo (En Vivo)
                        </h4>
                        <p className="text-sm text-ivory-muted mt-1 max-w-xl">
                            ¿Quieres saber cómo va la partida? Solicita un análisis en tiempo real de los puntajes del ledger.
                        </p>
                    </div>
                    <button
                        onClick={onGenerateCommentary}
                        disabled={isGeneratingAi}
                        className="flex items-center gap-2 bg-transparent hover:bg-brass-500/10 border border-brass-600/50 text-brass-400 px-5 py-2.5 text-sm font-bold transition-all disabled:opacity-50 whitespace-nowrap"
                    >
                        {isGeneratingAi ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                        Solicitar Análisis
                    </button>
                </div>

                {aiCommentary && (
                    <div className="mt-5 pt-5 border-t border-[rgba(217,119,6,0.10)] relative z-10">
                        <div className="text-ivory text-sm italic font-serif leading-relaxed px-4 border-l-2 border-brass-500/50">
                            {aiCommentary}
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-4 flex justify-end px-2">
                <button
                    onClick={onSaveGame}
                    className="flex items-center gap-2 bg-casino-800 hover:bg-casino-700 border border-brass-600/30 text-brass-400 px-8 py-3 font-bold transition-all shadow-lg hover:shadow-brass-500/10 uppercase tracking-widest text-sm"
                >
                    <Save size={18} /> Almacenar en Ledger
                </button>
            </div>
        </div>
    );
}
