// FASE 1: ENTRADA DE DATOS - js/data.js
// Gestión centralizada de datos del plan de inversión

const planData = {
    // INGRESOS
    ingresos: [
        {
            mesInicio: 0,
            salario: 0,
            descripcion: "Salario inicial"
        }
    ],

    // GASTOS
    modoGastos: null, // "simple" o "detallado"
    gastos: [
        {
            mesInicio: 0,
            items: [
                { nombre: "Alquiler", cantidad: 0 },
                { nombre: "Comida", cantidad: 0 },
                { nombre: "Suministros", cantidad: 0 },
                { nombre: "Otros", cantidad: 0 }
            ]
        }
    ],

    // INVERSIÓN
    inversion: {
        fondo: "Vanguard FTSE Global All Cap",
        isin: "IE00B03HD191",
        comision: 0.42,
        rentabilidad: 8.5
    }
};

// ============================================
// FUNCIONES AUXILIARES DE DATOS
// ============================================

/**
 * Reinicia los datos a estado inicial
 */
function reiniciarPlanData() {
    planData.ingresos = [
        {
            mesInicio: 0,
            salario: 0,
            descripcion: "Salario inicial"
        }
    ];

    planData.modoGastos = null;

    planData.gastos = [
        {
            mesInicio: 0,
            items: [
                { nombre: "Alquiler", cantidad: 0 },
                { nombre: "Comida", cantidad: 0 },
                { nombre: "Suministros", cantidad: 0 },
                { nombre: "Otros", cantidad: 0 }
            ]
        }
    ];

    planData.inversion = {
        fondo: "Vanguard FTSE Global All Cap",
        isin: "IE00B03HD191",
        comision: 0.42,
        rentabilidad: 8.5
    };

    console.log("Plan reiniciado a estado inicial");
}

/**
 * Actualiza el salario inicial
 */
function setSalarioInicial(salario) {
    planData.ingresos[0].salario = parseFloat(salario) || 0;
}

/**
 * Obtiene el salario inicial
 */
function getSalarioInicial() {
    return planData.ingresos[0].salario;
}

/**
 * Añade un cambio de salario futuro
 */
function agregarCambioSalario(mes, salario, descripcion = "") {
    const nuevoIngreso = {
        mesInicio: parseInt(mes),
        salario: parseFloat(salario),
        descripcion: descripcion || `Cambio en mes ${mes}`
    };

    // Verificar que no exista ya
    const existe = planData.ingresos.some(i => i.mesInicio === parseInt(mes));
    if (existe) {
        console.warn(`Ya existe cambio de salario en mes ${mes}`);
        return false;
    }

    planData.ingresos.push(nuevoIngreso);
    planData.ingresos.sort((a, b) => a.mesInicio - b.mesInicio);
    console.log("Cambio de salario añadido:", nuevoIngreso);
    return true;
}

/**
 * Elimina un cambio de salario
 */
function eliminarCambioSalario(mes) {
    if (mes === 0) {
        console.warn("No se puede eliminar el salario inicial");
        return false;
    }

    const index = planData.ingresos.findIndex(i => i.mesInicio === parseInt(mes));
    if (index !== -1) {
        planData.ingresos.splice(index, 1);
        console.log(`Cambio de salario en mes ${mes} eliminado`);
        return true;
    }
    return false;
}

/**
 * Obtiene todos los cambios de salario (excepto el inicial)
 */
function getCambiosSalario() {
    return planData.ingresos.slice(1);
}

/**
 * Establece el modo de gastos
 */
function setModoGastos(modo) {
    if (["simple", "detallado"].includes(modo)) {
        planData.modoGastos = modo;
        console.log(`Modo de gastos establecido: ${modo}`);
        return true;
    }
    return false;
}

/**
 * Obtiene el modo de gastos
 */
function getModoGastos() {
    return planData.modoGastos;
}

/**
 * Actualiza items de gastos en un período específico
 */
function actualizarGastosPeriodo(mesInicio, items) {
    let periodo = planData.gastos.find(g => g.mesInicio === parseInt(mesInicio));

    if (!periodo) {
        periodo = {
            mesInicio: parseInt(mesInicio),
            items: items
        };
        planData.gastos.push(periodo);
        planData.gastos.sort((a, b) => a.mesInicio - b.mesInicio);
    } else {
        periodo.items = items;
    }

    console.log(`Gastos actualizados para mes ${mesInicio}:`, periodo);
    return true;
}

/**
 * Obtiene gastos de un período
 */
function obtenerGastosPeriodo(mesInicio) {
    return planData.gastos.find(g => g.mesInicio === parseInt(mesInicio));
}

/**
 * Elimina un período de gastos
 */
function eliminarPeriodoGastos(mesInicio) {
    if (mesInicio === 0) {
        console.warn("No se puede eliminar el período inicial de gastos");
        return false;
    }

    const index = planData.gastos.findIndex(g => g.mesInicio === parseInt(mesInicio));
    if (index !== -1) {
        planData.gastos.splice(index, 1);
        console.log(`Período de gastos en mes ${mesInicio} eliminado`);
        return true;
    }
    return false;
}

/**
 * Obtiene todos los períodos de gastos
 */
function getTodosPeriodosGastos() {
    return planData.gastos;
}

/**
 * Calcula el total de gastos en un período
 */
function calcularTotalGastos(mesInicio) {
    const periodo = obtenerGastosPeriodo(mesInicio);
    if (!periodo) return 0;

    return periodo.items.reduce((sum, item) => sum + (parseFloat(item.cantidad) || 0), 0);
}

/**
 * Actualiza configuración de inversión
 */
function setConfiguracionInversion(fondo, comision, rentabilidad, isin = "") {
    planData.inversion = {
        fondo: fondo || "Custom",
        isin: isin,
        comision: parseFloat(comision) || 0,
        rentabilidad: parseFloat(rentabilidad) || 0
    };

    console.log("Configuración de inversión actualizada:", planData.inversion);
    return true;
}

/**
 * Obtiene configuración de inversión
 */
function getConfiguracionInversion() {
    return { ...planData.inversion };
}

/**
 * Valida que los datos sean suficientes para continuar
 * Retorna { valido: boolean, errores: string[] }
 */
function validarDatos() {
    const errores = [];

    // Validar ingresos
    if (!planData.ingresos[0].salario || planData.ingresos[0].salario <= 0) {
        errores.push("Salario inicial debe ser mayor a 0");
    }

    // Validar orden de meses
    for (let i = 1; i < planData.ingresos.length; i++) {
        if (planData.ingresos[i].mesInicio <= planData.ingresos[i - 1].mesInicio) {
            errores.push("Los meses de cambio de salario deben estar en orden ascendente");
        }
    }

    for (let i = 1; i < planData.gastos.length; i++) {
        if (planData.gastos[i].mesInicio <= planData.gastos[i - 1].mesInicio) {
            errores.push("Los meses de cambio de gastos deben estar en orden ascendente");
        }
    }

    // Validar modo de gastos
    if (!planData.modoGastos) {
        errores.push("Debe seleccionar un modo de gastos");
    }

    // Validar inversión
    if (!planData.inversion.rentabilidad || planData.inversion.rentabilidad <= 0 || planData.inversion.rentabilidad >= 50) {
        errores.push("Rentabilidad debe estar entre 0% y 50%");
    }

    if (planData.inversion.comision < 0 || planData.inversion.comision >= 10) {
        errores.push("Comisión debe estar entre 0% y 10%");
    }

    return {
        valido: errores.length === 0,
        errores: errores
    };
}

/**
 * Obtiene un resumen completo del plan (para debug)
 */
function resumenPlan() {
    console.group("RESUMEN DEL PLAN");
    console.log("INGRESOS:", planData.ingresos);
    console.log("MODO GASTOS:", planData.modoGastos);
    console.log("GASTOS:", planData.gastos);
    console.log("INVERSIÓN:", planData.inversion);
    console.groupEnd();

    return planData;
}