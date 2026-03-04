import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { Trophy, TrendingUp, TrendingDown, Dices, Medal, Activity, Bot, Loader2, Sparkles } from 'lucide-react';

const CHART_COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function Dashboard({ stats, aiTournamentRecap, isGeneratingRecap, onGenerateRecap }) {
    return (
        <div className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-800 border border-emerald-900/50 rounded-xl p-5 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20"><Dices size={48} className="text-emerald-400" /></div>
                    <p className="text-slate-400 text-sm font-medium mb-1">Total Partidas</p>
                    <h3 className="text-3xl font-bold text-slate-100">{stats.totalGames}</h3>
                </div>

                <div className="bg-slate-800 border border-emerald-900/50 rounded-xl p-5 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20"><Trophy size={48} className="text-amber-400" /></div>
                    <p className="text-slate-400 text-sm font-medium mb-1">Máximo Ganador</p>
                    <h3 className="text-2xl font-bold text-amber-400 truncate">{stats.topWinner?.name}</h3>
                    <p className="text-sm text-slate-300 mt-1">{stats.topWinner?.wins} victorias</p>
                </div>

                <div className="bg-slate-800 border border-emerald-900/50 rounded-xl p-5 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20"><TrendingDown size={48} className="text-emerald-400" /></div>
                    <p className="text-slate-400 text-sm font-medium mb-1">Mejor Partida (Récord)</p>
                    <h3 className="text-2xl font-bold text-emerald-400">{stats.globalLowest.score} pts</h3>
                    <p className="text-sm text-slate-300 mt-1">por {stats.globalLowest.player}</p>
                </div>

                <div className="bg-slate-800 border border-red-900/30 rounded-xl p-5 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp size={48} className="text-red-500" /></div>
                    <p className="text-slate-400 text-sm font-medium mb-1">Peor Partida</p>
                    <h3 className="text-2xl font-bold text-red-400">{stats.globalHighest.score} pts</h3>
                    <p className="text-sm text-slate-300 mt-1">por {stats.globalHighest.player}</p>
                </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfico de Victorias */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg">
                    <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                        <Medal size={20} className="text-amber-400" /> Distribución de Victorias
                    </h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.playersList.filter(p => p.wins > 0)}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" allowDecimals={false} />
                                <Tooltip
                                    cursor={{ fill: '#1e293b' }}
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                                    itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                                />
                                <Bar dataKey="wins" name="Victorias" radius={[4, 4, 0, 0]}>
                                    {stats.playersList.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Gráfico de Promedios */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg">
                    <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                        <Activity size={20} className="text-blue-400" /> Promedio de Puntos por Jugador
                    </h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.playersList} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                                <XAxis type="number" stroke="#94a3b8" />
                                <YAxis dataKey="name" type="category" stroke="#94a3b8" width={80} />
                                <Tooltip
                                    cursor={{ fill: '#1e293b' }}
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                                />
                                <Bar dataKey="avgScore" name="Promedio" fill="#10b981" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Tarjeta IA Dashboard - Resumen del Torneo */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-emerald-900/50 rounded-xl p-5 shadow-lg mt-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 bg-emerald-500 h-full"></div>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
                            <Bot size={24} className="text-emerald-500" /> El Oráculo del Casino
                        </h3>
                        <p className="text-sm text-slate-400">Análisis potenciado por IA del estado histórico del torneo.</p>
                    </div>
                    <button
                        onClick={onGenerateRecap}
                        disabled={isGeneratingRecap}
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-emerald-700 text-emerald-400 px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
                    >
                        {isGeneratingRecap ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                        ✨ Generar Resumen Épico
                    </button>
                </div>
                {aiTournamentRecap ? (
                    <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {aiTournamentRecap}
                    </div>
                ) : (
                    <p className="text-slate-500 text-sm italic text-center py-6">
                        Presiona el botón para que nuestro comentarista estrella analice la rivalidad entre los jugadores.
                    </p>
                )}
            </div>
        </div>
    );
}
