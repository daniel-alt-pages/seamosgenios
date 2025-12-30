// Script para inicializar las colecciones de Firestore
// Ejecutar una sola vez para configurar el sistema

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection } from 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC3J8mjVK20PJQCRvhJOyWOyI9A7rH20_8",
    authDomain: "seamosgenios-94122.firebaseapp.com",
    projectId: "seamosgenios-94122",
    storageBucket: "seamosgenios-94122.firebasestorage.app",
    messagingSenderId: "1022591625581",
    appId: "1:1022591625581:web:6d6102dd272742ffc51264"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ============================================
// CONFIGURACIÓN - MODIFICA ESTOS VALORES
// ============================================

// Emails de administradores autorizados
const ADMIN_EMAILS = [
    {
        email: "danielff999gf@gmail.com",
        name: "Daniel",
        role: "superadmin"
    },
    // Puedes agregar más admins aquí
];

// Configuración inicial del sitio
const SITE_CONFIG = {
    brand: {
        name: "PreICFES Seamos Genios",
        tagline: "Tu camino al éxito académico en el ICFES Saber 11°",
        whatsappNumber: "573008871908",
        year: "2026"
    },

    theme: {
        primaryColor: "#ef4444",
        secondaryColor: "#f97316",
        accentColor: "#fbbf24"
    },

    hero: {
        badge: "Mejor Curso PreICFES 2026",
        title: "Transforma tu",
        titleHighlight: "Futuro Académico",
        subtitle: "El programa de preparación más completo para el examen ICFES Saber 11°. Clases en vivo, simulacros y acompañamiento personalizado.",
        ctaText: "Comenzar Ahora",
        ctaSecondaryText: "Ver Planes"
    },

    dates: {
        classStart: "2024-12-10",
        examDateB: "2025-03-14",
        examDateA: "2025-07-25"
    },

    plans: [
        {
            id: "plan-calendario-b",
            name: "Plan Calendario B",
            price: 250000,
            originalPrice: 350000,
            currency: "COP",
            available: true,
            popular: false,
            urgent: true,
            startDate: "2024-12-10",
            endDate: "2025-03-14",
            inscriptionDeadline: "2025-01-10",
            features: [
                "525 Horas Totales de Entrenamiento",
                "4 Horas Diarias en Vivo",
                "Cloud Vault 1000GB Acceso Ilimitado",
                "106+ Cuadernillos Oficiales ICFES",
                "4 Simulacros Completos Calificados",
                "Orientación Vocacional Personalizada",
                "Soporte Ilimitado con Docentes",
                "Plataforma IA con Análisis de Datos"
            ]
        },
        {
            id: "plan-combo-anual",
            name: "Plan Calendario B + A (Combo)",
            price: 375000,
            originalPrice: 500000,
            currency: "COP",
            available: true,
            popular: true,
            urgent: true,
            startDate: "2024-12-10",
            endDate: "2025-07-25",
            inscriptionDeadline: "2025-01-10",
            features: [
                "800 Horas en Vivo + 100h Grabadas",
                "Preparación Doble Calendario A y B",
                "Cloud Vault 1000GB Acceso Total",
                "106+ Cuadernillos Oficiales",
                "Simulacros Diagnóstico + 4 Completos",
                "Orientación Vocacional Premium",
                "Comunidad VIP Exclusiva",
                "Seminarios con Expertos Invitados",
                "Certificado de Finalización"
            ]
        }
    ],

    // Timeline de fases de venta (Año 2025-2026)
    timeline: [
        {
            id: "fase-1",
            title: "Fase 1: Lanzamiento",
            dateLabel: "Hasta 10 Ene",
            targetDate: "2025-01-10",
            unlockDate: "2025-01-01",
            description: "Venta habilitada para inicio 10 Ene.",
            price: 375000,
            basePrice: 500000,
            savingsText: "$125.000 (25% OFF)"
        },
        {
            id: "fase-2",
            title: "Fase 2: Febrero",
            dateLabel: "Abre: 1 de Febrero",
            targetDate: "2025-02-10",
            unlockDate: "2025-02-01",
            description: "Inicio de clases grupo Febrero.",
            price: 325000,
            basePrice: 500000,
            savingsText: "$175.000 (35% OFF)"
        },
        {
            id: "fase-3",
            title: "Fase 3: Marzo",
            dateLabel: "Abre: 1 de Marzo",
            targetDate: "2025-03-10",
            unlockDate: "2025-03-01",
            description: "Inicio de clases grupo Marzo.",
            price: 295000,
            basePrice: 500000,
            savingsText: "$205.000 (41% OFF)"
        },
        {
            id: "fase-4",
            title: "Fase 4: Cierre Combo",
            dateLabel: "Cierre: 10 de Abril",
            targetDate: "2025-04-10",
            unlockDate: "2025-04-01",
            description: "Última oportunidad para Combo B+A.",
            price: null,
            priceText: "Última Oportunidad",
            basePrice: 500000,
            savingsText: "Finaliza Venta Combos"
        }
    ],

    lastUpdated: new Date().toISOString(),
    updatedBy: "system-init"
};

// ============================================
// FUNCIONES DE INICIALIZACIÓN
// ============================================

async function initializeAdmins() {
    console.log("📝 Creando colección de administradores...");

    for (const admin of ADMIN_EMAILS) {
        try {
            await setDoc(doc(db, 'admins', admin.email), {
                isActive: true,
                name: admin.name,
                role: admin.role,
                createdAt: new Date().toISOString()
            });
            console.log(`  ✅ Admin agregado: ${admin.email}`);
        } catch (error) {
            console.error(`  ❌ Error con ${admin.email}:`, error.message);
        }
    }
}

async function initializeSiteConfig() {
    console.log("⚙️ Creando configuración del sitio...");

    try {
        await setDoc(doc(db, 'site_config', 'main'), SITE_CONFIG);
        console.log("  ✅ Configuración del sitio creada");
    } catch (error) {
        console.error("  ❌ Error:", error.message);
    }
}

async function initializeAll() {
    console.log("\n🚀 INICIALIZANDO FIRESTORE PARA SEAMOS GENIOS\n");
    console.log("=".repeat(50));

    await initializeAdmins();
    console.log("");
    await initializeSiteConfig();

    console.log("\n" + "=".repeat(50));
    console.log("✨ ¡Inicialización completada!");
    console.log("\n📋 Próximos pasos:");
    console.log("   1. Verifica en Firebase Console que las colecciones se crearon");
    console.log("   2. Configura las reglas de seguridad de Firestore");
    console.log("   3. Habilita Google Auth en Firebase Console");
    console.log("   4. Accede a /admin en tu sitio y prueba el login");
    console.log("");

    process.exit(0);
}

// Ejecutar
initializeAll();
