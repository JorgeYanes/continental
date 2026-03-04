import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users } from 'lucide-react';

export default function PlayerStats({ stats, selectedPlayer, setSelectedPlayer }) {
    const player = stats.players[selectedPlayer];

    if (!player) return null;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-sm gap-4">
                <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                    <Users size={24} /> Desempeño Individual
                </h2>
                <select
                    value={selectedPlayer}
                    onChange={(e) => setSelectedPlayer(e.target.value)}
                    className="bg-slate-900 border border-slate-600 text-slate-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                    {stats.playersList.map(p => (
                        <option key={p.name} value={p.name}>{p.name}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Partidas Jugadas</p>
                    <p className="text-2xl font-bold text-slate-100">{player.gamesPlayed}</p>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Win Rate</p>
                    <p className="text-2xl font-bold text-amber-400">{player.winRate}%</p>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Mejor Puntaje</p>
                    <p className="text-2xl font-bold text-emerald-400">{player.bestScore}</p>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Peor Puntaje</p>
                    <p className="text-2xl font-bold text-red-400">{player.worstScore}</p>
                </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Evolución de Puntaje</h3>
                <p className="text-xs text-slate-400 mb-4">* Recuerda que en este juego, menos puntos es mejor.</p>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={player.history}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="gameId" stroke="#94a3b8" name="Partida" />
                            <YAxis stroke="#94a3b8" domain={['auto', 'auto']} reversed={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                                labelStyle={{ color: '#94a3b8' }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="score"
                                name="Puntos Totales"
                                stroke="#10b981"
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
                                activeDot={{ r: 6, stroke: '#0f172a', strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
