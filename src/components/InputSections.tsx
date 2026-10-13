import React, { useState } from 'react';
import { 
  DollarSign, 
  Wallet, 
  PiggyBank, 
  Calendar, 
  TrendingUp, 
  Flame, 
  ChevronDown, 
  ChevronUp, 
  ShieldAlert, 
  HelpCircle,
  Coins,
  Percent
} from 'lucide-react';
import { RetirementInputs, formatPercent } from '../logic/financialMath.ts';

interface InputSectionsProps {
  values: RetirementInputs;
  onChange: (field: keyof RetirementInputs, value: number | boolean) => void;
  errors: Record<string, string>;
}

const HORIZONTE_OPCIONES = [5, 10, 15, 20, 25, 30, 35, 40];

export const InputSections: React.FC<InputSectionsProps> = ({
  values,
  onChange,
  errors,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Helper para generar opciones de porcentajes en incrementos de 0,5%
  const renderPercentOptions = (min: number, max: number, step: number = 0.5) => {
    const options = [];
    for (let val = min; val <= max + 0.0001; val += step) {
      const rounded = Math.round(val * 10) / 10;
      options.push(
        <option key={rounded} value={rounded}>
          {formatPercent(rounded)}
        </option>
      );
    }
    return options;
  };

  return (
    <div className="space-y-6">
      {/* SECCIÓN 1: ¿CUÁNTO NECESITO PARA VIVIR? */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-sm shrink-0">
            1
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              ¿Cuánto necesito para vivir?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Estos dos campos permitirán calcular cuánto deberá financiar el patrimonio invertido.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* Campo 1: Gastos mensuales */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Gasto promedio mensual de los últimos 12 meses (USD)
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <DollarSign className="w-4 h-4" />
              </div>
              <input
                type="number"
                min="0"
                step="50"
                value={values.gastosMensuales === 0 ? '' : values.gastosMensuales}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                  onChange('gastosMensuales', isNaN(val) ? 0 : Math.max(0, val));
                }}
                className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border rounded-lg text-slate-900 font-mono-numbers text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent transition-colors ${
                  errors.gastosMensuales ? 'border-amber-400 ring-1 ring-amber-300' : 'border-slate-200'
                }`}
                placeholder="2500"
              />
            </div>
            {errors.gastosMensuales ? (
              <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                {errors.gastosMensuales}
              </p>
            ) : (
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Ingresá el promedio mensual de tus gastos reales, sin incluir ahorro ni inversiones.
              </p>
            )}
          </div>

          {/* Campo 2: Otros ingresos mensuales previstos */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Otros ingresos mensuales previstos al jubilarme (USD de hoy)
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <DollarSign className="w-4 h-4" />
              </div>
              <input
                type="number"
                min="0"
                step="50"
                value={values.otrosIngresosMensuales === 0 ? '' : values.otrosIngresosMensuales}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                  onChange('otrosIngresosMensuales', isNaN(val) ? 0 : Math.max(0, val));
                }}
                className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border rounded-lg text-slate-900 font-mono-numbers text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent transition-colors ${
                  errors.otrosIngresosMensuales ? 'border-amber-400 ring-1 ring-amber-300' : 'border-slate-200'
                }`}
                placeholder="1000"
              />
            </div>
            {errors.otrosIngresosMensuales ? (
              <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                {errors.otrosIngresosMensuales}
              </p>
            ) : (
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Por ejemplo, jubilación estatal, pensión o ingresos netos por alquileres. Colocá 0 si no contás con ellos.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: ¿CON CUÁNTO CUENTO Y CUÁNTO PUEDO INVERTIR? */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-sm shrink-0">
            2
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              ¿Con cuánto cuento y cuánto puedo invertir?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Tu punto de partida actual y tu capacidad periódica de ahorro e inversión.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* Campo 3: Patrimonio actual */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1 flex items-center justify-between">
              <span>Patrimonio invertido actual (USD)</span>
              <span className="text-xs font-normal text-slate-400">Capital inicial</span>
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Wallet className="w-4 h-4" />
              </div>
              <input
                type="number"
                min="0"
                step="500"
                value={values.patrimonioInicial === 0 ? '' : values.patrimonioInicial}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                  onChange('patrimonioInicial', isNaN(val) ? 0 : Math.max(0, val));
                }}
                className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border rounded-lg text-slate-900 font-mono-numbers text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent transition-colors ${
                  errors.patrimonioInicial ? 'border-amber-400 ring-1 ring-amber-300' : 'border-slate-200'
                }`}
                placeholder="10000"
              />
            </div>
            {errors.patrimonioInicial ? (
              <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                {errors.patrimonioInicial}
              </p>
            ) : (
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Dinero que ya tenés colocado en instrumentos financieros o ahorros destinados a este fin.
              </p>
            )}
          </div>

          {/* Campo 4: Aporte mensual */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1 flex items-center justify-between">
              <span>Aporte mensual destinado a inversiones (USD)</span>
              <span className="text-xs font-normal text-slate-400">Aporte constante</span>
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <PiggyBank className="w-4 h-4" />
              </div>
              <input
                type="number"
                min="0"
                step="50"
                value={values.aporteMensual === 0 ? '' : values.aporteMensual}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                  onChange('aporteMensual', isNaN(val) ? 0 : Math.max(0, val));
                }}
                className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border rounded-lg text-slate-900 font-mono-numbers text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent transition-colors ${
                  errors.aporteMensual ? 'border-amber-400 ring-1 ring-amber-300' : 'border-slate-200'
                }`}
                placeholder="300"
              />
            </div>
            {errors.aporteMensual ? (
              <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                {errors.aporteMensual}
              </p>
            ) : (
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Cantidad que podés apartar periódicamente cada mes para sumar a tu cartera de inversión.
              </p>
            )}
          </div>
        </div>

        {/* Campo 5: Años hasta jubilarme */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <label className="block text-sm font-semibold text-slate-800 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-sky-700" />
              Años hasta jubilarme
            </span>
            <span className="text-sm font-bold text-sky-800 font-mono-numbers bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
              {values.anosJubilacion} años
            </span>
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {HORIZONTE_OPCIONES.map((anios) => {
              const isSelected = values.anosJubilacion === anios;
              return (
                <button
                  type="button"
                  key={anios}
                  onClick={() => onChange('anosJubilacion', anios)}
                  className={`py-2 px-1 text-center rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-sky-800 text-white shadow-xs font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60'
                  }`}
                >
                  {anios} años
                </button>
              );
            })}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Horizonte temporal en el que tu capital tendrá tiempo de crecer gracias al interés compuesto.
          </p>
        </div>
      </div>

      {/* SECCIÓN 3: ¿QUÉ CRECIMIENTO PODEMOS ESTIMAR? */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-sm shrink-0">
            3
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              ¿Qué crecimiento podemos estimar?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Hipótesis anuales promedio para proyectar el rendimiento de la inversión y la inflación del dólar.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* Campo 6: Rentabilidad nominal anual estimada */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-sky-700" />
                Rentabilidad nominal anual estimada
              </span>
              <span className="text-sm font-bold text-sky-800 font-mono-numbers">
                {formatPercent(values.rentabilidadAnual)}
              </span>
            </label>
            <div className="mt-1">
              <select
                value={values.rentabilidadAnual}
                onChange={(e) => onChange('rentabilidadAnual', parseFloat(e.target.value))}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono-numbers text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent transition-colors"
              >
                {renderPercentOptions(0, 15, 0.5)}
              </select>
            </div>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Tasa anual hipotética promedio antes de inflación (históricamente una cartera diversificada global rindió entre 7% y 10% nominal).
            </p>
          </div>

          {/* Campo 7: Inflación anual estimada del USD */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-600" />
                Inflación anual estimada del USD
              </span>
              <span className="text-sm font-bold text-amber-700 font-mono-numbers">
                {formatPercent(values.inflacionAnual)}
              </span>
            </label>
            <div className="mt-1">
              <select
                value={values.inflacionAnual}
                onChange={(e) => onChange('inflacionAnual', parseFloat(e.target.value))}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono-numbers text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent transition-colors"
              >
                {renderPercentOptions(0, 12, 0.5)}
              </select>
            </div>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Pérdida anual estimada de poder adquisitivo del dólar (el promedio histórico suele ubicarse en torno al 2,5% - 3,5%).
            </p>
          </div>
        </div>
      </div>

      {/* OPCIONES ADICIONALES (Colapsable) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full px-5 sm:px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-800">
              {showAdvanced ? 'Ocultar opciones adicionales' : 'Mostrar opciones adicionales'}
            </span>
            <span className="text-xs text-slate-500">
              (Tasa de retiro, ajuste de aportes y comparación con oro)
            </span>
          </div>
          {showAdvanced ? (
            <ChevronUp className="w-5 h-5 text-slate-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-500" />
          )}
        </button>

        {showAdvanced && (
          <div className="p-5 sm:p-6 border-t border-slate-200 bg-slate-50/50 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Campo 8: Tasa de retiro inicial anual */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5 text-sky-700" />
                    Tasa de retiro inicial anual
                  </span>
                  <span className="text-sm font-bold text-sky-800 font-mono-numbers">
                    {formatPercent(values.tasaRetiro)}
                  </span>
                </label>
                <div className="mt-1">
                  <select
                    value={values.tasaRetiro}
                    onChange={(e) => onChange('tasaRetiro', parseFloat(e.target.value))}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono-numbers text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 transition-colors"
                  >
                    {renderPercentOptions(2, 6, 0.5)}
                  </select>
                </div>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Esta tasa se utiliza para estimar el patrimonio necesario al jubilarte. No representa la rentabilidad de las inversiones ni garantiza que el capital dure toda la jubilación.
                </p>
              </div>

              {/* Campo 9: Aumento anual de los aportes */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1 flex items-center justify-between">
                  <span>Aumento anual de los aportes</span>
                  <span className="text-sm font-bold text-sky-800 font-mono-numbers">
                    {formatPercent(values.incrementoAnualAporte)}
                  </span>
                </label>
                <div className="mt-1">
                  <select
                    value={values.incrementoAnualAporte}
                    onChange={(e) => onChange('incrementoAnualAporte', parseFloat(e.target.value))}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono-numbers text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 transition-colors"
                  >
                    {renderPercentOptions(0, 15, 0.5)}
                  </select>
                </div>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Aumento que aplicarás a tu aporte mensual una vez al año (por ejemplo, acompañando aumentos de ingresos o ajuste por costo de vida).
                </p>
              </div>
            </div>

            {/* Campo 10: Comparar también frente al oro */}
            <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-200/80">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={values.compararOro}
                  onChange={(e) => onChange('compararOro', e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <div>
                  <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-amber-600" />
                    Comparar también frente al oro
                  </span>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Permite visualizar el valor de preservación patrimonial tomando el oro como activo de reserva.
                  </p>
                </div>
              </label>

              {values.compararOro && (
                <div className="mt-4 pt-3 border-t border-amber-200/60 max-w-sm">
                  <label className="block text-xs font-semibold text-slate-800 mb-1 flex items-center justify-between">
                    <span>Apreciación anual estimada del oro en USD</span>
                    <span className="text-xs font-bold text-amber-800 font-mono-numbers">
                      {formatPercent(values.apreciacionOro)}
                    </span>
                  </label>
                  <select
                    value={values.apreciacionOro}
                    onChange={(e) => onChange('apreciacionOro', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-slate-900 font-mono-numbers text-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                  >
                    {renderPercentOptions(0, 20, 0.5)}
                  </select>
                  <p className="text-xs text-slate-500 mt-1.5">
                    Esta comparación es independiente del cálculo de inflación (no se suman la inflación y la apreciación del oro).
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
