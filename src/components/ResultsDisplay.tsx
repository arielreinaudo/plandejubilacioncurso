import React from 'react';
import { 
  Target, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowRight, 
  Coins, 
  Info,
  DollarSign
} from 'lucide-react';
import { RetirementResults, RetirementInputs, formatUSD, formatPercent } from '../logic/financialMath.ts';

interface ResultsDisplayProps {
  results: RetirementResults;
  inputs: RetirementInputs;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, inputs }) => {
  const {
    metaPatrimonialActual,
    necesidadMensual,
    necesidadAnual,
    ingresosCubrenGastos,
    gastosMensualesFuturos,
    metaFutura,
    patrimonioFinalProyectado,
    capitalInvertidoOriginal,
    totalAportesAcumulados,
    rendimientosAcumulados,
    metaAlcanzada,
    diferenciaMeta,
    aporteMensualNecesario,
    tiempoEstimadoTexto,
    metaFuturaOro,
  } = results;

  // Porcentajes para barra de composición de patrimonio
  const totalSuma = capitalInvertidoOriginal + totalAportesAcumulados + rendimientosAcumulados;
  const pctInicial = totalSuma > 0 ? (capitalInvertidoOriginal / totalSuma) * 100 : 0;
  const pctAportes = totalSuma > 0 ? (totalAportesAcumulados / totalSuma) * 100 : 0;
  const pctRendimientos = totalSuma > 0 ? (rendimientosAcumulados / totalSuma) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <span>Resultados de tu Plan</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded border border-sky-200">
            Simulación Completa
          </span>
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          A continuación tenés el diagnóstico detallado de tus necesidades, proyecciones y viabilidad.
        </p>
      </div>

      {/* RESULTADO 1: ¿CUÁNTO CAPITAL NECESITO? */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-800">
              Resultado 1 · En moneda actual
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              ¿Cuánto capital necesito?
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Regla de la Tasa de Retiro ({formatPercent(inputs.tasaRetiro)})
          </span>
        </div>

        <div className="my-5 p-5 rounded-xl bg-slate-900 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-wider uppercase text-sky-300">
              Patrimonio necesario expresado en dólares de hoy
            </p>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-mono-numbers mt-1 text-white">
              USD {formatUSD(metaPatrimonialActual)}
            </div>
            <p className="text-xs text-slate-300 mt-1">
              MI META PARA JUBILARME (VALOR PRESENTE)
            </p>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700 max-w-sm text-xs text-slate-300 leading-relaxed">
            <span className="font-semibold text-white block mb-0.5">¿Cómo se calcula?</span>
            Si invertís un capital de <strong className="text-white">USD {formatUSD(metaPatrimonialActual)}</strong> y retirás anualmente el{' '}
            <strong className="text-sky-300">{formatPercent(inputs.tasaRetiro)}</strong>, obtenés exactamente los{' '}
            <strong className="text-white">USD {formatUSD(necesidadAnual)}</strong> al año que tu cartera debe proveer.
          </div>
        </div>

        {/* Desglose educativo */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-sky-600" />
            Desglose paso a paso del cálculo
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            <div className="bg-white p-2.5 rounded border border-slate-200">
              <span className="text-slate-500 block">Gastos mensuales</span>
              <span className="font-bold text-slate-900 font-mono-numbers text-sm">
                USD {formatUSD(inputs.gastosMensuales)}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded border border-slate-200">
              <span className="text-slate-500 block">Otros ingresos</span>
              <span className="font-bold text-slate-900 font-mono-numbers text-sm">
                - USD {formatUSD(inputs.otrosIngresosMensuales)}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded border border-slate-200">
              <span className="text-slate-500 block">Necesidad mensual</span>
              <span className="font-bold text-sky-800 font-mono-numbers text-sm">
                = USD {formatUSD(necesidadMensual)}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded border border-slate-200">
              <span className="text-slate-500 block">Necesidad anual</span>
              <span className="font-bold text-slate-900 font-mono-numbers text-sm">
                USD {formatUSD(necesidadAnual)}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded border border-slate-200">
              <span className="text-slate-500 block">Tasa de retiro</span>
              <span className="font-bold text-slate-900 font-mono-numbers text-sm">
                ÷ {formatPercent(inputs.tasaRetiro)}
              </span>
            </div>

            <div className="bg-sky-50 p-2.5 rounded border border-sky-200">
              <span className="text-sky-800 block font-semibold">Meta calculada</span>
              <span className="font-extrabold text-sky-950 font-mono-numbers text-sm">
                USD {formatUSD(metaPatrimonialActual)}
              </span>
            </div>
          </div>

          {ingresosCubrenGastos && (
            <div className="mt-3 p-3 bg-amber-50 rounded border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Aclaración importante:</strong> Tus otros ingresos previstos (USD {formatUSD(inputs.otrosIngresosMensuales)}) 
                ya cubren o superan tus gastos estimados (USD {formatUSD(inputs.gastosMensuales)}). 
                Por esta razón, la meta requerida de la cartera es <strong>USD 0</strong>. Esto no significa que no necesites fondos para emergencias o imprevistos, 
                pero tu costo de vida base no dependerá del patrimonio invertido.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RESULTADO 2: ¿CUÁNTO NECESITARÉ EN EL FUTURO? */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Resultado 2 · Efecto de la inflación acumulada ({inputs.anosJubilacion} años al {formatPercent(inputs.inflacionAnual)})
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              ¿Cuánto necesitaré en el futuro?
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Valores ajustados a precios de dentro de {inputs.anosJubilacion} años
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Gasto mensual futuro estimado
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono-numbers mt-1">
              USD {formatUSD(gastosMensualesFuturos)} <span className="text-sm font-normal text-slate-500">/ mes</span>
            </div>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Para adquirir aproximadamente la misma canasta de bienes y servicios que hoy comprás con{' '}
              <strong>USD {formatUSD(inputs.gastosMensuales)}</strong>, necesitarás esa suma en dólares futuros debido a la inflación acumulada.
            </p>
          </div>

          <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-5">
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
              Meta patrimonial futura ajustada
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-900 font-mono-numbers mt-1">
              USD {formatUSD(metaFutura)}
            </div>
            <p className="text-xs text-amber-800/90 mt-2 leading-relaxed">
              Es el capital que efectivamente deberás acumular en el año {inputs.anosJubilacion} para que sus retiros tengan el mismo poder de compra que los USD {formatUSD(metaPatrimonialActual)} de hoy.
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-sky-50 rounded-lg border border-sky-200 text-xs text-sky-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-700 shrink-0" />
          <span>
            <strong>Concepto clave:</strong> Los dólares de hoy y los dólares futuros no son equivalentes. La inflación encarece los costos año a año, por lo que tu meta de acumulación debe expandirse al mismo ritmo.
          </span>
        </div>
      </div>

      {/* RESULTADO 3: ¿CUÁNTO PODRÍA ACUMULAR? */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-800">
              Resultado 3 · Capitalización con interés compuesto
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              ¿Cuánto podría acumular?
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Rendimiento estimado: {formatPercent(inputs.rentabilidadAnual)} anual
          </span>
        </div>

        <div className="my-5 p-5 rounded-xl bg-gradient-to-r from-sky-900 to-slate-900 text-white">
          <p className="text-xs font-semibold tracking-wider uppercase text-sky-300">
            Patrimonio proyectado al jubilarte
          </p>
          <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-mono-numbers mt-1 text-white">
            USD {formatUSD(patrimonioFinalProyectado)}
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Total acumulado al cabo de {inputs.anosJubilacion} años de aportes e inversión
          </p>
        </div>

        {/* Barra de composición visual */}
        <div className="space-y-2 mb-5">
          <div className="flex justify-between text-xs text-slate-600 font-medium">
            <span>Composición del patrimonio final:</span>
            <span>{pctRendimientos > 0 ? `${pctRendimientos.toFixed(1).replace('.', ',')}% generado por rendimientos` : '100% aportes propios'}</span>
          </div>
          <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
            <div 
              style={{ width: `${pctInicial}%` }} 
              className="bg-slate-400 hover:opacity-90 transition-all" 
              title={`Patrimonio inicial: ${pctInicial.toFixed(1)}%`}
            />
            <div 
              style={{ width: `${pctAportes}%` }} 
              className="bg-sky-600 hover:opacity-90 transition-all" 
              title={`Nuevos aportes: ${pctAportes.toFixed(1)}%`}
            />
            <div 
              style={{ width: `${pctRendimientos}%` }} 
              className="bg-emerald-500 hover:opacity-90 transition-all" 
              title={`Rendimientos: ${pctRendimientos.toFixed(1)}%`}
            />
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              Capital inicial ({pctInicial.toFixed(0)}%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
              Aportes nuevos ({pctAportes.toFixed(0)}%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Rendimientos ganados ({pctRendimientos.toFixed(0)}%)
            </span>
          </div>
        </div>

        {/* Desglose en tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 font-medium block">
              Patrimonio inicial
            </span>
            <span className="text-xl font-bold text-slate-900 font-mono-numbers mt-1 block">
              USD {formatUSD(capitalInvertidoOriginal)}
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              Tu punto de partida
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 font-medium block">
              Aportes nuevos acumulados
            </span>
            <span className="text-xl font-bold text-sky-800 font-mono-numbers mt-1 block">
              USD {formatUSD(totalAportesAcumulados)}
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              {inputs.anosJubilacion * 12} meses de ahorro constante
            </span>
          </div>

          <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200">
            <span className="text-xs text-emerald-800 font-medium block">
              Rendimientos acumulados
            </span>
            <span className="text-xl font-bold text-emerald-700 font-mono-numbers mt-1 block">
              USD {formatUSD(rendimientosAcumulados)}
            </span>
            <span className="text-xs text-emerald-600 mt-1 block">
              Fruto del interés compuesto
            </span>
          </div>
        </div>
      </div>

      {/* RESULTADO 4: ¿ALCANZARÉ MI OBJETIVO? */}
      <div className={`rounded-xl border p-6 shadow-xs ${
        metaAlcanzada ? 'bg-white border-emerald-200' : 'bg-white border-amber-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <span className={`text-xs font-bold uppercase tracking-wider ${
              metaAlcanzada ? 'text-emerald-700' : 'text-amber-700'
            }`}>
              Resultado 4 · Evaluación y plan de acción
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              ¿Alcanzaré mi objetivo?
            </h3>
          </div>
          <div className="flex items-center gap-1.5">
            {metaAlcanzada ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Meta estimada alcanzada
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                Todavía no alcanzás tu meta
              </span>
            )}
          </div>
        </div>

        {/* Diagnóstico principal */}
        <div className="my-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-5 rounded-xl border ${
            metaAlcanzada 
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950' 
              : 'bg-amber-50/80 border-amber-200 text-amber-950'
          }`}>
            <span className="text-xs font-semibold uppercase tracking-wider block opacity-80">
              {metaAlcanzada ? 'Excedente proyectado' : 'Capital faltante proyectado'}
            </span>
            <div className="text-3xl font-black font-mono-numbers mt-1">
              USD {formatUSD(diferenciaMeta)}
            </div>
            <p className="text-xs mt-2 leading-relaxed">
              {metaAlcanzada ? (
                <>
                  ¡Excelente! Con los parámetros seleccionados, tu patrimonio proyectado supera tu meta ajustada por inflación en{' '}
                  <strong>USD {formatUSD(diferenciaMeta)}</strong>.
                </>
              ) : (
                <>
                  Con el ritmo de ahorro y rentabilidad actuales, te faltarían{' '}
                  <strong>USD {formatUSD(diferenciaMeta)}</strong> para cubrir la meta futura ajustada por inflación.
                </>
              )}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Aporte mensual necesario para alcanzar la meta
            </span>
            <div className="text-3xl font-black text-sky-900 font-mono-numbers mt-1">
              {aporteMensualNecesario === 0 ? (
                <span className="text-emerald-700">USD 0 / mes</span>
              ) : (
                <>USD {formatUSD(aporteMensualNecesario)} <span className="text-sm font-normal text-slate-500">/ mes</span></>
              )}
            </div>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {aporteMensualNecesario === 0 ? (
                'Tu patrimonio inicial por sí solo ya es suficiente para alcanzar la meta futura sin aportes adicionales.'
              ) : (
                <>
                  Para llegar exactamente a tu objetivo futuro en {inputs.anosJubilacion} años, deberías comenzar invirtiendo{' '}
                  <strong>USD {formatUSD(aporteMensualNecesario)}</strong> mensuales
                  {inputs.aporteMensual < aporteMensualNecesario 
                    ? ` (USD ${formatUSD(aporteMensualNecesario - inputs.aporteMensual)} más que tu aporte actual).` 
                    : '.'}
                </>
              )}
            </p>
          </div>
        </div>

        {/* Tiempo estimado */}
        <div className="p-4 rounded-xl bg-slate-100/70 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-sky-700" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 block">
                Tiempo estimado para alcanzar la meta:
              </span>
              <span className="text-base font-bold text-slate-900 font-mono-numbers">
                {tiempoEstimadoTexto}
              </span>
            </div>
          </div>
          <span className="text-xs text-slate-500 max-w-xs">
            Calculado comparando mes a mes el patrimonio con la meta ajustada a cada momento.
          </span>
        </div>
      </div>

      {/* COMPARACIÓN CON ORO (Si el usuario activó la opción) */}
      {inputs.compararOro && metaFuturaOro !== undefined && (
        <div className="bg-amber-50/40 rounded-xl border border-amber-300/80 p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Coins className="w-5 h-5 text-amber-600" />
            <h4 className="text-base font-bold text-slate-900">
              Comparación de preservación de valor frente al Oro
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <span className="text-xs text-amber-800 font-medium block">
                Meta futura en relación al oro ({inputs.anosJubilacion} años al {formatPercent(inputs.apreciacionOro)} anual):
              </span>
              <span className="text-2xl font-black text-amber-950 font-mono-numbers mt-1 block">
                USD {formatUSD(metaFuturaOro)}
              </span>
            </div>
            <div className="text-xs text-slate-600 leading-relaxed">
              <p>
                <strong>Nota aclaratoria:</strong> Esta cifra representa el costo equivalente si midiéramos la conservación de poder de compra en términos de onzas de oro apreciándose al {formatPercent(inputs.apreciacionOro)} anual.
              </p>
              <p className="mt-1 text-slate-500">
                Se trata de una referencia de preservación de valor relativa al oro, no de una medida directa de la inflación ni del costo de vida habitual.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
