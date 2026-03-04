import React from 'react';

export default function Footer() {
    return (
        <footer className="max-w-7xl mx-auto px-4 py-8 mt-auto border-t border-[rgba(217,119,6,0.15)] text-center text-ivory-muted/50 text-xs font-mono uppercase tracking-widest flex justify-center items-center">
            El Ledger Oficial · Continental PR © {new Date().getFullYear()}
        </footer>
    );
}
