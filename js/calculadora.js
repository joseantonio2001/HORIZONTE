// FASE 2: LÓGICA DE CÁLCULO - js/calculadora.js
// Motor de cálculos para proyecciones de inversión a 20 años

// ============================================
// FUNCIÓN 1: OBTENER SALARIO DE UN MES
// ============================================

/**
 * Obtiene el salario para un mes específico
 * @param {number} mes - Mes a consultar (0-240)
 * @param {array} ingresos - Array de cambios de salario
 * @return {number} Salario en ese mes
 */
function obtenerSalarioMes(mes, ingresos) {
  // Filtrar ingresos que ya han ocurrido
  const ingresosAntes = ingresos.filter(ing => ing.mesInicio <= mes);
  
  // Si no hay ninguno, retornar 0
  if (ingresosAntes.length === 0) return 0;
  
  // Retornar el último (más reciente)
  return ingresosAntes[ingresosAntes.length - 1].salario;
}

// ============================================
// FUNCIÓN 2: OBTENER GASTOS DE UN MES
// ============================================

/**
 * Obtiene los gastos totales para un mes específico
 * @param {number} mes - Mes a consultar
 * @param {array} gastos - Array de períodos de gastos
 * @return {number} Gasto total en ese mes
 */
function obtenerGastosMes(mes, gastos) {
  // Filtrar gastos que ya han ocurrido
  const gastosAntes = gastos.filter(g => g.mesInicio <= mes);
  
  // Si no hay ninguno, retornar 0
  if (gastosAntes.length === 0) return 0;
  
  // Obtener el período más reciente
  const periodoActual = gastosAntes[gastosAntes.length - 1];
  
  // Sumar todos los items
  return periodoActual.items.reduce((sum, item) => sum + (parseFloat(item.cantidad) || 0), 0);
}

// ============================================
// FUNCIÓN 3: CALCULAR INVERSIÓN MENSUAL
// ============================================

/**
 * Calcula cuánto invertir en un mes específico
 * Lógica:
 * - Si fondo emergencia < gastos*3: invertir 30% del ahorro
 * - Si no: invertir 60% del ahorro
 * - Mínimo: 25€
 * - Máximo: 65% del ahorro
 * 
 * @param {number} salario - Salario ese mes
 * @param {number} gastos - Gastos ese mes
 * @param {number} ahorroAcumulado - Ahorro total acumulado
 * @return {number} Cantidad a invertir
 */
function calcularInversionMensual(salario, gastos, ahorroAcumulado) {
  // Calcular ahorro mensual
  const ahorroMes = salario - gastos;
  
  // Si no hay ahorro, no invertir
  if (ahorroMes <= 0) return 0;
  
  // Determinar si fondo emergencia está cubierto
  const fondoEmergenciaRequerido = gastos * 3;
  const tieneEmergencia = ahorroAcumulado >= fondoEmergenciaRequerido;
  
  // Porcentaje a invertir
  const porcentaje = tieneEmergencia ? 0.60 : 0.30;
  let inversion = ahorroMes * porcentaje;
  
  // Aplicar límites
  const minimo = 25;
  const maximo = ahorroMes * 0.65;
  
  inversion = Math.max(inversion, minimo);
  inversion = Math.min(inversion, maximo);
  
  return inversion;
}

// ============================================
// FUNCIÓN 4: GENERAR PLAN MENSUAL (20 AÑOS)
// ============================================

/**
 * Genera plan mes a mes para 20 años (240 meses)
 * @param {object} planData - Datos del usuario (ingresos, gastos, inversión)
 * @param {number} meses - Cantidad de meses a calcular (default 240 = 20 años)
 * @return {array} Array de datos mensuales
 */
function generarPlanMensual(planData, meses = 240) {
  const planMensual = [];
  let ahorroAcumulado = 0;
  
  for (let mes = 0; mes <= meses; mes++) {
    // Obtener salario y gastos para este mes
    const salario = obtenerSalarioMes(mes, planData.ingresos);
    const gastos = obtenerGastosMes(mes, planData.gastos);
    
    // Calcular ahorro mensual
    const ahorroMes = salario - gastos;
    
    // Calcular inversión
    const inversion = calcularInversionMensual(salario, gastos, ahorroAcumulado);
    
    // Acumular ahorro
    ahorroAcumulado += ahorroMes;
    
    // Guardar mes
    planMensual.push({
      mes,
      salario,
      gastos,
      ahorroMes,
      inversion,
      ahorroAcumulado
    });
  }
  
  return planMensual;
}

// ============================================
// FUNCIÓN 5: CALCULAR VALOR DE CARTERA
// ============================================

/**
 * Calcula evolución de cartera mes a mes con rentabilidad
 * Fórmula: Valor = (Valor anterior × (1 + rentabilidad/12)) + Inversión
 * 
 * @param {array} planMensual - Plan mensual desde generarPlanMensual()
 * @param {number} rentabilidadAnual - Rentabilidad anual (ej: 8.5 para 8.5%)
 * @param {number} comision - Comisión anual (ej: 0.42 para 0.42%)
 * @return {array} Array con evolución de cartera
 */
function calcularValorCartera(planMensual, rentabilidadAnual, comision) {
  // Rentabilidad neta (después de comisión)
  const rentabilidadNeta = rentabilidadAnual - comision;
  const rentabilidadMensual = (rentabilidadNeta / 100) / 12;
  
  const cartera = [];
  let valorMesAnterior = 0;
  let aportadoAcumulado = 0;
  
  for (const mes of planMensual) {
    // Aplicar rentabilidad al mes anterior
    const crecimiento = valorMesAnterior * rentabilidadMensual;
    const valorConRentabilidad = valorMesAnterior + crecimiento;
    
    // Añadir inversión del mes actual
    const valorMesActual = valorConRentabilidad + mes.inversion;
    aportadoAcumulado += mes.inversion;
    
    // Calcular ganancias
    const ganancias = Math.max(0, valorMesActual - aportadoAcumulado);
    
    cartera.push({
      mes: mes.mes,
      valor: valorMesActual,
      aportado: aportadoAcumulado,
      ganancias: ganancias,
      inversion: mes.inversion
    });
    
    valorMesAnterior = valorMesActual;
  }
  
  return cartera;
}

// ============================================
// FUNCIÓN 6: GENERAR PROYECCIONES (5, 10, 20)
// ============================================

/**
 * Genera resumen de proyecciones a 5, 10 y 20 años
 * @param {array} cartera - Cartera desde calcularValorCartera()
 * @return {object} Resumen para 5, 10, 20 años
 */
function generarProyecciones(cartera) {
  const proyecciones = {};
  
  // Puntos clave: 5 años (60 meses), 10 años (120), 20 años (240)
  const puntos = [
    { años: 5, meses: 60 },
    { años: 10, meses: 120 },
    { años: 20, meses: 240 }
  ];
  
  for (const punto of puntos) {
    // Buscar mes correspondiente o usar el último disponible
    const mesDisponible = Math.min(punto.meses, cartera.length - 1);
    const datosAlano = cartera[mesDisponible];
    
    if (datosAlano) {
      // Estimación de comisiones pagadas
      const comisionesEstimadas = datosAlano.aportado * (0.42 / 100) * punto.años;
      
      proyecciones[punto.años] = {
        meses: datosAlano.mes,
        aportado: Math.round(datosAlano.aportado),
        ganancias: Math.round(datosAlano.ganancias),
        valor: Math.round(datosAlano.valor),
        comisiones: Math.round(comisionesEstimadas)
      };
    }
  }
  
  return proyecciones;
}

// ============================================
// FUNCIÓN 7: CALCULAR WARNINGS Y ALERTAS
// ============================================

/**
 * Detecta problemas o situaciones especiales
 * @param {object} planData - Datos del usuario
 * @param {array} planMensual - Plan mensual
 * @return {array} Array de warnings
 */
function calcularWarnings(planData, planMensual) {
  const warnings = [];
  
  for (const mes of planMensual) {
    // Warning: Gastos > ingresos (insolvencia)
    if (mes.gastos > mes.salario) {
      warnings.push({
        tipo: "error",
        mensaje: `Gastos (${formatearDinero(mes.gastos)}) superan ingresos (${formatearDinero(mes.salario)}) en mes ${mes.mes}`,
        mes: mes.mes
      });
    }
    
    // Warning: Gastos > 75% ingresos
    else if (mes.gastos > mes.salario * 0.75) {
      warnings.push({
        tipo: "warning",
        mensaje: `Gastos representan ${Math.round(mes.gastos / mes.salario * 100)}% ingresos en mes ${mes.mes}`,
        mes: mes.mes
      });
    }
    
    // Warning: Ahorro negativo
    if (mes.ahorroMes < 0) {
      warnings.push({
        tipo: "error",
        mensaje: `Ahorro negativo en mes ${mes.mes}: -${formatearDinero(Math.abs(mes.ahorroMes))}`,
        mes: mes.mes
      });
    }
  }
  
  // Info: Fondo emergencia alcanzado
  if (planMensual.length > 0) {
    const gastosInicial = planMensual[0].gastos;
    const fondoEmergenciaRequerido = gastosInicial * 3;
    const mesEmergencia = planMensual.find(m => m.ahorroAcumulado >= fondoEmergenciaRequerido);
    
    if (mesEmergencia) {
      warnings.push({
        tipo: "info",
        mensaje: `Fondo emergencia (${formatearDinero(fondoEmergenciaRequerido)}) alcanzado en mes ${mesEmergencia.mes}`,
        mes: null
      });
    }
  }
  
  return warnings;
}

// ============================================
// FUNCIÓN 8: FUNCIÓN MAESTRA - CALCULAR TODO
// ============================================

/**
 * Función maestra que ejecuta todo el cálculo de una vez
 * @param {object} datosInput - Datos del usuario (opcional, usa planData global si no se proporciona)
 * @return {object} Resultado completo con plan, cartera, proyecciones y warnings
 */
function calcularPlanCompleto(datosInput) {
  // Usar datos input o global
  const datos = datosInput || planData;
  
  // Validar datos
  const validacion = validarDatos();
  if (!validacion.valido) {
    console.error("Validación fallida:", validacion.errores);
    return {
      valido: false,
      errores: validacion.errores,
      planMensual: [],
      cartera: [],
      proyecciones: {},
      warnings: []
    };
  }
  
  try {
    // Generar plan mensual
    const planMensual = generarPlanMensual(datos);
    
    // Calcular cartera
    const cartera = calcularValorCartera(planMensual, datos.inversion.rentabilidad, datos.inversion.comision);
    
    // Generar proyecciones
    const proyecciones = generarProyecciones(cartera);
    
    // Calcular warnings
    const warnings = calcularWarnings(datos, planMensual);
    
    console.log("✅ Cálculos completados exitosamente");
    console.log("Plan de 240 meses generado");
    console.log("Proyecciones:", proyecciones);
    
    return {
      valido: true,
      planMensual,
      cartera,
      proyecciones,
      warnings
    };
  } catch (error) {
    console.error("Error al calcular plan:", error);
    return {
      valido: false,
      errores: ["Error en los cálculos: " + error.message],
      planMensual: [],
      cartera: [],
      proyecciones: {},
      warnings: []
    };
  }
}

// ============================================
// FUNCIÓN AUXILIAR: FORMATEAR DINERO
// ============================================

/**
 * Formatea número como moneda EUR
 * @param {number} cantidad - Cantidad a formatear
 * @return {string} Cantidad formateada (ej: "1.300,50€")
 */
function formatearDinero(cantidad) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(cantidad);
}

// ============================================
// LOGS PARA DEBUG
// ============================================

console.log("✅ calculadora.js cargado correctamente");
console.log("Funciones disponibles:");
console.log("- obtenerSalarioMes(mes, ingresos)");
console.log("- obtenerGastosMes(mes, gastos)");
console.log("- calcularInversionMensual(salario, gastos, ahorroAcumulado)");
console.log("- generarPlanMensual(planData, meses = 240)");
console.log("- calcularValorCartera(planMensual, rentabilidad, comision)");
console.log("- generarProyecciones(cartera)");
console.log("- calcularWarnings(planData, planMensual)");
console.log("- calcularPlanCompleto(datosInput)");
