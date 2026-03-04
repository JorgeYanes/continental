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
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4">
                <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                    <PlusCircle size={24} /> Registrar Nueva Partida
                </h2>
                <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-slate-400" />
                    <input
                        type="date"
                        value={newGameData.date}
                        onChange={(e) => setNewGameData({ ...newGameData, date: e.target.value })}
                        className="bg-slate-900 border border-slate-600 text-slate-100 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="p-3 text-slate-400 font-medium text-sm border-b border-slate-700 w-32">Jugador</th>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                <th key={num} className="p-3 text-center text-slate-400 font-medium text-sm border-b border-slate-700">R{num}</th>
                            ))}
                            <th className="p-3 text-center text-emerald-400 font-bold text-sm border-b border-slate-700">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {newGameData.players.map((player, pIdx) => (
                            <tr key={pIdx} className="hover:bg-slate-750 border-b border-slate-700/50 last:border-0">
                                <td className="p-2">
                                    <input
                                        type="text"
                                        placeholder="Nombre"
                                        value={player.name}
                                        onChange={(e) => handleNameChange(pIdx, e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-2 text-slate-100 focus:border-emerald-500 outline-none font-medium"
                                    />
                                </td>
                                {player.scores.map((score, sIdx) => (
                                    <td key={sIdx} className="p-1">
                                        <input
                                            type="number"
                                            min="0"
                                            value={score}
                                            onChange={(e) => handleScoreChange(pIdx, sIdx, e.target.value)}
                                            className="w-12 h-10 mx-auto block text-center bg-slate-900 border border-slate-600 rounded text-slate-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none appearance-none"
                                        />
                                    </td>
                                ))}
                                <td className="p-3 text-center">
                                    <span className={`text-xl font-bold ${calculateTotal(player.scores) === 0 ? 'text-slate-500' : 'text-amber-400'}`}>
                                        {calculateTotal(player.scores)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Sección IA Narrador de Partida */}
            <div className="mt-6 bg-slate-900/80 border border-emerald-900/30 rounded-xl p-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h4 className="text-emerald-400 font-bold flex items-center gap-2">
                            <Bot size={18} /> Narrador en Vivo (IA)
                        </h4>
                        <p className="text-xs text-slate-400">¿Quieres saber cómo va la partida? Nuestra IA analizará los puntajes actuales y comentará sobre la marcha.</p>
                    </div>
                    <button
                        onClick={onGenerateCommentary}
                        disabled={isGeneratingAi}
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-emerald-700/50 text-emerald-400 px-4 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50 shadow-lg"
                    >
                        {isGeneratingAi ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                        ✨ Narrar Partida
                    </button>
                </div>

                {aiCommentary && (
                    <div className="mt-4 p-4 bg-slate-950 rounded-lg border border-slate-800 text-slate-300 text-sm italic leading-relaxed whitespace-pre-wrap relative">
                        <span className="absolute -top-3 left-4 bg-emerald-900 text-emerald-200 text-xs px-2 py-0.5 rounded-full border border-emerald-700">Comentario en vivo</span>
                        "{aiCommentary}"
                    </div>
                )}
            </div>

            <div className="mt-8 flex justify-end">
                <button
                    onClick={onSaveGame}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-bold transition-colors shadow-lg shadow-emerald-900/50"
                >
                    <Save size={20} /> Guardar Partida
                </button>
            </div>
        </div>
    );
}
