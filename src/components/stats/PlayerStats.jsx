import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users } from 'lucide-react';

export default function PlayerStats({ stats, selectedPlayer, setSelectedPlayer }) {
    const player = stats.players[selectedPlayer];

    if (!player) return null;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-casino-900 p-5 border border-[rgba(217,119,6,0.15)] shadow-sm gap-4">
                <h2 className="text-2xl font-serif font-bold text-ivory flex items-center gap-3">
                    <Users size={24} className="text-brass-400" /> Desempeño Individual
                </h2>
                <div className="relative">
                    <select
                        value={selectedPlayer}
                        onChange={(e) => setSelectedPlayer(e.target.value)}
                        className="appearance-none bg-casino-950 border border-brass-600/30 text-ivory rounded-none px-6 py-2.5 pr-10 focus:ring-1 focus:ring-brass-500 focus:outline-none font-sans cursor-pointer focus:border-brass-500 transition-colors"
                    >
                        {stats.playersList.map(p => (
                            <option key={p.name} value={p.name}>{p.name}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-brass-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-casino-900 border border-[rgba(217,119,6,0.15)] p-5 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-ivory/5 blur-2xl rounded-full transform translate-x-1/2 -translate-y-1/2 z-0"></div>
                    <p className="text-ivory-muted text-xs uppercase tracking-widest mb-2 relative z-10 font-sans">Partidas</p>
                    <p className="text-3xl font-mono font-bold text-ivory relative z-10">{player.gamesPlayed}</p>
                </div>
                <div className="bg-casino-900 border border-[rgba(217,119,6,0.15)] p-5 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-brass-500/10 blur-2xl rounded-full transform translate-x-1/2 -translate-y-1/2 z-0"></div>
                    <p className="text-ivory-muted text-xs uppercase tracking-widest mb-2 relative z-10 font-sans">Win Rate</p>
                    <p className="text-3xl font-mono font-bold text-brass-400 relative z-10">{player.winRate}%</p>
                </div>
                <div className="bg-casino-900 border border-[rgba(217,119,6,0.15)] p-5 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-brass-400/5 blur-2xl rounded-full transform translate-x-1/2 -translate-y-1/2 z-0"></div>
                    <p className="text-ivory-muted text-xs uppercase tracking-widest mb-2 relative z-10 font-sans">Mejor Puntaje</p>
                    <p className="text-3xl font-mono font-bold text-brass-500 relative z-10">{player.bestScore}</p>
                </div>
                <div className="bg-casino-950 border border-crimson-900/40 p-5 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-crimson-500/10 blur-2xl rounded-full transform translate-x-1/2 -translate-y-1/2 z-0"></div>
                    <p className="text-crimson-500/80 text-xs uppercase tracking-widest mb-2 relative z-10 font-sans">Peor Puntaje</p>
                    <p className="text-3xl font-mono font-bold text-crimson-500 relative z-10">{player.worstScore}</p>
                </div>
            </div>

            <div className="bg-casino-900 border border-[rgba(217,119,6,0.15)] p-6 shadow-sm">
                <h3 className="text-lg font-serif font-bold text-ivory mb-2">Evolución de Puntaje en el Ledger</h3>
                <p className="text-sm font-serif italic text-brass-500/70 mb-6">* Un puntaje menor indica cercanía a la perfección (0).</p>
                <div className="h-80 relative overflow-hidden">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={player.history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(217,119,6,0.1)" vertical={false} />
                            <XAxis dataKey="gameId" stroke="#d6d3d1" name="Partida" tick={{ fontFamily: 'Inter', fontSize: 12 }} />
                            <YAxis stroke="#d6d3d1" domain={['auto', 'auto']} reversed={false} tick={{ fontFamily: 'JetBrains Mono', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#061c13', borderColor: 'rgba(217,119,6,0.3)', color: '#fafaf9', fontFamily: 'JetBrains Mono' }}
                                labelStyle={{ color: '#d6d3d1', fontFamily: 'Inter', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}
                            />
                            <Legend wrapperStyle={{ fontFamily: 'Inter', fontSize: '13px', paddingTop: '10px' }} />
                            <Line
                                type="monotone"
                                dataKey="score"
                                name="Puntos Totales"
                                stroke="#fbbf24"
                                strokeWidth={2}
                                dot={{ r: 4, fill: '#0a2d20', stroke: '#fbbf24', strokeWidth: 2 }}
                                activeDot={{ r: 6, fill: '#fbbf24', stroke: '#061c13', strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
