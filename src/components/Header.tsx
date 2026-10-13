import React from 'react';
import { Compass, BookOpen } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200">
                <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                El Juego del Dinero: Aprendé las reglas antes de que jueguen con vos
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Mi Plan de Jubilación
            </h1>
            <p className="mt-2 text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
              Descubrí cuánto dinero necesitás, cuánto podés acumular y cómo alcanzar tu objetivo financiero.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center shrink-0">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
              <Compass className="w-4 h-4 text-sky-700" />
              <span>Simulación Determinista · Moneda: USD</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
