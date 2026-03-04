import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { Trophy, TrendingUp, TrendingDown, Dices, Medal, Activity, Bot, Loader2, Sparkles } from 'lucide-react';

const CHART_COLORS = ['#fbbf24', '#f59e0b', '#d97706', '#16654a', '#104230', '#0a2d20'];

export default function Dashboard({ stats, aiTournamentRecap, isGeneratingRecap, onGenerateRecap }) {
    return (
        <div className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-casino-900 border border-[rgba(217,119,6,0.15)] p-5 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Dices size={48} className="text-ivory" /></div>
                    <p className="text-ivory-muted tracking-widest text-xs uppercase font-sans mb-1">Total Partidas</p>
                    <h3 className="text-4xl font-serif font-bold text-ivory">{stats.totalGames}</h3>
                </div>

                <div className="bg-casino-900 border border-[rgba(217,119,6,0.15)] p-5 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Trophy size={48} className="text-brass-400" /></div>
                    <p className="text-ivory-muted tracking-widest text-xs uppercase font-sans mb-1">Máximo Ganador</p>
                    <h3 className="text-3xl font-serif font-bold text-brass-400 truncate">{stats.topWinner?.name}</h3>
                    <p className="text-sm text-ivory-muted mt-1 font-mono">{stats.topWinner?.wins} victorias</p>
                </div>

                <div className="bg-casino-900 border border-[rgba(217,119,6,0.15)] p-5 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><TrendingDown size={48} className="text-brass-500" /></div>
                    <p className="text-ivory-muted tracking-widest text-xs uppercase font-sans mb-1">Mejor Partida (Récord)</p>
                    <h3 className="text-3xl font-mono font-bold text-brass-500">{stats.globalLowest.score} pts</h3>
                    <p className="text-sm text-ivory-muted mt-1 font-serif italic">por {stats.globalLowest.player}</p>
                </div>

                <div className="bg-casino-950 border border-crimson-900/40 p-5 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><TrendingUp size={48} className="text-crimson-500" /></div>
                    <p className="text-crimson-500/80 tracking-widest text-xs uppercase font-sans mb-1">Peor Partida</p>
                    <h3 className="text-3xl font-mono font-bold text-crimson-500">{stats.globalHighest.score} pts</h3>
                    <p className="text-sm text-crimson-500/60 mt-1 font-serif italic">por {stats.globalHighest.player}</p>
                </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfico de Victorias */}
                <div className="bg-casino-900 border border-[rgba(217,119,6,0.15)] p-5 shadow-sm">
                    <h3 className="text-lg font-serif font-semibold text-ivory mb-6 flex items-center gap-2 border-b border-[rgba(217,119,6,0.10)] pb-3">
                        <Medal size={20} className="text-brass-400" /> Distribución de Victorias
                    </h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.playersList.filter(p => p.wins > 0)}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(217,119,6,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="#d6d3d1" tick={{ fontFamily: 'Inter', fontSize: 12 }} />
                                <YAxis stroke="#d6d3d1" allowDecimals={false} tick={{ fontFamily: 'JetBrains Mono', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(217,119,6,0.05)' }}
                                    contentStyle={{ backgroundColor: '#061c13', borderColor: 'rgba(217,119,6,0.2)', color: '#fafaf9', fontFamily: 'JetBrains Mono' }}
                                    itemStyle={{ color: '#fbbf24', fontWeight: 'bold' }}
                                />
                                <Bar dataKey="wins" name="Victorias" radius={[0, 0, 0, 0]}>
                                    {stats.playersList.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Gráfico de Promedios */}
                <div className="bg-casino-900 border border-[rgba(217,119,6,0.15)] p-5 shadow-sm">
                    <h3 className="text-lg font-serif font-semibold text-ivory mb-6 flex items-center gap-2 border-b border-[rgba(217,119,6,0.10)] pb-3">
                        <Activity size={20} className="text-brass-400" /> Promedio de Puntos
                    </h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.playersList} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(217,119,6,0.05)" horizontal={false} />
                                <XAxis type="number" stroke="#d6d3d1" tick={{ fontFamily: 'JetBrains Mono', fontSize: 12 }} />
                                <YAxis dataKey="name" type="category" stroke="#d6d3d1" width={80} tick={{ fontFamily: 'Inter', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(217,119,6,0.05)' }}
                                    contentStyle={{ backgroundColor: '#061c13', borderColor: 'rgba(217,119,6,0.2)', color: '#fafaf9', fontFamily: 'JetBrains Mono' }}
                                />
                                <Bar dataKey="avgScore" name="Promedio" fill="#16654a" radius={[0, 0, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Tarjeta IA Dashboard - Resumen del Torneo */}
            <div className="bg-casino-950 border border-[rgba(217,119,6,0.15)] shadow-sm mt-6 relative overflow-hidden p-6 group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brass-600/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 relative z-10">
                    <div>
                        <h3 className="text-xl font-serif font-bold text-brass-400 flex items-center gap-2">
                            <Bot size={24} className="text-brass-500" /> El Oráculo del Casino
                        </h3>
                        <p className="text-sm text-ivory-muted mt-1 font-sans">
                            Análisis omnisciente del historial y las rivalidades del torneo.
                        </p>
                    </div>
                    <button
                        onClick={onGenerateRecap}
                        disabled={isGeneratingRecap}
                        className="flex items-center gap-2 bg-transparent hover:bg-brass-500/10 border border-brass-600/50 text-brass-400 px-5 py-2.5 text-sm font-bold transition-all disabled:opacity-50 whitespace-nowrap uppercase tracking-widest"
                    >
                        {isGeneratingRecap ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                        Consultar al Oráculo
                    </button>
                </div>

                <div className="relative z-10">
                    {aiTournamentRecap ? (
                        <div className="text-ivory text-sm leading-relaxed whitespace-pre-wrap font-serif border-l-2 border-brass-500/50 pl-5 py-2 bg-[rgba(217,119,6,0.02)]">
                            {aiTournamentRecap}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-ivory-muted/40 font-serif italic">
                            <Bot size={48} className="mb-4 opacity-20" />
                            <p>El Oráculo aguarda en silencio.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
