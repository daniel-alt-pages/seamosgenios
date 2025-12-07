import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, ShoppingCart } from 'lucide-react';
import { getTimeRemaining } from '../utils/pricingLogic';

const CourseTimeline = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [countdowns, setCountdowns] = useState({});

    const currentYear = currentDate.getFullYear();
    const nextYear = currentYear + 1;

    // Fechas clave para el Timeline de Ventas y Curso
    const timelineData = [
        {
            title: "Fase 1: Lanzamiento",
            dateLabel: "Hasta 10 Dic",
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
                const now = new Date();
                const target = now < item.unlockDate ? item.unlockDate : item.targetDate;
                newCountdowns[index] = getTimeRemaining(target);
            });
            setCountdowns(newCountdowns);
        }, 1000);

        return () => clearInterval(countdownInterval);
    }, [timelineData]);

    return (
        <section className="py-24 relative overflow-hidden">
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
                    <h2 className="text-3xl md:text-5xl font-black mb-6 text-white leading-tight">
                        Evolución de Precios <br />
                        <span className="text-fire-animated">Calendarios A y B</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        El valor de la inversión aumenta a medida que se acerca la fecha de inicio. <br />
                        <span className="text-green-400 font-bold">¡Asegura tu cupo hoy y congela el precio más bajo!</span>
                    </p>
                </motion.div>

                <div className="relative ml-8 md:mx-auto max-w-4xl pl-16 md:pl-0">
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
                                {/* Stylized Dot and Connector */}

                                {/* Vertical Line Segment (Connecting to next) */}
                                {index !== timelineData.length - 1 && (
                                    <div className={`absolute -left-[56px] top-6 w-[2px] h-[calc(100%+3rem)] z-0 ${isUnlocked ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'bg-white/10'
                                        }`} />
                                )}

                                {/* Horizontal Branch Connector */}
                                <div className={`absolute -left-[56px] top-[34px] w-16 h-[2px] hidden md:block z-0 ${isUnlocked ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'bg-white/10'}`} />

                                {/* Node / Dot - WITH PULSE-SCALE ANIMATION */}
                                <div className={`absolute -left-[62px] top-6 w-3 h-3 rounded-full z-10 box-content border-4 border-black ${isUnlocked ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,1)] animate-pulse-scale' : 'bg-gray-800'
                                    }`} />

                                {isUnlocked && !isPast && (
                                    <div className="absolute -left-[62px] top-6 w-3 h-3 rounded-full bg-green-500 animate-ping opacity-50 z-0" />
                                )}

                                {/* Active Card with Revolution Style Rotating Border */}
                                <div className={`relative rounded-3xl overflow-hidden transition-all duration-300 group ${isUnlocked
                                    ? 'p-[3px] shadow-2xl' /* Padding creates the border width */
                                    : 'p-[1px] bg-transparent border border-white/5 opacity-60'
                                    }`}>

                                    {/* Rotating Gradient Background (Only for unlocked) */}
                                    {isUnlocked && (
                                        <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,#ef4444,#000000,#ffffff,#ef4444)] animate-[spin_4s_linear_infinite]" />
                                    )}

                                    {/* Main Content Container */}
                                    <div className={`relative h-full w-full rounded-[21px] overflow-hidden ${isUnlocked ? 'bg-[#0a0a0a]' : 'bg-transparent'} p-6 md:p-8`}>
                                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 xl:gap-6">

                                            {/* Info Principal */}
                                            <div className="flex-grow text-center xl:text-left">
                                                <div className="flex flex-wrap items-center justify-center xl:justify-start gap-2 mb-4">
                                                    <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${isUnlocked
                                                        ? 'bg-red-500/5 border-red-500/30 text-red-500 shadow-[0_0_20px_rgba(220,38,38,0.2)]'
                                                        : 'bg-white/5 border-white/10 text-gray-500'
                                                        }`}>
                                                        {isUnlocked ? (
                                                            <span className="flex items-center gap-2">
                                                                <span className="relative flex h-2 w-2">
                                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                                                </span>
                                                                PREVENTA ACTIVA
                                                            </span>
                                                        ) : 'PRÓXIMAMENTE'}
                                                    </span>
                                                    <span className="text-sm text-gray-500 font-medium border-l border-white/10 pl-4 tracking-wide">{item.dateLabel}</span>
                                                </div>

                                                <h3 className="text-3xl md:text-5xl font-black text-white mb-3 tracking-tighter leading-tight">
                                                    {item.title}
                                                </h3>
                                                <p className="text-gray-400 text-base mb-8 max-w-xl font-light leading-relaxed mx-auto xl:mx-0">{item.description}</p>

                                                {/* Precios y Ahorro Futurista */}
                                                {item.price && (
                                                    <div className="relative group">
                                                        <div className="relative flex flex-wrap justify-center xl:justify-start items-center gap-6 bg-white/5 backdrop-blur-md w-fit px-6 py-4 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 mx-auto xl:mx-0">

                                                            {/* Precio Base */}
                                                            <div>
                                                                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1">Precio Base</div>
                                                                <div className="text-base text-gray-500 font-sans line-through decoration-gray-600 decoration-1">{item.basePrice}</div>
                                                            </div>

                                                            {/* Separator - Vertical Line */}
                                                            <div className="h-8 w-px bg-white/10"></div>

                                                            {/* Precio Oferta */}
                                                            {/* Precio Oferta */}
                                                            <div>
                                                                {isUnlocked ? (
                                                                    <>
                                                                        <div className="text-[10px] text-red-500 uppercase tracking-widest font-bold mb-1 flex items-center gap-1">
                                                                            Oferta
                                                                        </div>
                                                                        <div className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                                                                            {item.price}
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1 flex items-center gap-1">
                                                                            Bloqueado
                                                                        </div>
                                                                        <div className="relative group cursor-help">
                                                                            <div className="text-2xl md:text-3xl font-bold tracking-tight text-white/30 blur-[6px] group-hover:blur-[3px] transition-all duration-500 select-none">
                                                                                {item.price}
                                                                            </div>
                                                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                                                                <span className="text-[8px] font-bold text-white bg-red-600/80 px-1.5 py-0.5 rounded border border-red-500/50 backdrop-blur-md shadow-lg transform -translate-y-1 group-hover:translate-y-0 transition-transform">
                                                                                    SPOILER
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>

                                                            {/* Ahorro Badge */}
                                                            {isUnlocked && (
                                                                <div className="ml-4 px-4 py-2 bg-green-900/10 rounded-lg border border-green-500/20 text-green-500 flex flex-col items-center">
                                                                    <span className="text-[10px] uppercase font-bold tracking-widest mb-0.5">Ahorras</span>
                                                                    <span className="font-sans font-bold text-base tracking-tight">{item.savings}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action / Countdown */}
                                            <div className="flex flex-col items-center justify-center min-w-[200px] text-center mt-0 xl:mt-0 w-full xl:w-auto">
                                                {!isPast && (
                                                    <div className="mb-4">
                                                        <div className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-2">
                                                            {isUnlocked ? "TIEMPO RESTANTE" : "SE DESBLOQUEA EN"}
                                                        </div>
                                                        <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg border border-white/10 backdrop-blur-sm">
                                                            <div className="text-center min-w-[32px]">
                                                                <span className="block text-lg font-bold text-white leading-none">{countdown.days}</span>
                                                                <span className="text-[8px] text-gray-500 uppercase font-semibold">Días</span>
                                                            </div>
                                                            <span className="text-gray-600 font-bold mb-2">:</span>
                                                            <div className="text-center min-w-[32px]">
                                                                <span className="block text-lg font-bold text-white leading-none">{String(countdown.hours).padStart(2, '0')}</span>
                                                                <span className="text-[8px] text-gray-500 uppercase font-semibold">Hrs</span>
                                                            </div>
                                                            <span className="text-gray-600 font-bold mb-2">:</span>
                                                            <div className="text-center min-w-[32px]">
                                                                <span className="block text-lg font-bold text-white leading-none">{String(countdown.minutes).padStart(2, '0')}</span>
                                                                <span className="text-[8px] text-gray-500 uppercase font-semibold">Min</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {isUnlocked && !isPast && (
                                                    <a
                                                        href={`https://wa.me/573008871908?text=${encodeURIComponent(`Hola, quiero aprovechar la ${item.title} ($${item.price}) del PreICFES antes de que suba de precio.`)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-full md:w-auto px-6 py-3 bg-white text-black font-black uppercase tracking-wide rounded-xl hover:bg-gray-200 transition-all transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 group"
                                                    >
                                                        <ShoppingCart size={18} className="group-hover:-rotate-12 transition-transform" />
                                                        Comprar Ahora
                                                    </a>
                                                )}

                                                {!isUnlocked && (
                                                    <div className="flex items-center gap-2 text-gray-500 text-sm justify-center">
                                                        <Lock size={14} />
                                                        <span>Espera al día 1</span>
                                                    </div>
                                                )}
                                            </div>
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
