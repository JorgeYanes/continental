import React from 'react';

export default function Footer() {
    return (
        <footer className="max-w-7xl mx-auto px-4 py-6 mt-auto border-t border-slate-800 text-center text-slate-500 text-sm flex justify-center items-center">
            Continental PR - {new Date().getFullYear()}
        </footer>
    );
}
