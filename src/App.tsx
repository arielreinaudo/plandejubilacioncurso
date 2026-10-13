/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  RotateCcw, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  ArrowDown
} from 'lucide-react';
import { Header } from './components/Header.tsx';
import { InputSections } from './components/InputSections.tsx';
import { ResultsDisplay } from './components/ResultsDisplay.tsx';
import { RetirementChart } from './components/RetirementChart.tsx';
import { EducationalFooter } from './components/EducationalFooter.tsx';
import { 
  DEFAULT_INPUTS, 
  RetirementInputs, 
  calculateRetirementPlan, 
  RetirementResults 
} from './logic/financialMath.ts';

export default function App() {
  // Valores en el formulario que el usuario puede editar libremente
  const [draftInputs, setDraftInputs] = useState<RetirementInputs>({ ...DEFAULT_INPUTS });

  // Valores actualmente aplicados al cálculo visible y al gráfico
  const [activeInputs, setActiveInputs] = useState<RetirementInputs>({ ...DEFAULT_INPUTS });

  // Resultados calculados deterministas
  const [results, setResults] = useState<RetirementResults>(() => 
    calculateRetirementPlan(DEFAULT_INPUTS)
  );

  // Errores de validación
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Detección de cambios pendientes
  const hasPendingChanges = useMemo(() => {
    return JSON.stringify(draftInputs) !== JSON.stringify(activeInputs);
  }, [draftInputs, activeInputs]);

  // Manejador de cambio de campos
  const handleInputChange = (field: keyof RetirementInputs, value: number | boolean) => {
    setDraftInputs((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpiar error del campo modificado si existía
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Validación rigurosa de campos antes del cálculo
  const validateInputs = (inputs: RetirementInputs): boolean => {
    const newErrors: Record<string, string> = {};

    if (isNaN(inputs.gastosMensuales) || inputs.gastosMensuales < 0) {
      newErrors.gastosMensuales = 'El gasto mensual no puede ser negativo ni estar vacío.';
    }
    if (isNaN(inputs.otrosIngresosMensuales) || inputs.otrosIngresosMensuales < 0) {
      newErrors.otrosIngresosMensuales = 'Los otros ingresos no pueden ser negativos.';
    }
    if (isNaN(inputs.patrimonioInicial) || inputs.patrimonioInicial < 0) {
      newErrors.patrimonioInicial = 'El patrimonio inicial no puede ser negativo.';
    }
    if (isNaN(inputs.aporteMensual) || inputs.aporteMensual < 0) {
      newErrors.aporteMensual = 'El aporte mensual no puede ser negativo.';
    }
    if (isNaN(inputs.tasaRetiro) || inputs.tasaRetiro <= 0) {
      newErrors.tasaRetiro = 'La tasa de retiro debe ser mayor a 0%.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Botón principal: CALCULAR MI JUBILACIÓN
  const handleCalculate = () => {
    if (!validateInputs(draftInputs)) {
      return;
    }

    const calculatedResults = calculateRetirementPlan(draftInputs);
    setActiveInputs({ ...draftInputs });
    setResults(calculatedResults);

    // Desplazamiento suave hacia la sección de resultados
    const resultsElement = document.getElementById('seccion-resultados');
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Botón secundario: Restablecer ejemplo
  const handleReset = () => {
    setDraftInputs({ ...DEFAULT_INPUTS });
    setActiveInputs({ ...DEFAULT_INPUTS });
    setErrors({});
    const initialResults = calculateRetirementPlan(DEFAULT_INPUTS);
    setResults(initialResults);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-sky-200 selection:text-sky-900">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* FORMULARIO DE ENTRADA: 3 SECCIONES + OPCIONES ADICIONALES */}
        <section aria-label="Parámetros de jubilación">
          <InputSections
            values={draftInputs}
            onChange={handleInputChange}
            errors={errors}
          />
        </section>

        {/* BARRA DE ACCIONES Y BOTONES */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {hasPendingChanges ? (
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm font-semibold animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Tenés cambios pendientes. Presioná Calcular para actualizar.</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Resultados actualizados con los valores en pantalla.</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto w-full sm:w-auto">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center justify-center gap-2"
                title="Restablecer los valores iniciales de ejemplo"
              >
                <RotateCcw className="w-4 h-4 text-slate-500" />
                <span className="whitespace-nowrap">Restablecer ejemplo</span>
              </button>

              <button
                type="button"
                onClick={handleCalculate}
                className={`flex-1 sm:flex-initial px-6 sm:px-8 py-3 rounded-lg text-sm sm:text-base font-bold text-white shadow-sm transition-all flex items-center justify-center gap-2.5 whitespace-nowrap cursor-pointer ${
                  hasPendingChanges
                    ? 'bg-sky-700 hover:bg-sky-800 ring-2 ring-sky-400 ring-offset-2'
                    : 'bg-sky-800 hover:bg-sky-900'
                }`}
              >
                <Calculator className="w-5 h-5" />
                <span>CALCULAR MI JUBILACIÓN</span>
              </button>
            </div>
          </div>
        </div>

        {/* SECCIÓN DE RESULTADOS EN ORDEN RIGUROSO */}
        <section id="seccion-resultados" className="scroll-mt-6 space-y-8">
          <ResultsDisplay results={results} inputs={activeInputs} />

          {/* GRÁFICO PRINCIPAL */}
          <RetirementChart
            data={results.chartData}
            compararOro={activeInputs.compararOro}
          />
        </section>
      </main>

      <EducationalFooter />
    </div>
  );
}
