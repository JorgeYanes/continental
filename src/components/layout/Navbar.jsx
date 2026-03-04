import React from 'react';
import { Activity, Users, PlusCircle, Dices } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
    return (
        <nav className="bg-slate-900 border-b border-emerald-900/50 sticky top-0 z-10 shadow-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-10 bg-emerald-600 rounded-sm flex items-center justify-center shadow-inner border border-emerald-400/50 transform rotate-[-5deg]">
                            <Dices size={20} className="text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white">
                            Continental <span className="text-emerald-400">Pro</span>
                        </span>
                    </div>

                    <div className="flex space-x-1 sm:space-x-4">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'dashboard'
                                    ? 'bg-slate-800 text-emerald-400'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <Activity size={16} className="hidden sm:block" /> Dashboard
                        </button>
                        <button
                            onClick={() => setActiveTab('stats')}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'stats'
                                    ? 'bg-slate-800 text-emerald-400'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <Users size={16} className="hidden sm:block" /> Stats
                        </button>
                        <button
                            onClick={() => setActiveTab('new')}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'new'
                                    ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-700/50'
                                    : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-md'
                                }`}
                        >
                            <PlusCircle size={16} /> <span className="hidden sm:block">Nueva Partida</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
