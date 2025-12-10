# FASE 1: ENTRADA DE DATOS - README

## ✅ COMPLETADO

Fase 1 del Planificador de Inversiones está **100% funcional y lista para usar**.

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
proyecto-inversiones/
├── index.html          ← Archivo principal (abre esto en el navegador)
├── css/
│   └── styles.css      ← Todos los estilos
├── js/
│   ├── data.js         ← Gestión de datos
│   └── app.js          ← Lógica de navegación y pantallas
└── README.md           ← Este archivo
```

---

## 🚀 CÓMO USAR

### 1. Instalación (Local)

1. **Crea una carpeta** en tu ordenador:
   ```bash
   mkdir proyecto-inversiones
   cd proyecto-inversiones
   ```

2. **Crea la estructura de carpetas**:
   ```bash
   mkdir css js
   ```

3. **Coloca los archivos**:
   - `index.html` en la raíz
   - `css/styles.css` en la carpeta `css/`
   - `js/data.js` en la carpeta `js/`
   - `js/app.js` en la carpeta `js/`

4. **Abre en el navegador**:
   - Haz doble clic en `index.html` O
   - Arrastra `index.html` al navegador OR
   - Usa un servidor local:
     ```bash
     # Con Python 3:
     python -m http.server 8000
     # Luego accede a: http://localhost:8000
     ```

---

## 🎯 QUÉ HACE FASE 1

### Pantalla 1: Ingresos
- Ingresa tu salario neto mensual actual
- Opcionalmente agrega cambios de salario futuros (mes X: salario Y€)
- Los cambios se guardan en memoria

### Pantalla 2: Selección de Modo
- Elige entre **Modo Simple** o **Modo Detallado** para registrar gastos
- Simple: 4 categorías fijas (Alquiler, Comida, Suministros, Otros)
- Detallado: Gastos ilimitados personalizados

### Pantalla 3: Gastos
Depende del modo elegido:

**Si elegiste Simple:**
- Ingresa gastos por categoría
- Total automático
- Opcionalmente agrega períodos futuros con diferentes gastos

**Si elegiste Detallado:**
- Añade cada gasto individualmente (Spotify, Gimnasio, etc.)
- Total automático
- Opcionalmente agrega períodos futuros

### Pantalla 4: Inversión
- Selecciona un fondo de inversión predefinido O crea uno personalizado
- Define comisión anual y rentabilidad esperada
- Al terminar, calcula el plan (preparado para Fase 2)

---

## 💾 DATOS ALMACENADOS

Los datos se guardan en la **memoria del navegador** (JavaScript). Si recarga la página, los datos se pierden.

En **Fase 5** añadiremos `localStorage` para persistencia.

### Estructura de Datos Actual

```javascript
planData = {
  ingresos: [
    { mesInicio: 0, salario: 1300, descripcion: "Inicial" },
    { mesInicio: 24, salario: 1800, descripcion: "Aumento" }
  ],
  modoGastos: "simple", // o "detallado"
  gastos: [
    {
      mesInicio: 0,
      items: [
        { nombre: "Alquiler", cantidad: 400 },
        { nombre: "Comida", cantidad: 250 },
        { nombre: "Suministros", cantidad: 100 },
        { nombre: "Otros", cantidad: 0 }
      ]
    }
  ],
  inversion: {
    fondo: "Vanguard FTSE Global All Cap",
    isin: "IE00B03HD191",
    comision: 0.42,
    rentabilidad: 8.5
  }
}
```

---

## 🧪 PRUEBA CON CASO JOSÉ

Para validar que todo funciona, sigue estos pasos:

1. **Pantalla 1 - Ingresos:**
   - Salario inicial: `1300`
   - Agregar cambio: Mes `24`, Salario `1800`
   - Click "Siguiente"

2. **Pantalla 2 - Modo Gastos:**
   - Selecciona `Modo Simple`
   - Click "Siguiente"

3. **Pantalla 3 - Gastos (Simple):**
   - Mes 0: Todos los campos en `0`
   - Agregar período: Mes `6`
   - Mes 6: Alquiler `400`, Comida `250`, Suministros `100`, Otros `0`
   - Click "Siguiente"

4. **Pantalla 4 - Inversión:**
   - Fondo: `Vanguard FTSE Global All Cap`
   - Rentabilidad: `8.5`
   - Click "Calcular Plan"

5. **Verifica en la consola:**
   - Abre DevTools (`F12` o `Ctrl+Shift+I`)
   - Ve a pestaña "Console"
   - Deberías ver `RESUMEN DEL PLAN` con todos los datos

---

## 🔧 FUNCIONES DISPONIBLES (Para DEBUG)

En la consola del navegador (`F12`), puedes usar estas funciones:

```javascript
// Ver resumen del plan
resumenPlan()

// Modificar salario inicial
setSalarioInicial(1500)

// Obtener salario actual
getSalarioInicial()

// Validar datos
validarDatos()

// Reiniciar todo a cero
reiniciarPlanData()
```

---

## ✨ CARACTERÍSTICAS IMPLEMENTADAS

✅ Navegación entre 4 pantallas  
✅ Entrada de ingresos y cambios futuros  
✅ Selección de modo de gastos  
✅ Modo Simple y Detallado completamente funcional  
✅ Configuración de inversión  
✅ Cálculo automático de totales  
✅ Validaciones de datos  
✅ Responsivo (mobile + desktop)  
✅ Interfaz intuitiva y bonita  

---

## 🎨 DISEÑO

- **Colores:** Azul principal (#2180AE), Teal secundario (#32B8C6)
- **Fuente:** Sistema default del SO (responsive)
- **Animaciones:** Suave slide-in al cambiar pantallas
- **Responsive:** 100% funcional en mobile, tablet y desktop

---

## ⚠️ NOTAS IMPORTANTES

1. **Los datos NO se guardan** - Si recarga la página, se pierden. Esto está planeado para Fase 5.

2. **Sin cálculos aún** - Fase 1 es solo entrada de datos. Los cálculos vienen en Fase 2.

3. **Validaciones básicas** - Comprueba que los números sean válidos y en orden ascendente.

4. **Console.log para debug** - Abre DevTools para ver logs de las acciones.

---

## 🚀 PRÓXIMO PASO

Cuando esté lista la Fase 2, tendremos:
- Motor de cálculos (`calculadora.js`)
- Proyecciones a 5, 10, 20 años
- Determinación de inversión mensual óptima
- Advertencias y validaciones avanzadas

Tras Fase 2, toda la aplicación será **completamente funcional**.

---

## 📝 LÍNEAS DE CÓDIGO

- **index.html:** ~25 líneas
- **styles.css:** ~700 líneas (con comentarios)
- **data.js:** ~300 líneas (funciones + datos)
- **app.js:** ~1000 líneas (lógica de pantallas)

**Total Fase 1:** ~2025 líneas

---

## ✅ CHECKLIST DE VALIDACIÓN

- [ ] Archivo `index.html` se abre en navegador
- [ ] Se muestra Pantalla 1 (Ingresos)
- [ ] Puedo navegar entre las 4 pantallas
- [ ] Los datos se guardan al escribir
- [ ] Los totales se calculan automáticamente
- [ ] Puedo agregar/eliminar cambios de salario y gastos
- [ ] Pantalla 4 muestra fondos predefinidos
- [ ] Console muestra logs sin errores (`F12`)
- [ ] Interfaz se ve bien en mobile y desktop
- [ ] Caso José se puede completar sin errores

---

**¡Fase 1 completada! 🎉**

Cuando quieras pasar a Fase 2, avisame y crearemos el motor de cálculos.