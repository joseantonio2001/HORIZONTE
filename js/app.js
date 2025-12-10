// FASE 1: ENTRADA DE DATOS - js/app.js
// Control de flujo y navegación entre pantallas

let pantallActual = 1;

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log("Aplicación iniciada - Fase 1");
    mostrarPantalla(1);
});

// ============================================
// GESTIÓN DE PANTALLAS
// ============================================

/**
 * Muestra una pantalla específica
 */
function mostrarPantalla(numero) {
    pantallActual = numero;
    const appContainer = document.getElementById('app');
    appContainer.innerHTML = '';

    switch (numero) {
        case 1:
            appContainer.appendChild(crearPantalla1());
            break;
        case 2:
            appContainer.appendChild(crearPantalla2());
            break;
        case 3:
            if (planData.modoGastos === 'simple') {
                appContainer.appendChild(crearPantalla3Simple());
            } else if (planData.modoGastos === 'detallado') {
                appContainer.appendChild(crearPantalla3Detallado());
            }
            break;
        case 4:
            appContainer.appendChild(crearPantalla4());
            break;
        default:
            console.warn(`Pantalla ${numero} no existe`);
    }

    // Scroll al inicio
    window.scrollTo(0, 0);
}

// ============================================
// PANTALLA 1: INGRESOS
// ============================================

function crearPantalla1() {
    const screen = document.createElement('div');
    screen.className = 'screen';

    const salarioInicial = getSalarioInicial();

    screen.innerHTML = `
        <div class="screen-header">
            <h1>📊 Ingresos Mensuales</h1>
            <p>Paso 1 de 4</p>
        </div>

        <div class="screen-content">
            <div class="form-group">
                <label class="form-label required">Salario actual (neto)</label>
                <div class="form-input-group">
                    <input 
                        type="number" 
                        class="form-input" 
                        id="salarioActual"
                        placeholder="Ej: 1300"
                        value="${salarioInicial}"
                        min="0"
                        step="100"
                    >
                    <span style="font-weight: 600; white-space: nowrap;">€ / mes</span>
                </div>
                <div class="info-box">
                    <strong>💡 Tip:</strong> Ingresa tu salario neto (después de impuestos). Incluye todos tus ingresos mensuales regulares.
                </div>
            </div>

            <div class="checkbox-group">
                <input 
                    type="checkbox" 
                    id="tieneCambios"
                    ${planData.ingresos.length > 1 ? 'checked' : ''}
                >
                <label for="tieneCambios">
                    ¿Tendrás cambios de salario en el futuro?
                </label>
            </div>

            <div id="cambiosContainer" style="display: ${planData.ingresos.length > 1 ? 'block' : 'none'};">
                <div class="form-group" style="margin-top: var(--spacing-lg);">
                    <label class="form-label">Cambios de Salario Futuros</label>
                    <table class="dynamic-table">
                        <thead>
                            <tr>
                                <th>Mes</th>
                                <th>Salario (€)</th>
                                <th>Descripción</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody id="cambiosBody">
                        </tbody>
                    </table>
                    <button type="button" class="btn btn-add-item btn-small" id="btnAddCambio">
                        + Agregar Cambio
                    </button>
                </div>
            </div>
        </div>

        <div class="button-group">
            <button type="button" class="btn btn-primary" id="btnSiguiente">
                Siguiente →
            </button>
        </div>
    `;

    // Event listeners
    const inputSalario = screen.querySelector('#salarioActual');
    const checkboxCambios = screen.querySelector('#tieneCambios');
    const cambiosContainer = screen.querySelector('#cambiosContainer');
    const btnAddCambio = screen.querySelector('#btnAddCambio');
    const btnSiguiente = screen.querySelector('#btnSiguiente');

    // Guardar salario al escribir
    inputSalario.addEventListener('change', (e) => {
        setSalarioInicial(e.target.value);
    });

    // Mostrar/ocultar cambios
    checkboxCambios.addEventListener('change', () => {
        cambiosContainer.style.display = checkboxCambios.checked ? 'block' : 'none';
    });

    // Renderizar cambios existentes
    actualizarTablaCambios(screen);

    // Agregar nuevo cambio
    btnAddCambio.addEventListener('click', () => {
        const mes = prompt('¿En qué mes habrá el cambio? (ej: 6, 12, 24)');
        if (mes === null) return;

        const salario = prompt('¿Cuál será el nuevo salario? (€)');
        if (salario === null) return;

        const descripcion = prompt('Descripción (opcional)', '');

        if (agregarCambioSalario(mes, salario, descripcion)) {
            actualizarTablaCambios(screen);
        } else {
            alert('No se pudo agregar el cambio. Verifica los datos.');
        }
    });

    // Siguiente pantalla
    btnSiguiente.addEventListener('click', () => {
        const validacion = validarDatos();
        if (!validacion.valido && !planData.ingresos[0].salario) {
            alert('Por favor ingresa un salario inicial válido');
            return;
        }
        mostrarPantalla(2);
    });

    return screen;
}

function actualizarTablaCambios(screen) {
    const cambios = getCambiosSalario();
    const tbody = screen.querySelector('#cambiosBody');
    tbody.innerHTML = '';

    cambios.forEach(cambio => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>Mes ${cambio.mesInicio}</strong></td>
            <td><strong>${cambio.salario.toLocaleString('es-ES')}€</strong></td>
            <td>${cambio.descripcion}</td>
            <td>
                <button type="button" class="btn-remove btn-small" data-mes="${cambio.mesInicio}">
                    Eliminar
                </button>
            </td>
        `;

        row.querySelector('.btn-remove').addEventListener('click', () => {
            if (confirm(`¿Eliminar cambio en mes ${cambio.mesInicio}?`)) {
                eliminarCambioSalario(cambio.mesInicio);
                actualizarTablaCambios(screen);
            }
        });

        tbody.appendChild(row);
    });

    // Si no hay cambios, mostrar mensaje
    if (cambios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--color-text-secondary);">No hay cambios agregados</td></tr>';
    }
}

// ============================================
// PANTALLA 2: SELECCIÓN DE MODO DE GASTOS
// ============================================

function crearPantalla2() {
    const screen = document.createElement('div');
    screen.className = 'screen';

    const modoActual = getModoGastos();

    screen.innerHTML = `
        <div class="screen-header">
            <h1>💸 Modo de Gastos</h1>
            <p>Paso 2 de 4</p>
        </div>

        <div class="screen-content">
            <p style="margin-bottom: var(--spacing-lg); color: var(--color-text-secondary);">
                ¿Cómo prefieres registrar tus gastos?
            </p>

            <div class="radio-group">
                <label class="radio-option ${modoActual === 'simple' ? 'selected' : ''}">
                    <input 
                        type="radio" 
                        name="modoGastos" 
                        value="simple"
                        ${modoActual === 'simple' ? 'checked' : ''}
                    >
                    <div class="radio-label-text">
                        <strong>📋 Modo Simple</strong>
                        <small>Ingresa gastos por categoría (Alquiler, Comida, etc.)</small>
                    </div>
                </label>

                <label class="radio-option ${modoActual === 'detallado' ? 'selected' : ''}">
                    <input 
                        type="radio" 
                        name="modoGastos" 
                        value="detallado"
                        ${modoActual === 'detallado' ? 'checked' : ''}
                    >
                    <div class="radio-label-text">
                        <strong>✏️ Modo Detallado</strong>
                        <small>Añade cada gasto individualmente (Spotify, Gimnasio, etc.)</small>
                    </div>
                </label>
            </div>

            <div class="info-box">
                <strong>💡 Diferencia:</strong> En modo simple tienes 4 categorías fijas. En modo detallado puedes crear tantos gastos como necesites.
            </div>
        </div>

        <div class="button-group">
            <button type="button" class="btn btn-secondary" id="btnAtras">
                ← Atrás
            </button>
            <button type="button" class="btn btn-primary" id="btnSiguiente">
                Siguiente →
            </button>
        </div>
    `;

    // Event listeners
    const radios = screen.querySelectorAll('input[name="modoGastos"]');
    const btnAtras = screen.querySelector('#btnAtras');
    const btnSiguiente = screen.querySelector('#btnSiguiente');

    // Cambiar modo
    radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            setModoGastos(e.target.value);

            // Actualizar visual de opciones seleccionadas
            screen.querySelectorAll('.radio-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            radio.closest('.radio-option').classList.add('selected');

            console.log(`Modo de gastos establecido: ${e.target.value}`);
        });
    });

    btnAtras.addEventListener('click', () => mostrarPantalla(1));
    btnSiguiente.addEventListener('click', () => {
        if (!getModoGastos()) {
            alert('Por favor selecciona un modo de gastos');
            return;
        }
        mostrarPantalla(3);
    });

    return screen;
}

// ============================================
// PANTALLA 3A: GASTOS (MODO SIMPLE)
// ============================================

function crearPantalla3Simple() {
    const screen = document.createElement('div');
    screen.className = 'screen';

    const gastosMes0 = obtenerGastosPeriodo(0);
    const otrosPeriodos = planData.gastos.slice(1);

    screen.innerHTML = `
        <div class="screen-header">
            <h1>💸 Gastos Mensuales (Modo Simple)</h1>
            <p>Paso 3 de 4</p>
        </div>

        <div class="screen-content">
            <div id="seccionMes0">
                <h3 style="margin-bottom: var(--spacing-md); font-size: 16px;">
                    📍 Situación Actual (Mes 0)
                </h3>

                <div class="form-group">
                    <label class="form-label">Alquiler (€/mes)</label>
                    <input 
                        type="number" 
                        class="form-input gasto-input"
                        data-mes="0"
                        data-nombre="Alquiler"
                        placeholder="0"
                        min="0"
                        step="10"
                        value="${gastosMes0.items[0].cantidad}"
                    >
                </div>

                <div class="form-group">
                    <label class="form-label">Comida (€/mes)</label>
                    <input 
                        type="number" 
                        class="form-input gasto-input"
                        data-mes="0"
                        data-nombre="Comida"
                        placeholder="0"
                        min="0"
                        step="10"
                        value="${gastosMes0.items[1].cantidad}"
                    >
                </div>

                <div class="form-group">
                    <label class="form-label">Suministros (€/mes)</label>
                    <input 
                        type="number" 
                        class="form-input gasto-input"
                        data-mes="0"
                        data-nombre="Suministros"
                        placeholder="0"
                        min="0"
                        step="10"
                        value="${gastosMes0.items[2].cantidad}"
                    >
                </div>

                <div class="form-group">
                    <label class="form-label">Otros (€/mes)</label>
                    <input 
                        type="number" 
                        class="form-input gasto-input"
                        data-mes="0"
                        data-nombre="Otros"
                        placeholder="0"
                        min="0"
                        step="10"
                        value="${gastosMes0.items[3].cantidad}"
                    >
                </div>

                <div class="total-display">
                    Total Mes 0: <span id="totalMes0">0</span>€/mes
                </div>
            </div>

            <div class="checkbox-group" style="margin-top: var(--spacing-xl);">
                <input 
                    type="checkbox" 
                    id="tieneCambiosGastos"
                    ${otrosPeriodos.length > 0 ? 'checked' : ''}
                >
                <label for="tieneCambiosGastos">
                    ¿Habrá cambios en tus gastos en el futuro?
                </label>
            </div>

            <div id="cambiosGastosContainer" style="display: ${otrosPeriodos.length > 0 ? 'block' : 'none'}; margin-top: var(--spacing-lg);">
                <div id="periodosContainer"></div>
                <button type="button" class="btn btn-add-item" id="btnAddPeriodo">
                    + Agregar Período
                </button>
            </div>
        </div>

        <div class="button-group">
            <button type="button" class="btn btn-secondary" id="btnAtras">
                ← Atrás
            </button>
            <button type="button" class="btn btn-primary" id="btnSiguiente">
                Siguiente →
            </button>
        </div>
    `;

    // Event listeners
    const checkboxCambios = screen.querySelector('#tieneCambiosGastos');
    const cambiosContainer = screen.querySelector('#cambiosGastosContainer');
    const btnAddPeriodo = screen.querySelector('#btnAddPeriodo');
    const btnAtras = screen.querySelector('#btnAtras');
    const btnSiguiente = screen.querySelector('#btnSiguiente');

    // Cambiar gastos
    screen.querySelectorAll('.gasto-input').forEach(input => {
        input.addEventListener('change', () => {
            const mes = parseInt(input.dataset.mes);
            const periodo = obtenerGastosPeriodo(mes);

            if (periodo) {
                const nombre = input.dataset.nombre;
                const item = periodo.items.find(i => i.nombre === nombre);
                if (item) {
                    item.cantidad = parseFloat(input.value) || 0;
                }
            }

            actualizarTotalesMes(screen);
        });
    });

    // Mostrar/ocultar cambios
    checkboxCambios.addEventListener('change', () => {
        cambiosContainer.style.display = checkboxCambios.checked ? 'block' : 'none';
    });

    // Renderizar cambios existentes
    actualizarPeriodosSimple(screen);
    actualizarTotalesMes(screen);

    // Agregar nuevo período
    btnAddPeriodo.addEventListener('click', () => {
        const mes = prompt('¿A partir de qué mes? (ej: 6, 12, 24)');
        if (mes === null) return;

        // Crear nuevo período basado en el mes 0
        const nuevosPeriodo = {
            mesInicio: parseInt(mes),
            items: JSON.parse(JSON.stringify(obtenerGastosPeriodo(0).items))
        };

        const existe = planData.gastos.some(g => g.mesInicio === parseInt(mes));
        if (existe) {
            alert('Ya existe un período en ese mes');
            return;
        }

        planData.gastos.push(nuevosPeriodo);
        planData.gastos.sort((a, b) => a.mesInicio - b.mesInicio);

        actualizarPeriodosSimple(screen);
    });

    btnAtras.addEventListener('click', () => mostrarPantalla(2));
    btnSiguiente.addEventListener('click', () => {
        mostrarPantalla(4);
    });

    return screen;
}

function actualizarPeriodosSimple(screen) {
    const container = screen.querySelector('#periodosContainer');
    const periodos = planData.gastos.slice(1);
    container.innerHTML = '';

    periodos.forEach(periodo => {
        const div = document.createElement('div');
        div.style.marginBottom = 'var(--spacing-lg)';
        div.innerHTML = `
            <h4 style="margin-bottom: var(--spacing-md); font-size: 14px;">
                📍 A partir de Mes ${periodo.mesInicio}
                <button type="button" class="btn-remove btn-small" style="float: right;" data-mes="${periodo.mesInicio}">
                    Eliminar
                </button>
            </h4>

            <div style="clear: both;"></div>

            <div class="form-group">
                <label class="form-label">Alquiler (€/mes)</label>
                <input 
                    type="number" 
                    class="form-input gasto-input"
                    data-mes="${periodo.mesInicio}"
                    data-nombre="Alquiler"
                    placeholder="0"
                    min="0"
                    step="10"
                    value="${periodo.items[0].cantidad}"
                >
            </div>

            <div class="form-group">
                <label class="form-label">Comida (€/mes)</label>
                <input 
                    type="number" 
                    class="form-input gasto-input"
                    data-mes="${periodo.mesInicio}"
                    data-nombre="Comida"
                    placeholder="0"
                    min="0"
                    step="10"
                    value="${periodo.items[1].cantidad}"
                >
            </div>

            <div class="form-group">
                <label class="form-label">Suministros (€/mes)</label>
                <input 
                    type="number" 
                    class="form-input gasto-input"
                    data-mes="${periodo.mesInicio}"
                    data-nombre="Suministros"
                    placeholder="0"
                    min="0"
                    step="10"
                    value="${periodo.items[2].cantidad}"
                >
            </div>

            <div class="form-group">
                <label class="form-label">Otros (€/mes)</label>
                <input 
                    type="number" 
                    class="form-input gasto-input"
                    data-mes="${periodo.mesInicio}"
                    data-nombre="Otros"
                    placeholder="0"
                    min="0"
                    step="10"
                    value="${periodo.items[3].cantidad}"
                >
            </div>

            <div class="total-display">
                Total Mes ${periodo.mesInicio}: <span id="totalMes${periodo.mesInicio}">0</span>€/mes
            </div>
        `;

        // Event listeners para inputs
        div.querySelectorAll('.gasto-input').forEach(input => {
            input.addEventListener('change', () => {
                const mes = parseInt(input.dataset.mes);
                const periodoPeriodo = obtenerGastosPeriodo(mes);

                if (periodoPeriodo) {
                    const nombre = input.dataset.nombre;
                    const item = periodoPeriodo.items.find(i => i.nombre === nombre);
                    if (item) {
                        item.cantidad = parseFloat(input.value) || 0;
                    }
                }

                actualizarTotalesMes(screen);
            });
        });

        // Botón eliminar
        div.querySelector('.btn-remove').addEventListener('click', () => {
            if (confirm(`¿Eliminar período en mes ${periodo.mesInicio}?`)) {
                eliminarPeriodoGastos(periodo.mesInicio);
                actualizarPeriodosSimple(screen);
                actualizarTotalesMes(screen);
            }
        });

        container.appendChild(div);
    });
}

function actualizarTotalesMes(screen) {
    planData.gastos.forEach(periodo => {
        const total = calcularTotalGastos(periodo.mesInicio);
        const span = screen.querySelector(`#totalMes${periodo.mesInicio}`);
        if (span) {
            span.textContent = total.toLocaleString('es-ES');
        }
    });
}

// ============================================
// PANTALLA 3B: GASTOS (MODO DETALLADO)
// ============================================

function crearPantalla3Detallado() {
    const screen = document.createElement('div');
    screen.className = 'screen';

    const gastosMes0 = obtenerGastosPeriodo(0);
    const otrosPeriodos = planData.gastos.slice(1);

    screen.innerHTML = `
        <div class="screen-header">
            <h1>💸 Gastos Mensuales (Modo Detallado)</h1>
            <p>Paso 3 de 4</p>
        </div>

        <div class="screen-content">
            <div id="seccionMes0">
                <h3 style="margin-bottom: var(--spacing-md); font-size: 16px;">
                    📍 Situación Actual (Mes 0)
                </h3>

                <div id="itemsList0" class="items-list"></div>

                <div class="total-display">
                    Total Mes 0: <span id="totalMes0">0</span>€/mes
                </div>

                <div class="add-item-inputs">
                    <input 
                        type="text" 
                        placeholder="Nombre del gasto (Ej: Spotify)"
                        id="nuevoNombreMes0"
                    >
                    <input 
                        type="number" 
                        placeholder="Cantidad (€)"
                        id="nuevoCantidadMes0"
                        min="0"
                        step="1"
                    >
                    <button type="button" id="btnAgregarMes0">
                        Agregar
                    </button>
                </div>
            </div>

            <div class="checkbox-group" style="margin-top: var(--spacing-xl);">
                <input 
                    type="checkbox" 
                    id="tieneCambiosGastos"
                    ${otrosPeriodos.length > 0 ? 'checked' : ''}
                >
                <label for="tieneCambiosGastos">
                    ¿Habrá cambios en tus gastos en el futuro?
                </label>
            </div>

            <div id="cambiosGastosContainer" style="display: ${otrosPeriodos.length > 0 ? 'block' : 'none'}; margin-top: var(--spacing-lg);">
                <div id="periodosContainer"></div>
                <button type="button" class="btn btn-add-item" id="btnAddPeriodo">
                    + Agregar Período
                </button>
            </div>
        </div>

        <div class="button-group">
            <button type="button" class="btn btn-secondary" id="btnAtras">
                ← Atrás
            </button>
            <button type="button" class="btn btn-primary" id="btnSiguiente">
                Siguiente →
            </button>
        </div>
    `;

    // Event listeners
    const checkboxCambios = screen.querySelector('#tieneCambiosGastos');
    const cambiosContainer = screen.querySelector('#cambiosGastosContainer');
    const btnAddPeriodo = screen.querySelector('#btnAddPeriodo');
    const btnAtras = screen.querySelector('#btnAtras');
    const btnSiguiente = screen.querySelector('#btnSiguiente');

    // Función para renderizar items de un período
    function renderizarItemsPeriodo(mes) {
        const periodo = obtenerGastosPeriodo(mes);
        const container = screen.querySelector(`#itemsList${mes}`);
        if (!container) return;

        container.innerHTML = '';

        periodo.items.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'item-card';
            div.innerHTML = `
                <div class="item-card-content">
                    <div class="item-name">${item.nombre}</div>
                    <div class="item-amount">${parseFloat(item.cantidad).toLocaleString('es-ES')}€/mes</div>
                </div>
                <button type="button" data-mes="${mes}" data-index="${index}">
                    Eliminar
                </button>
            `;

            div.querySelector('button').addEventListener('click', () => {
                periodo.items.splice(index, 1);
                renderizarItemsPeriodo(mes);
                actualizarTotalesMes(screen);
            });

            container.appendChild(div);
        });
    }

    // Función para actualizar totales
    function actualizarTotalesMes(screenLocal) {
        planData.gastos.forEach(periodo => {
            const total = calcularTotalGastos(periodo.mesInicio);
            const span = screenLocal.querySelector(`#totalMes${periodo.mesInicio}`);
            if (span) {
                span.textContent = total.toLocaleString('es-ES');
            }
        });
    }

    // Renderizar items iniciales
    planData.gastos.forEach(periodo => {
        renderizarItemsPeriodo(periodo.mesInicio);
    });

    // Agregar item en mes 0
    screen.querySelector('#btnAgregarMes0').addEventListener('click', () => {
        const nombre = screen.querySelector('#nuevoNombreMes0').value.trim();
        const cantidad = parseFloat(screen.querySelector('#nuevoCantidadMes0').value) || 0;

        if (!nombre) {
            alert('Por favor ingresa un nombre para el gasto');
            return;
        }

        obtenerGastosPeriodo(0).items.push({
            nombre: nombre,
            cantidad: cantidad
        });

        screen.querySelector('#nuevoNombreMes0').value = '';
        screen.querySelector('#nuevoCantidadMes0').value = '';

        renderizarItemsPeriodo(0);
        actualizarTotalesMes(screen);
    });

    // Mostrar/ocultar cambios
    checkboxCambios.addEventListener('change', () => {
        cambiosContainer.style.display = checkboxCambios.checked ? 'block' : 'none';
    });

    // Renderizar períodos existentes
    function actualizarPeriodosDetallado() {
        const container = screen.querySelector('#periodosContainer');
        const periodos = planData.gastos.slice(1);
        container.innerHTML = '';

        periodos.forEach(periodo => {
            const div = document.createElement('div');
            div.style.marginBottom = 'var(--spacing-lg)';
            div.innerHTML = `
                <h4 style="margin-bottom: var(--spacing-md); font-size: 14px; display: flex; justify-content: space-between; align-items: center;">
                    <span>📍 A partir de Mes ${periodo.mesInicio}</span>
                    <button type="button" class="btn-remove btn-small" data-mes="${periodo.mesInicio}">
                        Eliminar Período
                    </button>
                </h4>

                <div id="itemsList${periodo.mesInicio}" class="items-list"></div>

                <div class="total-display">
                    Total Mes ${periodo.mesInicio}: <span id="totalMes${periodo.mesInicio}">0</span>€/mes
                </div>

                <div class="add-item-inputs">
                    <input 
                        type="text" 
                        class="nuevoNombrePeriodo"
                        data-mes="${periodo.mesInicio}"
                        placeholder="Nombre del gasto"
                    >
                    <input 
                        type="number" 
                        class="nuevoCantidadPeriodo"
                        data-mes="${periodo.mesInicio}"
                        placeholder="Cantidad (€)"
                        min="0"
                        step="1"
                    >
                    <button type="button" class="btnAgregarPeriodo" data-mes="${periodo.mesInicio}">
                        Agregar
                    </button>
                </div>
            `;

            div.querySelector('.btn-remove').addEventListener('click', () => {
                if (confirm(`¿Eliminar período en mes ${periodo.mesInicio}?`)) {
                    eliminarPeriodoGastos(periodo.mesInicio);
                    actualizarPeriodosDetallado();
                }
            });

            div.querySelector('.btnAgregarPeriodo').addEventListener('click', function() {
                const mes = parseInt(this.dataset.mes);
                const nombre = div.querySelector('.nuevoNombrePeriodo').value.trim();
                const cantidad = parseFloat(div.querySelector('.nuevoCantidadPeriodo').value) || 0;

                if (!nombre) {
                    alert('Por favor ingresa un nombre para el gasto');
                    return;
                }

                obtenerGastosPeriodo(mes).items.push({
                    nombre: nombre,
                    cantidad: cantidad
                });

                div.querySelector('.nuevoNombrePeriodo').value = '';
                div.querySelector('.nuevoCantidadPeriodo').value = '';

                renderizarItemsPeriodo(mes);
                actualizarTotalesMes(screen);
            });

            container.appendChild(div);
            renderizarItemsPeriodo(periodo.mesInicio);
        });
    }

    actualizarPeriodosDetallado();
    actualizarTotalesMes(screen);

    // Agregar nuevo período
    btnAddPeriodo.addEventListener('click', () => {
        const mes = prompt('¿A partir de qué mes? (ej: 6, 12, 24)');
        if (mes === null) return;

        const existe = planData.gastos.some(g => g.mesInicio === parseInt(mes));
        if (existe) {
            alert('Ya existe un período en ese mes');
            return;
        }

        planData.gastos.push({
            mesInicio: parseInt(mes),
            items: []
        });
        planData.gastos.sort((a, b) => a.mesInicio - b.mesInicio);

        actualizarPeriodosDetallado();
    });

    btnAtras.addEventListener('click', () => mostrarPantalla(2));
    btnSiguiente.addEventListener('click', () => {
        mostrarPantalla(4);
    });

    return screen;
}

// ============================================
// PANTALLA 4: CONFIGURACIÓN DE INVERSIÓN
// ============================================

function crearPantalla4() {
    const screen = document.createElement('div');
    screen.className = 'screen';

    const config = getConfiguracionInversion();

    const fondosPredefinidos = [
        { nombre: 'Vanguard FTSE Global All Cap', comision: 0.42, isin: 'IE00B03HD191' },
        { nombre: 'iShares Developed World', comision: 0.40, isin: 'IE00B4L5Y983' },
        { nombre: 'Amundi Index MSCI World', comision: 0.44, isin: 'LU1738282020' },
        { nombre: 'Custom', comision: 0, isin: '' }
    ];

    screen.innerHTML = `
        <div class="screen-header">
            <h1>📈 Configuración de Inversión</h1>
            <p>Paso 4 de 4</p>
        </div>

        <div class="screen-content">
            <div class="form-group">
                <label class="form-label required">Fondo de Inversión</label>
                <select class="form-select" id="fondoSelect">
                    ${fondosPredefinidos.map(fondo => `
                        <option value="${fondo.nombre}" ${config.fondo === fondo.nombre ? 'selected' : ''}>
                            ${fondo.nombre}
                        </option>
                    `).join('')}
                </select>
            </div>

            <div id="customFondoContainer" style="display: ${config.fondo === 'Custom' ? 'block' : 'none'};">
                <div class="form-group">
                    <label class="form-label required">Nombre del fondo</label>
                    <input 
                        type="text" 
                        class="form-input" 
                        id="customNombre"
                        placeholder="Ej: Mi fondo personalizado"
                        value="${config.fondo === 'Custom' ? config.fondo : ''}"
                    >
                </div>

                <div class="form-group">
                    <label class="form-label">ISIN (opcional)</label>
                    <input 
                        type="text" 
                        class="form-input" 
                        id="customIsin"
                        placeholder="Ej: IE00B03HD191"
                        value="${config.isin}"
                    >
                </div>
            </div>

            <div id="datosInversionContainer">
                <div class="form-group">
                    <label class="form-label required">Comisión Anual (%)</label>
                    <input 
                        type="number" 
                        class="form-input" 
                        id="comision"
                        placeholder="Ej: 0.42"
                        value="${config.comision}"
                        min="0"
                        max="10"
                        step="0.01"
                    >
                    <div class="info-box" id="infoComision"></div>
                </div>

                <div class="form-group">
                    <label class="form-label required">Rentabilidad Anual Esperada (%)</label>
                    <input 
                        type="number" 
                        class="form-input" 
                        id="rentabilidad"
                        placeholder="Ej: 8.5"
                        value="${config.rentabilidad}"
                        min="0"
                        max="50"
                        step="0.1"
                    >
                    <div class="info-box">
                        <strong>💡 Histórico MSCI World:</strong>
                        <br>10 años: ~10-11% bruto
                        <br>5 años: ~13% bruto
                        <br>Recomendación: 8-9% (después de comisiones)
                    </div>
                </div>
            </div>
        </div>

        <div class="button-group">
            <button type="button" class="btn btn-secondary" id="btnAtras">
                ← Atrás
            </button>
            <button type="button" class="btn btn-primary" id="btnCalcular">
                Calcular Plan →
            </button>
        </div>
    `;

    // Event listeners
    const fondoSelect = screen.querySelector('#fondoSelect');
    const customContainer = screen.querySelector('#customFondoContainer');
    const customNombre = screen.querySelector('#customNombre');
    const customIsin = screen.querySelector('#customIsin');
    const comisionInput = screen.querySelector('#comision');
    const rentabilidadInput = screen.querySelector('#rentabilidad');
    const infoComisionDiv = screen.querySelector('#infoComision');
    const btnAtras = screen.querySelector('#btnAtras');
    const btnCalcular = screen.querySelector('#btnCalcular');

    // Mostrar/ocultar custom
    fondoSelect.addEventListener('change', () => {
        const valor = fondoSelect.value;
        customContainer.style.display = valor === 'Custom' ? 'block' : 'none';

        if (valor !== 'Custom') {
            const fondo = fondosPredefinidos.find(f => f.nombre === valor);
            if (fondo) {
                comisionInput.value = fondo.comision;
                actualizarInfoComision();
            }
        }
    });

    // Actualizar info de comisión
    function actualizarInfoComision() {
        const comision = parseFloat(comisionInput.value) || 0;
        const rentabilidad = parseFloat(rentabilidadInput.value) || 0;
        const rentabilidadNeta = rentabilidad - comision;

        infoComisionDiv.innerHTML = `
            <strong>Desglose:</strong>
            <br>Rentabilidad: ${rentabilidad.toFixed(2)}%
            <br>Comisión: -${comision.toFixed(2)}%
            <br><strong style="color: var(--color-primary);">Rentabilidad Neta: ${rentabilidadNeta.toFixed(2)}%</strong>
        `;
    }

    comisionInput.addEventListener('change', actualizarInfoComision);
    rentabilidadInput.addEventListener('change', actualizarInfoComision);

    actualizarInfoComision();

    btnAtras.addEventListener('click', () => mostrarPantalla(3));
    btnCalcular.addEventListener('click', () => {
        // ============================================
        // PASO 1: GUARDAR CONFIGURACIÓN DE INVERSIÓN
        // ============================================
        let fondo = fondoSelect.value;
        let isin = '';
        let comision = parseFloat(comisionInput.value) || 0;

        if (fondo === 'Custom') {
            fondo = customNombre.value || 'Fondo Personalizado';
            isin = customIsin.value;
        } else {
            const fondoPredefinido = fondosPredefinidos.find(f => f.nombre === fondo);
            if (fondoPredefinido) {
                isin = fondoPredefinido.isin;
                comision = fondoPredefinido.comision;
            }
        }

        const rentabilidad = parseFloat(rentabilidadInput.value) || 0;

        // Guardar en planData
        setConfiguracionInversion(fondo, comision, rentabilidad, isin);

        // ============================================
        // PASO 2: VALIDAR DATOS
        // ============================================
        const validacion = validarDatos();
        if (!validacion.valido) {
            console.error('❌ Validación fallida:', validacion.errores);
            alert('❌ Errores encontrados:\n' + validacion.errores.join('\n'));
            return;
        }

        console.log('✅ Validación pasada');

        // ============================================
        // PASO 3: CALCULAR PLAN COMPLETO
        // ============================================
        const resultado = calcularPlanCompleto(planData);
        
        // Guardar en variable global para Fase 3
        window.resultadoCalculos = resultado;
        window.planDataGlobal = planData; // Para acceso posterior

        // ============================================
        // PASO 4: VALIDAR RESULTADO DE CÁLCULOS
        // ============================================
        if (!resultado.valido) {
            console.error('❌ Error en cálculos:', resultado.errores);
            alert('❌ Error en los cálculos:\n' + resultado.errores.join('\n'));
            return;
        }

        console.log('✅ Cálculos completados exitosamente');
        console.log('📊 Proyección 20 años: €' + Math.round(resultado.proyecciones[20].valor));

        // ============================================
        // PASO 5: MOSTRAR WARNINGS (SI HAY)
        // ============================================
        if (resultado.warnings && resultado.warnings.length > 0) {
            console.group('⚠️ ADVERTENCIAS');
            resultado.warnings.forEach(warning => {
                const emoji = warning.tipo === 'error' ? '❌' : 
                            warning.tipo === 'warning' ? '⚠️' : 'ℹ️';
                console.log(`${emoji} [${warning.tipo.toUpperCase()}] ${warning.mensaje}`);
            });
            console.groupEnd();
        }

        const carteraFinal = resultado.cartera[resultado.cartera.length - 1]; // Obtener el último mes
        const proyeccion20 = resultado.proyecciones[20]; // Obtener el resumen de 20 años

        // ============================================
        // PASO 6: MOSTRAR RESUMEN EN CONSOLA
        // ============================================
        console.group('📊 RESUMEN DEL PLAN');
        console.log('Meses calculados:', resultado.planMensual.length);
        // CORRECCIÓN 2: Usar el último elemento de la cartera (o el resumen de 20 años)
        console.log('Valor cartera (mes 240):', Math.round(carteraFinal.valor)); 
        console.log('Aportado total:', Math.round(proyeccion20.aportado));
        console.log('Ganancias:', Math.round(proyeccion20.ganancias));
        console.groupEnd();

        // ============================================
        // PASO 7: PREPARAR PARA FASE 3
        // ============================================
        // Mostrar mensaje de éxito
        alert('✅ Plan creado correctamente!\n\nVer consola (F12) para detalles.\n\nProximamente: Pantalla de Resultados (Fase 3)');
        
        // Log para debug
        console.log('📌 Datos disponibles en consola:');
        console.log('   - window.resultadoCalculos (objeto completo)');
        console.log('   - window.planDataGlobal (datos de entrada)');
        console.log('\nProyecciones:');
        console.log('   - 5 años: €' + Math.round(resultado.proyecciones[5].valor));
        console.log('   - 10 años: €' + Math.round(resultado.proyecciones[10].valor));
        console.log('   - 20 años: €' + Math.round(resultado.proyecciones[20].valor));
    });

    return screen;
}

// ============================================
// UTILIDADES
// ============================================

/**
 * Formatea un número como moneda EUR
 */
function formatearDinero(numero) {
    return numero.toLocaleString('es-ES', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0
    });
}