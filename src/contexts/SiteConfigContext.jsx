// Context para manejar la configuración del sitio desde Firestore
import { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const SiteConfigContext = createContext(null);

// Configuración por defecto (fallback si no hay datos en Firestore)
const DEFAULT_CONFIG = {
    // Configuración de la marca
    brand: {
        name: "PreICFES Seamos Genios",
        tagline: "Tu camino al éxito académico",
        whatsappNumber: "573008871908",
        year: "2026"
    },

    // Configuración de colores (tema)
    theme: {
        primaryColor: "#ef4444", // red-500
        secondaryColor: "#f97316", // orange-500
        accentColor: "#fbbf24", // amber-400
    },

    // Configuración de planes/precios
    plans: [
        {
            id: "plan-b",
            name: "Plan Calendario B",
            price: 250000,
            originalPrice: 350000,
            currency: "COP",
            available: true,
            popular: false,
            urgent: false,
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
            id: "plan-combo",
            name: "Plan Calendario B + A (Combo)",
            price: 375000,
            originalPrice: 500000,
            currency: "COP",
            available: true,
            popular: true,
            urgent: false,
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

    // Textos del Hero
    hero: {
        badge: "Mejor Curso PreICFES 2026",
        title: "Transforma tu",
        titleHighlight: "Futuro Académico",
        subtitle: "El programa de preparación más completo para el examen ICFES Saber 11°",
        ctaText: "Comenzar Ahora",
        ctaSecondaryText: "Ver Planes"
    },

    // Fechas importantes
    dates: {
        classStart: "2024-12-10",
        examDateB: "2025-03-14",
        examDateA: "2025-07-25"
    },

    // Timeline de fases de venta
    timeline: [
        {
            id: "fase-1",
            title: "Fase 1: Lanzamiento",
            dateLabel: "Hasta 10 Dic",
            targetDate: "2024-12-10",
            unlockDate: "2024-12-01",
            description: "Venta habilitada para inicio 10 Dic.",
            price: 375000,
            basePrice: 500000,
            savingsText: "$125.000 (25% OFF)"
        },
        {
            id: "fase-2",
            title: "Fase 2: Enero",
            dateLabel: "Abre: 1 de Enero",
            targetDate: "2025-01-10",
            unlockDate: "2025-01-01",
            description: "Inicio de clases grupo Enero.",
            price: 325000,
            basePrice: 500000,
            savingsText: "$175.000 (35% OFF)"
        },
        {
            id: "fase-3",
            title: "Fase 3: Febrero",
            dateLabel: "Abre: 1 de Febrero",
            targetDate: "2025-02-10",
            unlockDate: "2025-02-01",
            description: "Inicio de clases grupo Febrero.",
            price: 295000,
            basePrice: 500000,
            savingsText: "$205.000 (41% OFF)"
        },
        {
            id: "fase-4",
            title: "Fase 4: Cierre Combo",
            dateLabel: "Cierre: 10 de Marzo",
            targetDate: "2025-03-10",
            unlockDate: "2025-03-01",
            description: "Última oportunidad para Combo B+A.",
            price: null,
            priceText: "Última Oportunidad",
            basePrice: 500000,
            savingsText: "Finaliza Venta Combos"
        }
    ],

    // Metadata
    lastUpdated: null,
    updatedBy: null
};

export function SiteConfigProvider({ children }) {
    const [config, setConfig] = useState(DEFAULT_CONFIG);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Escuchar cambios en tiempo real desde Firestore
    useEffect(() => {
        const unsubscribe = onSnapshot(
            doc(db, 'site_config', 'main'),
            (docSnapshot) => {
                if (docSnapshot.exists()) {
                    // Merge con defaults para asegurar que todos los campos existen
                    const data = docSnapshot.data();
                    setConfig(prev => ({
                        ...DEFAULT_CONFIG,
                        ...data,
                        brand: { ...DEFAULT_CONFIG.brand, ...data.brand },
                        theme: { ...DEFAULT_CONFIG.theme, ...data.theme },
                        hero: { ...DEFAULT_CONFIG.hero, ...data.hero },
                        dates: { ...DEFAULT_CONFIG.dates, ...data.dates },
                        plans: data.plans || DEFAULT_CONFIG.plans,
                        timeline: data.timeline || DEFAULT_CONFIG.timeline
                    }));
                } else {
                    // Si no existe el documento, crear con defaults
                    initializeConfig();
                }
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching site config:", err);
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    // Inicializar configuración en Firestore
    const initializeConfig = async () => {
        try {
            await setDoc(doc(db, 'site_config', 'main'), {
                ...DEFAULT_CONFIG,
                lastUpdated: new Date().toISOString(),
                updatedBy: 'system'
            });
        } catch (err) {
            console.error("Error initializing config:", err);
        }
    };

    // Actualizar configuración
    const updateConfig = async (newConfig) => {
        try {
            await setDoc(doc(db, 'site_config', 'main'), {
                ...config,
                ...newConfig,
                lastUpdated: new Date().toISOString()
            }, { merge: true });
            return true;
        } catch (err) {
            console.error("Error updating config:", err);
            setError(err.message);
            return false;
        }
    };

    // Actualizar solo los planes
    const updatePlans = async (plans) => {
        return updateConfig({ plans });
    };

    // Actualizar solo el tema
    const updateTheme = async (theme) => {
        return updateConfig({ theme });
    };

    // Actualizar textos del Hero
    const updateHero = async (hero) => {
        return updateConfig({ hero });
    };

    // Actualizar información de marca
    const updateBrand = async (brand) => {
        return updateConfig({ brand });
    };

    // Actualizar timeline de fases
    const updateTimeline = async (timeline) => {
        return updateConfig({ timeline });
    };

    // Actualizar fechas
    const updateDates = async (dates) => {
        return updateConfig({ dates });
    };

    const value = {
        config,
        loading,
        error,
        updateConfig,
        updatePlans,
        updateTheme,
        updateHero,
        updateBrand,
        updateTimeline,
        updateDates,
        DEFAULT_CONFIG
    };

    return (
        <SiteConfigContext.Provider value={value}>
            {children}
        </SiteConfigContext.Provider>
    );
}

// Hook para usar la configuración
export function useSiteConfig() {
    const context = useContext(SiteConfigContext);
    if (!context) {
        throw new Error('useSiteConfig must be used within a SiteConfigProvider');
    }
    return context;
}

// Hook para formatear precios
export function useFormatPrice() {
    return (price, currency = 'COP') => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };
}

export default SiteConfigContext;
