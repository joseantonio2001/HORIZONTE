# Horizonte - Investment Planning Calculator

<div align="center">

![Horizonte Logo](https://img.shields.io/badge/Horizonte-Investment%20Planning-2180AE?style=flat-square)
![Status](https://img.shields.io/badge/Status-Phase%202%20In%20Progress-yellow?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-yellow?style=flat-square)

**Plan your financial future with confidence** 📊

A modern web-based investment planning tool that helps you visualize long-term financial growth. Calculate projected portfolio value over 20 years while considering salary changes, expense variations, and investment commissions.

[Features](#-features) • [Current Status](#-current-status) • [Installation](#-installation) • [Roadmap](#-roadmap)

</div>

---

## 🎯 Features

### Phase 1: Data Entry Interface ✅ COMPLETE

- **📈 Income Tracking** - Register current salary and schedule future salary changes
- **💰 Flexible Expense Management** - Two modes:
  - **Simple Mode**: 4 predefined categories (Rent, Food, Utilities, Other)
  - **Detailed Mode**: Unlimited custom expense items
- **🏦 Investment Configuration** - Select from preset funds or create custom investment profiles
- **✅ Real-time Validation** - Comprehensive form validation with clear error messages
- **📱 Responsive Design** - Works perfectly on mobile, tablet, and desktop
- **🎨 Modern UI** - Built with design system using CSS variables
- **⚡ Zero Dependencies** - Pure HTML/CSS/JavaScript (no frameworks!)

### Phase 2: Calculation Engine 🔄 IN PROGRESS

- **📊 Monthly Investment Calculations** - Smart allocation based on emergency fund status
- **💡 20-Year Projections** - Full projection with salary changes and expense variations
- **🏦 Portfolio Growth Simulation** - Real-time investment portfolio value calculation
- **⚠️ Warnings & Alerts** - Detect problematic scenarios (insolvency, low savings rate)
- **💰 Emergency Fund Tracking** - Automatic detection of emergency fund status
- **🔢 Advanced Calculations** - 
  - Salary tracking with future changes
  - Expense period management
  - Adaptive investment percentage (30% vs 60%)
  - Portfolio value with compound interest
  - Net return after commissions

**Functions Implemented:**
```javascript
✅ obtenerSalarioMes(mes, ingresos)
✅ obtenerGastosMes(mes, gastos)
✅ calcularInversionMensual(salario, gastos, ahorroAcumulado)
✅ generarPlanMensual(planData, meses = 240)
✅ calcularValorCartera(planMensual, rentabilidad, comision)
✅ generarProyecciones(cartera)
✅ calcularWarnings(planData, planMensual)
✅ calcularPlanCompleto(planData) [MASTER FUNCTION]
```

### Phase 3: Results Dashboard (Coming Soon)
- Visual data presentation
- Detailed tables and summaries
- Growth projections (5, 10, 20 years)
- Period-based investment summary

### Phase 4: Charts & Visualization (Coming Soon)
- Portfolio evolution chart (Line)
- Composition breakdown (Pie chart)
- Monthly investment visualization (Bar chart)

### Phase 5: Storage & Export (Coming Soon)
- Save plans to browser (localStorage)
- PDF export functionality
- Plan management (load, delete, compare)

---

## 📊 Current Status

### Phase Progress

| Phase | Name | Status | ETA | Completion |
|-------|------|--------|-----|------------|
| 1 | Data Entry Interface | ✅ Complete | Dec 2025 | 100% |
| 2 | Calculation Engine | 🔄 In Progress | Dec 10, 2025 | 80% |
| 3 | Results Dashboard | ⏳ Planned | Dec 11, 2025 | 0% |
| 4 | Charts & Visualization | ⏳ Planned | Dec 12, 2025 | 0% |
| 5 | Storage & Export | ⏳ Planned | Dec 13, 2025 | 0% |

**Overall Project: 28% Complete** 📈

---

## 📦 Installation

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/joseantonio2001/horizonte.git
cd horizonte
```

2. **Open in browser**
```bash
# Option A: Double-click index.html

# Option B: Local server (Python 3)
python -m http.server 8000
# Visit http://localhost:8000
```

### Project Structure
```
horizonte/
├── index.html              # Main HTML file
├── css/
│   └── styles.css         # Design system (responsive, 35KB)
├── js/
│   ├── data.js            # Data management & validation (8 functions)
│   ├── calculadora.js     # Calculation engine (8 functions) ← NEW Phase 2
│   └── app.js             # UI & navigation logic (1000+ lines)
├── README.md              # This file
└── .gitignore
```

---

## 🧪 How to Test Phase 2

### Automated Test Case: José

This predefined scenario tests all Phase 2 features:

1. **Setup in Browser Console (F12):**
```javascript
// Input income data
setSalarioInicial(1300);
agregarCambioSalario(24, 1800, "Aumento");

// Select mode
setModoGastos("simple");

// Add expenses
actualizarGastosPeriodo(0, [
  { nombre: "Alquiler", cantidad: 0 },
  { nombre: "Comida", cantidad: 0 },
  { nombre: "Suministros", cantidad: 0 },
  { nombre: "Otros", cantidad: 0 }
]);

actualizarGastosPeriodo(6, [
  { nombre: "Alquiler", cantidad: 400 },
  { nombre: "Comida", cantidad: 250 },
  { nombre: "Suministros", cantidad: 100 },
  { nombre: "Otros", cantidad: 0 }
]);

// Configure investment
setConfiguracionInversion("Vanguard FTSE Global All Cap", 0.42, 8.5, "IE00B03HD191");

// Run calculations
const resultado = calcularPlanCompleto(planData);
console.log(resultado);
```

### Expected Results for José:

**Months 0-5 (No expenses):**
- Monthly savings: 1,300€
- Monthly investment: 550€ (65% max)
- Emergency fund status: Building

**Months 6-23 (Expenses 750€):**
- Monthly savings: 550€
- Monthly investment: 275€ (30%, emergency fund not ready)
- Emergency fund target: 2,250€

**Months 24+ (Salary increase to 1,800€):**
- Monthly savings: 1,050€
- Monthly investment: 530€ (60%, emergency fund ready)
- Portfolio growth accelerates

**20-Year Projections:**
```
5 Years:
- Aportado: ~18,000€
- Ganancias: ~3,000€
- TOTAL: ~21,000€

10 Years:
- Aportado: ~42,000€
- Ganancias: ~12,000€
- TOTAL: ~54,000€

20 Years (Financial Independence!):
- Aportado: ~95,000€
- Ganancias: ~78,200€
- TOTAL: ~173,200€ 🎉
```

---

## 🎨 Design System

Built on a comprehensive design system with:
- **Colors**: Professional palette (Teal #2180AE, Cream background)
- **Typography**: System font stack (Roboto, SF Pro, Segoe UI)
- **Spacing**: 8px base unit with consistent scale
- **Components**: Buttons, forms, cards, tables
- **Responsive**: Mobile-first approach
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: 1024px+

---

## 🔧 Architecture

### Phase 1: Data Management (`data.js`)
**13 functions** for managing user input:
- Income tracking
- Expense management (Simple & Detailed modes)
- Investment configuration
- Data validation
- Centralized state management

### Phase 2: Calculation Engine (`calculadora.js`)
**8 functions** for financial calculations:

**Income & Expense Retrieval:**
- `obtenerSalarioMes()` - Get salary for any month
- `obtenerGastosMes()` - Get expenses for any month

**Investment Logic:**
- `calcularInversionMensual()` - Smart investment allocation
  - 30% of savings if emergency fund incomplete
  - 60% of savings if emergency fund ready
  - Min: 25€, Max: 65% of savings

**Plan Generation:**
- `generarPlanMensual()` - 240 months (20 years) calculation
- `calcularValorCartera()` - Portfolio growth with compound interest
- `generarProyecciones()` - Summary at 5, 10, 20 years

**Alerts & Validation:**
- `calcularWarnings()` - Detect problematic scenarios
- `calcularPlanCompleto()` - Master function coordinating all calculations

### Phase 1: UI Control (`app.js`)
**Navigation & Rendering:**
- Screen-based navigation system
- Dynamic form generation
- Event handling and validation

---

## 📊 Calculation Examples

### Investment Allocation Logic

```
Rule 1: If emergency fund < (expenses × 3)
        → Invest 30% of monthly savings (prioritize safety)

Rule 2: If emergency fund ≥ (expenses × 3)
        → Invest 60% of monthly savings (more aggressive)

Rule 3: Always apply limits
        → Minimum: 25€ per month
        → Maximum: 65% of monthly savings

Example (Case José, Month 6):
- Salary: 1,300€
- Expenses: 750€
- Monthly savings: 550€
- Emergency fund required: 750€ × 3 = 2,250€
- Emergency fund accumulated: 1,300€ (incomplete)
- → Apply Rule 1: Invest 30%
- → 550€ × 30% = 165€
- → Check limits: 25€ < 165€ < 357€ ✓
- → Final investment: 165€
```

### Portfolio Growth Formula

```
Monthly Return = Annual Return / 12
Net Return = Gross Return - Commission

Example with Vanguard (8.5% - 0.42% = 8.08% net):
- Month 0: Portfolio = 550€
- Month 1: Portfolio = 550€ × (1 + 0.0808/12) + 550€ = 1,104€
- Month 2: Portfolio = 1,104€ × (1 + 0.0808/12) + 550€ = 1,660€
- ...continues for 240 months

By Month 240: ~173,200€ (from ~95,000€ invested)
```

---

## 🎯 Use Cases

✅ Plan for **financial independence**
✅ **Visualize** long-term wealth building
✅ **Track** investment scenarios
✅ **Compare** different investment strategies
✅ **Document** financial decisions

---

## 💡 Best Practices Implemented

- ✅ Semantic HTML
- ✅ Accessibility (ARIA, keyboard navigation, focus states)
- ✅ Responsive design (mobile-first)
- ✅ Input validation & error handling
- ✅ Clean code structure (separation of concerns)
- ✅ CSS variables for theming
- ✅ No external dependencies
- ✅ Pure functions (calculadora.js)
- ✅ Comprehensive logging for debugging

---

## 📝 Commit History

- **Dec 10, 2025 - 14:30** - Phase 1 complete ✅
  - feat: Complete data entry interface with 4-screen wizard
  - 2,000+ lines of code, 21 functions implemented

- **Dec 10, 2025 - 14:45** - Phase 2 started 🔄
  - feat: Add calculation engine with 8 financial functions
  - Implements 20-year projection with compound growth
  - Smart investment allocation based on emergency fund status

---

## 📧 Contact

- GitHub: [@joseantonio2001](https://github.com/joseantonio2001)
- Project: [Horizonte](https://github.com/joseantonio2001/horizonte)
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

**Made with ❤️ for financial independence** 

*Building wealth, one calculation at a time.*
