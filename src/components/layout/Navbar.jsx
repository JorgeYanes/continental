import React from 'react';
import { Activity, Users, PlusCircle, Dices } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
    return (
        <nav className="bg-casino-950 border-b border-[rgba(217,119,6,0.15)] sticky top-0 z-10 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-10 bg-casino-800 rounded-sm flex items-center justify-center shadow-inner border border-brass-600/30 transform -rotate-2">
                            <Dices size={20} className="text-ivory" />
                        </div>
                        <span className="font-serif font-bold text-2xl tracking-tight text-ivory">
                            Continental <span className="text-emerald-400">Pro</span>
                        </span>
                    </div>

                    <div className="flex space-x-1 sm:space-x-4">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`px-3 py-2 text-sm font-medium transition-colors flex items-center gap-2 border-b-2 ${activeTab === 'dashboard'
                                ? 'border-brass-500 text-brass-400'
                                : 'border-transparent text-ivory-muted hover:text-ivory'
                                }`}
                        >
                            <Activity size={16} className="hidden sm:block" /> Dashboard
                        </button>
                        <button
                            onClick={() => setActiveTab('stats')}
                            className={`px-3 py-2 text-sm font-medium transition-colors flex items-center gap-2 border-b-2 ${activeTab === 'stats'
                                ? 'border-brass-500 text-brass-400'
                                : 'border-transparent text-ivory-muted hover:text-ivory'
                                }`}
                        >
                            <Users size={16} className="hidden sm:block" /> Stats
                        </button>
                        <button
                            onClick={() => setActiveTab('new')}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition-colors flex items-center gap-2 ${activeTab === 'new'
                                ? 'bg-casino-900 text-brass-400 border border-brass-600/30 shadow-inner'
                                : 'bg-casino-800 text-ivory hover:bg-casino-700 border border-[rgba(255,255,255,0.1)]'
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
