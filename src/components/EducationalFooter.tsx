import React from 'react';
import { ShieldCheck, BookOpen, GraduationCap } from 'lucide-react';

export const EducationalFooter: React.FC = () => {
  return (
    <footer className="mt-12 pt-8 pb-12 border-t border-slate-200 text-slate-500 text-xs leading-relaxed">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="p-5 rounded-xl bg-slate-100/90 border border-slate-200 text-slate-600">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-sm mb-2">
            <ShieldCheck className="w-4 h-4 text-sky-700" />
            <span>Aviso de Responsabilidad y Naturaleza Educativa</span>
          </div>
          <p>
            Esta herramienta es una simulación educativa. Utiliza hipótesis de rentabilidad e inflación constantes para facilitar el aprendizaje. Los mercados presentan volatilidad y los resultados reales pueden diferir significativamente. Las proyecciones no contemplan impuestos, comisiones, cambios de gastos ni riesgo de secuencia de rendimientos. La tasa de retiro inicial no garantiza que el patrimonio dure durante toda la jubilación. La herramienta no constituye asesoramiento financiero personalizado.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 text-slate-400">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-sky-800" />
            <span>
              Herramienta oficial del programa: <strong className="text-slate-600">El Juego del Dinero</strong>
            </span>
          </div>
          <div>
            <span>Aprendé las reglas antes de que jueguen con vos.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
