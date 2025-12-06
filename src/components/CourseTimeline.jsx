import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Activity, TrendingUp, Calendar, CheckCircle2, Lock, Timer, ShoppingCart } from 'lucide-react';
import { getTimeRemaining, formatDate } from '../utils/pricingLogic';

const CourseTimeline = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [countdowns, setCountdowns] = useState({});

    const currentYear = currentDate.getFullYear();
    const nextYear = currentYear + 1;

    // Fechas clave para el Timeline de Ventas y Curso
    const timelineData = [
        {
            title: "Fase 1: Lanzamiento",
            dateLabel: "Preventa Activa",
            targetDate: new Date(currentYear, 11, 10), // 10 Dic
            status: "En Curso",
            description: "Venta habilitada para inicio 10 Dic.",
            unlockDate: new Date(currentYear, 11, 1), // 1 Dic
            price: "$375.000",
            basePrice: "$500.000",
            savings: "$125.000 (25% OFF)"
        },
        {
            title: "Fase 2: Enero",
            dateLabel: "Abre: 1 de Enero",
            targetDate: new Date(nextYear, 0, 10), // 10 Ene
            status: "Próximamente",
            description: "Inicio de clases grupo Enero.",
            unlockDate: new Date(nextYear, 0, 1), // 1 Ene
            price: "$325.000",
            basePrice: "$500.000",
            savings: "$175.000 (35% OFF)"
        },
        {
            title: "Fase 3: Febrero",
            dateLabel: "Abre: 1 de Febrero",
            targetDate: new Date(nextYear, 1, 10), // 10 Feb
            status: "Próximamente",
            description: "Inicio de clases grupo Febrero.",
            unlockDate: new Date(nextYear, 1, 1), // 1 Feb
            price: "$295.000",
            basePrice: "$500.000",
            savings: "$205.000 (41% OFF)"
        },
        {
            title: "Fase 4: Cierre Combo",
            dateLabel: "Cierre: 10 de Marzo",
            targetDate: new Date(nextYear, 2, 10), // 10 Mar
            status: "Próximamente",
            description: "Última oportunidad para Combo B+A.",
            unlockDate: new Date(nextYear, 2, 1), // 1 Mar
            price: "Última Oportunidad",
            basePrice: "$500.000",
            savings: "Finaliza Venta Combos"
        }
    ];

    useEffect(() => {
        const dateInterval = setInterval(() => {
            setCurrentDate(new Date());
        }, 60000);

        return () => clearInterval(dateInterval);
    }, []);

    useEffect(() => {
        const countdownInterval = setInterval(() => {
            const newCountdowns = {};
            timelineData.forEach((item, index) => {
                // Cuenta regresiva para la fecha de "Apertura" (unlockDate) si no ha llegado
                // O cuenta regresiva para el "Inicio/Objetivo" (targetDate) si ya abrió
                const now = new Date();
                const target = now < item.unlockDate ? item.unlockDate : item.targetDate;
                newCountdowns[index] = getTimeRemaining(target);
            });
            setCountdowns(newCountdowns);
        }, 1000);

        return () => clearInterval(countdownInterval);
    }, []);

    return (
        <section className="py-24 bg-black relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-grid-pattern opacity-30" />
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px]" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-black mb-4 text-white">
                        Evolución del <span className="text-fire-animated">Ciclo de Ventas</span>
                    </h2>
                    <p className="text-gray-400">
                        Aprovecha los descuentos por inscripción anticipada. El precio base es <span className="text-white font-bold line-through">$500.000</span>.
                    </p>
                </motion.div>

                <div className="relative border-l border-white/10 ml-4 md:ml-auto md:mx-auto max-w-4xl pl-8 md:pl-0">
                    {timelineData.map((item, index) => {
                        const isUnlocked = currentDate >= item.unlockDate;
                        const isPast = currentDate > item.targetDate;
                        const countdown = countdowns[index] || { days: 0, hours: 0, minutes: 0, seconds: 0 };

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="mb-12 relative"
                            >
                                {/* Dot on Timeline */}
                                <div className={`absolute -left-[41px] top-6 w-5 h-5 rounded-full border-4 border-black ${isPast ? 'bg-gray-600' : isUnlocked ? 'bg-red-500 animate-pulse' : 'bg-gray-800'
                                    }`} />

                                <div className={`p-6 rounded-2xl border transition-all duration-300 ${isUnlocked
                                    ? 'bg-gradient-to-r from-white/5 to-transparent border-red-500/30 shadow-lg shadow-red-900/10'
                                    : 'bg-transparent border-white/5 opacity-60'
                                    }`}>
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

                                        {/* Info Principal */}
                                        <div className="flex-grow">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md ${isUnlocked ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-gray-500'
                                                    }`}>
                                                    {isUnlocked ? 'Disponible' : 'Bloqueado'}
                                                </span>
                                                <span className="text-sm text-gray-400 font-medium">{item.dateLabel}</span>
                                            </div>

                                            <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                                            <p className="text-gray-400 text-sm mb-4">{item.description}</p>

                                            {/* Precios y Ahorro */}
                                            {item.price && (
                                                <div className="flex items-center gap-4 bg-black/30 w-fit px-4 py-2 rounded-lg border border-white/5">
                                                    <div>
                                                        <div className="text-[10px] text-gray-500 uppercase">Precio Base</div>
                                                        <div className="text-sm text-gray-400 line-through decoration-red-500">{item.basePrice}</div>
                                                    </div>
                                                    <div className="h-8 w-px bg-white/10"></div>
                                                    <div>
                                                        <div className="text-[10px] text-gray-500 uppercase">Oferta</div>
                                                        <div className={`text-lg font-black ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>{item.price}</div>
                                                    </div>
                                                    {isUnlocked && (
                                                        <div className="hidden sm:block ml-2 px-2 py-1 bg-green-500/10 rounded text-xs text-green-400 font-bold border border-green-500/20">
                                                            Ahorras {item.savings}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Action / Countdown */}
                                        <div className="md:text-right min-w-[200px]">
                                            {!isPast && (
                                                <div className="mb-3">
                                                    <div className="text-xs text-gray-500 uppercase mb-1">
                                                        {isUnlocked ? "Inicia en:" : "Se desbloquea en:"}
                                                    </div>
                                                    <div className="font-mono text-xl text-white font-bold tracking-widest">
                                                        {countdown.days}d {String(countdown.hours).padStart(2, '0')}h {String(countdown.minutes).padStart(2, '0')}m
                                                    </div>
                                                </div>
                                            )}

                                            {isUnlocked && !isPast && (
                                                <button className="w-full md:w-auto px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                                                    <ShoppingCart size={16} />
                                                    Comprar Plan
                                                </button>
                                            )}

                                            {!isUnlocked && (
                                                <div className="flex items-center gap-2 text-gray-500 text-sm justify-end">
                                                    <Lock size={14} />
                                                    <span>Espera al día 1</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default CourseTimeline;
