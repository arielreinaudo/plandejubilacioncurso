/**
 * Motor matemático determinista para Mi Plan de Jubilación.
 * Todas las fórmulas siguen rigurosamente las especificaciones financieras.
 */

export interface RetirementInputs {
  gastosMensuales: number;          // USD
  otrosIngresosMensuales: number;   // USD
  patrimonioInicial: number;        // USD
  aporteMensual: number;            // USD
  anosJubilacion: number;           // Años (5 a 40)
  rentabilidadAnual: number;        // Porcentaje (0 a 15)
  inflacionAnual: number;           // Porcentaje (0 a 12)
  tasaRetiro: number;               // Porcentaje (2 a 6)
  incrementoAnualAporte: number;    // Porcentaje (0 a 15)
  compararOro: boolean;             // Boolean
  apreciacionOro: number;           // Porcentaje (0 a 20)
}

export interface YearProjectionPoint {
  ano: number;
  patrimonio: number;
  metaInflacion: number;
  metaOro?: number;
  aportesAcumulados: number;
}

export interface RetirementResults {
  // A. Necesidad de la cartera
  necesidadMensual: number;
  necesidadAnual: number;
  ingresosCubrenGastos: boolean;

  // B. Meta patrimonial actual (USD de hoy)
  metaPatrimonialActual: number;

  // C. Valores futuros ajustados
  gastosMensualesFuturos: number;
  otrosIngresosFuturos: number;
  necesidadMensualFutura: number;

  // D. Meta patrimonial futura ajustada por inflación
  metaFutura: number;

  // E. Capitalización del patrimonio
  patrimonioFinalProyectado: number;
  capitalInvertidoOriginal: number;
  totalAportesAcumulados: number;
  rendimientosAcumulados: number;

  // F. Comparación de meta
  metaAlcanzada: boolean;
  diferenciaMeta: number; // Excedente o Faltante

  // G. Aporte requerido
  aporteMensualNecesario: number;
  verificacionAporteRequerido: number;

  // H. Tiempo estimado
  tiempoEstimadoMeses: number | null; // null si no se alcanza en 50 años
  tiempoEstimadoTexto: string;

  // I. Oro (opcional)
  metaFuturaOro?: number;

  // Serie de datos para gráfico
  chartData: YearProjectionPoint[];
}

export const DEFAULT_INPUTS: RetirementInputs = {
  gastosMensuales: 2500,
  otrosIngresosMensuales: 1000,
  patrimonioInicial: 10000,
  aporteMensual: 300,
  anosJubilacion: 20,
  rentabilidadAnual: 8,
  inflacionAnual: 3,
  tasaRetiro: 4,
  incrementoAnualAporte: 0,
  compararOro: false,
  apreciacionOro: 6,
};

/**
 * Realiza todos los cálculos financieros deterministas.
 */
export function calculateRetirementPlan(inputs: RetirementInputs): RetirementResults {
  const {
    gastosMensuales,
    otrosIngresosMensuales,
    patrimonioInicial,
    aporteMensual,
    anosJubilacion,
    rentabilidadAnual,
    inflacionAnual,
    tasaRetiro,
    incrementoAnualAporte,
    compararOro,
    apreciacionOro,
  } = inputs;

  // A. Necesidad mensual y anual de la cartera
  const necesidadMensual = Math.max(0, gastosMensuales - otrosIngresosMensuales);
  const necesidadAnual = necesidadMensual * 12;
  const ingresosCubrenGastos = otrosIngresosMensuales >= gastosMensuales;

  // B. Meta patrimonial actual en USD de hoy
  // Si los otros ingresos cubren o superan los gastos, la meta de la cartera es USD 0
  const tasaRetiroDecimal = tasaRetiro > 0 ? tasaRetiro / 100 : 0.04;
  let metaPatrimonialActual = 0;
  if (!ingresosCubrenGastos && tasaRetiroDecimal > 0) {
    metaPatrimonialActual = necesidadAnual / tasaRetiroDecimal;
  }

  // C. Gastos mensuales futuros y otros ingresos futuros
  const factorInflacion = Math.pow(1 + inflacionAnual / 100, anosJubilacion);
  const gastosMensualesFuturos = gastosMensuales * factorInflacion;
  const otrosIngresosFuturos = otrosIngresosMensuales * factorInflacion;
  const necesidadMensualFutura = Math.max(0, gastosMensualesFuturos - otrosIngresosFuturos);

  // D. Meta patrimonial futura ajustada por inflación
  const metaFutura = metaPatrimonialActual * factorInflacion;

  // E. Capitalización del patrimonio
  const totalMeses = Math.max(1, Math.round(anosJubilacion * 12));
  // Tasa mensual equivalente de la rentabilidad anual efectiva
  const tasaMensual = rentabilidadAnual > 0 
    ? Math.pow(1 + rentabilidadAnual / 100, 1 / 12) - 1 
    : 0;

  // Array para guardar puntos por año para el gráfico
  const chartPointsByYear = new Map<number, { patrimonio: number; aportes: number }>();
  chartPointsByYear.set(0, { patrimonio: patrimonioInicial, aportes: 0 });

  let capital = patrimonioInicial;
  let totalAportesAcumulados = 0;

  for (let m = 1; m <= totalMeses; m++) {
    const anoIdx = Math.floor((m - 1) / 12);
    const factorIncremento = Math.pow(1 + incrementoAnualAporte / 100, anoIdx);
    const aporteMes = aporteMensual * factorIncremento;

    capital = capital * (1 + tasaMensual) + aporteMes;
    totalAportesAcumulados += aporteMes;

    if (m % 12 === 0) {
      const ano = m / 12;
      chartPointsByYear.set(ano, { patrimonio: capital, aportes: totalAportesAcumulados });
    }
  }

  const patrimonioFinalProyectado = capital;
  const capitalInvertidoOriginal = patrimonioInicial;
  // Rendimientos acumulados: Patrimonio final - patrimonio inicial - aportes nuevos acumulados
  // Con rentabilidad 0%, los rendimientos acumulados deben ser exactamente 0
  const rendimientosAcumulados = rentabilidadAnual === 0 
    ? 0 
    : Math.max(0, patrimonioFinalProyectado - capitalInvertidoOriginal - totalAportesAcumulados);

  // F. ¿Alcanzo mi meta?
  const metaAlcanzada = patrimonioFinalProyectado >= metaFutura;
  const diferenciaMeta = Math.abs(patrimonioFinalProyectado - metaFutura);

  // G. Aporte mensual inicial necesario
  // 1. Proyectar el patrimonio inicial sin nuevos aportes
  const capitalSoloInicial = rentabilidadAnual > 0
    ? patrimonioInicial * Math.pow(1 + tasaMensual, totalMeses)
    : patrimonioInicial;

  let aporteMensualNecesario = 0;
  if (capitalSoloInicial >= metaFutura) {
    aporteMensualNecesario = 0;
  } else {
    const capitalRestante = metaFutura - capitalSoloInicial;
    // Simular factor de acumulación con aporte base de USD 1
    let factorAcumulacion = 0;
    for (let m = 1; m <= totalMeses; m++) {
      const anoIdx = Math.floor((m - 1) / 12);
      const factorIncremento = Math.pow(1 + incrementoAnualAporte / 100, anoIdx);
      factorAcumulacion = factorAcumulacion * (1 + tasaMensual) + factorIncremento;
    }
    aporteMensualNecesario = factorAcumulacion > 0 ? (capitalRestante / factorAcumulacion) : 0;
  }

  // Verificación de consistencia del aporte necesario
  let verificacionAporte = patrimonioInicial;
  for (let m = 1; m <= totalMeses; m++) {
    const anoIdx = Math.floor((m - 1) / 12);
    const factorIncremento = Math.pow(1 + incrementoAnualAporte / 100, anoIdx);
    const aporteMes = aporteMensualNecesario * factorIncremento;
    verificacionAporte = verificacionAporte * (1 + tasaMensual) + aporteMes;
  }

  // H. Tiempo hasta alcanzar la meta (simulado mes a mes hasta 50 años = 600 meses)
  let tiempoEstimadoMeses: number | null = null;
  let tiempoEstimadoTexto = '';

  if (ingresosCubrenGastos) {
    tiempoEstimadoTexto = 'No aplica: tus ingresos previstos ya cubren tus gastos.';
  } else if (patrimonioInicial >= metaPatrimonialActual) {
    tiempoEstimadoMeses = 0;
    tiempoEstimadoTexto = 'Meta ya alcanzada con tu patrimonio actual.';
  } else {
    const maxMeses = 600; // 50 años
    let capSim = patrimonioInicial;
    for (let m = 1; m <= maxMeses; m++) {
      const anoIdx = Math.floor((m - 1) / 12);
      const factorIncremento = Math.pow(1 + incrementoAnualAporte / 100, anoIdx);
      const aporteMes = aporteMensual * factorIncremento;
      capSim = capSim * (1 + tasaMensual) + aporteMes;

      const anosTranscurridos = m / 12;
      const metaMesAjustada = metaPatrimonialActual * Math.pow(1 + inflacionAnual / 100, anosTranscurridos);

      if (capSim >= metaMesAjustada) {
        tiempoEstimadoMeses = m;
        break;
      }
    }

    if (tiempoEstimadoMeses !== null) {
      const anos = Math.floor(tiempoEstimadoMeses / 12);
      const meses = tiempoEstimadoMeses % 12;
      if (anos === 0) {
        tiempoEstimadoTexto = `${meses} ${meses === 1 ? 'mes' : 'meses'}`;
      } else if (meses === 0) {
        tiempoEstimadoTexto = `${anos} ${anos === 1 ? 'año' : 'años'}`;
      } else {
        tiempoEstimadoTexto = `${anos} ${anos === 1 ? 'año' : 'años'} y ${meses} ${meses === 1 ? 'mes' : 'meses'}`;
      }
    } else {
      tiempoEstimadoTexto = 'No se alcanza dentro de los 50 años simulados.';
    }
  }

  // I. Oro (opcional)
  let metaFuturaOro: number | undefined;
  if (compararOro) {
    metaFuturaOro = metaPatrimonialActual * Math.pow(1 + apreciacionOro / 100, anosJubilacion);
  }

  // Generar chartData año por año
  const chartData: YearProjectionPoint[] = [];
  for (let y = 0; y <= anosJubilacion; y++) {
    const pt = chartPointsByYear.get(y) || { patrimonio: 0, aportes: 0 };
    const metaInf = metaPatrimonialActual * Math.pow(1 + inflacionAnual / 100, y);
    const dataPoint: YearProjectionPoint = {
      ano: y,
      patrimonio: Math.round(pt.patrimonio),
      metaInflacion: Math.round(metaInf),
      aportesAcumulados: Math.round(pt.aportes),
    };
    if (compararOro) {
      dataPoint.metaOro = Math.round(metaPatrimonialActual * Math.pow(1 + apreciacionOro / 100, y));
    }
    chartData.push(dataPoint);
  }

  return {
    necesidadMensual,
    necesidadAnual,
    ingresosCubrenGastos,
    metaPatrimonialActual,
    gastosMensualesFuturos,
    otrosIngresosFuturos,
    necesidadMensualFutura,
    metaFutura,
    patrimonioFinalProyectado,
    capitalInvertidoOriginal,
    totalAportesAcumulados,
    rendimientosAcumulados,
    metaAlcanzada,
    diferenciaMeta,
    aporteMensualNecesario,
    verificacionAporteRequerido: verificacionAporte,
    tiempoEstimadoMeses,
    tiempoEstimadoTexto,
    metaFuturaOro,
    chartData,
  };
}

/**
 * Formateo numérico en pesos/dólares con separador de miles de Argentina (punto).
 * Ejemplo: 450000 -> "450.000"
 */
export function formatUSD(value: number): string {
  if (isNaN(value) || !isFinite(value)) return '0';
  return Math.round(value).toLocaleString('es-AR');
}

/**
 * Formateo porcentual con coma decimal.
 * Ejemplo: 3.5 -> "3,5%"
 */
export function formatPercent(value: number): string {
  if (isNaN(value) || !isFinite(value)) return '0%';
  return `${value.toString().replace('.', ',')}%`;
}
