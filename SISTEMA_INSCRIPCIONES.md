# 🎯 Sistema de Ventanas de Inscripción - PreICFES 2026

## 📅 Calendario de Inscripciones

### **Periodo 1: 10 Diciembre - 10 Enero**
**Estado:** ✅ INSCRIPCIONES ABIERTAS

**Planes Disponibles:**
- 📘 **Plan Calendario B** - $250,000
  - Contador: "Inscripciones cierran en X días"
  - Cierra: 10 de enero
  
- 🔥 **Plan Calendario B + A** - $375,000 (MÁS POPULAR)
  - Contador: "Inscripciones cierran en X días"
  - Cierra: 10 de enero

---

### **Periodo 2: 10 Enero - 10 Febrero**
**Estado:** 🔄 CAMBIO DE PRECIOS

**Planes Cerrados:**
- ❌ **Plan Calendario B** - CERRADO
  - Overlay naranja: "Inscripciones Cerradas"
  - Mensaje: "Este plan cerró inscripciones el 10 de enero"

**Planes Disponibles:**
- 🔥 **Plan Calendario B + A** - $325,000 (REBAJADO de $375k)
  - Contador: "Inscripciones cierran en X días"
  - Cierra: 10 de febrero

---

### **Periodo 3: 10 Febrero - 10 Marzo**
**Estado:** 🔄 CAMBIO DE PRECIOS

**Planes Cerrados:**
- ❌ **Plan Calendario B** - CERRADO
  - Mensaje: "Este plan cerró inscripciones el 10 de febrero"

**Planes Disponibles:**
- 🔥 **Plan Calendario B + A** - $295,000 (REBAJADO de $325k)
  - Contador: "Inscripciones cierran en X días"
  - Cierra: 10 de marzo

---

### **Periodo 4: 10 Marzo - 14 Marzo**
**Estado:** 🚨 TRANSICIÓN

**Planes Cerrados:**
- ❌ **Plan Calendario B** - CERRADO
- ❌ **Plan Calendario B + A** - CERRADO
  - Ambos con overlay naranja

**Planes Disponibles:**
- 🔥 **Plan Calendario A** - $250,000
  - Contador: "Finaliza en X días"
  - Disponible hasta: 25 de julio

---

### **Periodo 5: 14 Marzo - 25 Julio**
**Estado:** ✅ SOLO CALENDARIO A

**Planes Disponibles:**
- 🔥 **Plan Calendario A** - $250,000
  - Contador: "Finaliza en X días"
  - Disponible hasta: 25 de julio

---

### **Después del 25 Julio**
**Estado:** ⛔ CURSO FINALIZADO

---

## 🎨 Elementos Visuales

### Planes Disponibles
- ✅ Botón "Elegir Plan" activo
- ⏱️ Contador regresivo en tiempo real
- 🎯 Badge "MÁS POPULAR" si aplica
- 💫 Efectos de hover y animaciones

### Planes Cerrados (Expired)
- 🔒 Overlay oscuro con blur
- 🟠 Icono de reloj naranja
- 🏷️ Badge naranja "INSCRIPCIONES CERRADAS"
- 📝 Mensaje explicativo con fecha de cierre

### Planes Próximamente
- 🔒 Overlay oscuro con blur
- 🔴 Icono de candado rojo
- 📅 Fecha de disponibilidad

---

## 💡 Lógica de Urgencia

1. **Escasez Temporal**: Cada periodo tiene una ventana limitada
2. **Precios Decrecientes**: El precio baja cada mes ($375k → $325k → $295k)
3. **Contadores Visibles**: Muestran exactamente cuándo se cierra la inscripción
4. **FOMO**: Los planes cerrados muestran lo que se perdieron

---

## 🔄 Actualización Automática

- ✅ Los planes se actualizan cada minuto
- ✅ Los contadores se actualizan cada segundo
- ✅ No requiere recarga manual de la página
