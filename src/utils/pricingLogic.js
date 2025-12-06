// Lógica de precios dinámica basada en fechas

const WHATSAPP_NUMBER = "573008871908";

const createWhatsAppLink = (planName, price) => {
    const message = encodeURIComponent(`Hola, quiero inscribirme al ${planName} de ${price}. ¿Podrían darme más información?`);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
};

export const getPricingInfo = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const nextYear = currentYear + 1;

    // Definir fechas clave
    const dates = {
        dec10: new Date(currentYear, 11, 10), // 10 de diciembre
        jan1: new Date(nextYear, 0, 1),      // 1 de enero (Inicio Preventa Enero)
        jan10: new Date(nextYear, 0, 10),     // 10 de enero (Inicio Clases Enero)
        feb1: new Date(nextYear, 1, 1),      // 1 de febrero (Inicio Preventa Febrero)
        feb10: new Date(nextYear, 1, 10),     // 10 de febrero (Inicio Clases Febrero)
        mar1: new Date(nextYear, 2, 1),      // 1 de marzo (Inicio Preventa Marzo)
        mar10: new Date(nextYear, 2, 10),     // 10 de marzo (Inicio Clases Marzo)
        mar14: new Date(nextYear, 2, 14),     // 14 de marzo
        jul25: new Date(nextYear, 6, 25),     // 25 de julio
    };

    let plans = [];

    // FASE 1: PREVENTA Y VENTA DIC (Hasta el 10 de Enero)
    // Se habilita la venta inmediata para los planes que inician el 10 de dic.
    if (now < dates.jan1) {
        plans = [
            {
                name: "Plan Calendario B",
                price: "$250.000",
                originalPrice: "$350.000",
                available: true,
                endDate: dates.mar14,
                countdownTarget: now < dates.dec10 ? dates.dec10 : dates.jan10,
                countdownLabel: now < dates.dec10 ? "Inicio de Clases en" : "Inscripciones cierran en",
                features: [
                    "525 Horas Totales de Entrenamiento",
                    "4 Horas Diarias en Vivo",
                    "Cloud Vault 1000GB Acceso Ilimitado",
                    "106+ Cuadernillos Oficiales ICFES",
                    "4 Simulacros Completos Calificados",
                    "Orientación Vocacional Personalizada",
                    "Soporte Ilimitado con Docentes",
                    "Plataforma IA con Análisis de Datos"
                ],
                popular: false,
                inscriptionDeadline: dates.jan10,
                whatsappLink: createWhatsAppLink("Plan Calendario B", "$250.000"),
                urgent: now < dates.dec10,
                startDate: dates.dec10
            },
            {
                name: "Plan Calendario B + A (Combo)",
                price: "$375.000",
                originalPrice: "$500.000", // Precio Base Combo
                available: true,
                endDate: dates.jul25,
                countdownTarget: now < dates.dec10 ? dates.dec10 : dates.jan10,
                countdownLabel: now < dates.dec10 ? "Inicio de Clases en" : "Inscripciones cierran en",
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
                ],
                popular: true,
                inscriptionDeadline: dates.jan10,
                whatsappLink: createWhatsAppLink("Plan Calendario B + A (Anual)", "$375.000"),
                urgent: now < dates.dec10,
                startDate: dates.dec10
            }
        ];
    } else if (now >= dates.jan1 && now < dates.feb1) {
        // ENERO: Se venden planes que inician el 10 de Enero

        plans = [];

        // Plan Calendario B (Solo venta hasta el 10 Ene)
        if (now < dates.jan10) {
            plans.push({
                name: "Plan Calendario B",
                price: "$250.000",
                originalPrice: "$350.000",
                available: true,
                endDate: dates.mar14,
                countdownTarget: dates.jan10,
                countdownLabel: "Cierre inscripciones:",
                features: ["525 Horas Totales", "Últimos cupos"],
                whatsappLink: createWhatsAppLink("Plan Calendario B", "$250.000"),
                urgent: true
            });
        }

        // Plan Enero Combo (Inicio 10 Ene)
        plans.push({
            name: "Plan Enero (Combo)",
            price: "$325.000",
            originalPrice: "$500.000",
            available: true,
            endDate: dates.jul25,
            countdownTarget: now < dates.jan10 ? dates.jan10 : dates.feb10,
            countdownLabel: now < dates.jan10 ? "Inicio de Clases en" : "Inscripciones cierran en",
            features: [
                "676 Horas en Vivo + 224h Grabadas",
                "Inicio Enero hasta Julio 2026",
                "Cloud Vault 1000GB Completo",
                "106+ Cuadernillos Oficiales Completo",
                "4 Simulacros Calificados",
                "Orientación Vocacional",
                "Comunidad VIP",
                "Soporte Total Docentes"
            ],
            popular: true,
            inscriptionDeadline: dates.feb10,
            priceChange: true,
            previousPrice: "$375.000",
            whatsappLink: createWhatsAppLink("Plan Enero (Anual)", "$325.000"),
            startDate: dates.jan10
        });

    } else if (now >= dates.feb1 && now < dates.mar1) {
        // FEBRERO: Se venden planes que inician el 10 de Febrero
        plans = [
            {
                name: "Plan Febrero (Combo)",
                price: "$295.000",
                originalPrice: "$500.000",
                available: true,
                endDate: dates.jul25,
                countdownTarget: now < dates.feb10 ? dates.feb10 : dates.mar10,
                countdownLabel: now < dates.feb10 ? "Inicio de Clases en" : "Inscripciones cierran en",
                features: [
                    "552 Horas en Vivo + 348h Grabadas",
                    "Inicio Febrero hasta Julio 2026",
                    "Cloud Vault 1000GB",
                    "106+ Cuadernillos Oficiales",
                    "4 Simulacros Calificados",
                    "Orientación Vocacional",
                    "Soporte Docentes 24/7"
                ],
                popular: true,
                inscriptionDeadline: dates.mar10,
                priceChange: true,
                previousPrice: "$325.000",
                whatsappLink: createWhatsAppLink("Plan Febrero (Anual)", "$295.000"),
                startDate: dates.feb10
            }
        ];
    } else if (now >= dates.mar1 && now < dates.mar14) {
        // MARZO: Última oportunidad Combo + Calendario A
        plans = [];

        // Combo Final (hasta 10 Mar)
        if (now < dates.mar10) {
            plans.push({
                name: "Plan Marzo (Combo Final)",
                price: "$295.000",
                originalPrice: "$500.000",
                available: true,
                endDate: dates.jul25,
                countdownTarget: dates.mar10,
                countdownLabel: "Cierre definitivo Combo:",
                features: ["Últimos días para B+A", "Cierre definitivo 10 Mar"],
                whatsappLink: createWhatsAppLink("Plan Marzo Combo", "$295.000"),
                urgent: true
            });
        }

        plans.push({
            name: "Plan Calendario A",
            price: "$250.000",
            originalPrice: "$350.000",
            available: true,
            endDate: dates.jul25,
            countdownTarget: dates.jul25, // Fecha examen o cierre
            countdownLabel: "Inicio preparación:",
            features: [
                "440 Horas en Vivo + 460h Grabadas",
                "Calendario A (10 Mar - 26 Jul)",
                "Cloud Vault 1000GB",
                "106+ Cuadernillos Oficiales",
                "4 Simulacros Completos"
            ],
            popular: true,
            whatsappLink: createWhatsAppLink("Plan Calendario A", "$250.000"),
            startDate: dates.mar10
        });

    } else if (now >= dates.mar14 && now < dates.jul25) {
        // SOLO CALENDARIO A
        plans = [
            {
                name: "Plan Calendario A",
                price: "$250.000",
                originalPrice: "$350.000",
                available: true,
                endDate: dates.jul25,
                countdownTarget: dates.jul25,
                countdownLabel: "Examen Calendario A en",
                features: [
                    "440 Horas en Vivo + 460h Grabadas",
                    "Preparación Completa ICFES",
                    "Cloud Vault 1000GB",
                    "106+ Cuadernillos Oficiales",
                    "Simulacros con IA",
                    "Orientación Vocacional"
                ],
                popular: true,
                whatsappLink: createWhatsAppLink("Plan Calendario A", "$250.000")
            }
        ];
    } else {
        // FINALIZADO
        plans = [
            {
                name: "Curso Finalizado",
                price: "---",
                originalPrice: "",
                available: false,
                description: "El curso 2026-1 ha finalizado. Próxima convocatoria pronto."
            }
        ];
    }

    return plans;
};

// Calcular tiempo restante hasta una fecha
export const getTimeRemaining = (targetDate) => {
    const now = new Date();
    const difference = targetDate - now;

    if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, expired: false };
};

// Formatear fecha para mostrar
export const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
};

// Obtener el siguiente hito importante
export const getNextMilestone = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const nextYear = currentYear + 1;

    // Próximo hito relevante: Inicio de clases el 10 de diciembre
    if (now < new Date(currentYear, 11, 10)) {
        return {
            date: new Date(currentYear, 11, 10),
            label: "Inicio de Clases"
        };
    }

    return null;
};
