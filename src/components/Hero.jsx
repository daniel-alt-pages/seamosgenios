import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Sparkles, Calendar } from 'lucide-react';

// Componente TimeUnit fuera del render
const TimeUnit = ({ value, label }) => (
    <div className="flex flex-col items-center gap-2">
        <div className="bg-black/40 border border-white/10 backdrop-blur-md rounded-lg min-w-[60px] md:min-w-[80px] h-[60px] md:h-[80px] flex items-center justify-center">
            <span className="text-3xl md:text-5xl font-black text-white tabular-nums leading-none">
                {value < 10 ? `0${value}` : value}
            </span>
        </div>
        <span className="text-[9px] md:text-xs text-gray-500 uppercase tracking-wider font-bold">{label}</span>
    </div>
);

// Componente de Contador Regresivo
const ExamCountdown = ({ targetDate, examName, calendarType }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const difference = targetDate.getTime() - now;

            if (difference > 0) {
                return {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            }
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        };

        // Inicializar inmediatamente
        const updateTime = () => {
            setTimeLeft(calculateTimeLeft());
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    return (
        <div className={`glass-strong rounded-2xl p-6 border ${calendarType === 'B' ? 'border-red-500/30' : 'border-white/20'}`}>
            <div className="flex items-center justify-center gap-2 mb-4">
                <Calendar className={`w-4 h-4 ${calendarType === 'B' ? 'text-red-500' : 'text-white'}`} />
                <h3 className={`text-xs md:text-sm font-bold uppercase tracking-wider ${calendarType === 'B' ? 'text-red-400' : 'text-white'}`}>
                    {examName}
                </h3>
            </div>
            <div className="flex gap-2 md:gap-4 justify-center">
                <TimeUnit value={timeLeft.days} label="Días" />
                <TimeUnit value={timeLeft.hours} label="Hrs" />
                <TimeUnit value={timeLeft.minutes} label="Min" />
                <TimeUnit value={timeLeft.seconds} label="Seg" />
            </div>
        </div>
    );
};

const Hero = () => {
    // Fechas de los exámenes ICFES 2026
    const examCalendarB = new Date('2026-03-15T07:00:00'); // 15 de marzo 2026, 7:00 AM
    const examCalendarA = new Date('2026-07-26T07:00:00'); // 26 de julio 2026, 7:00 AM

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-32 overflow-hidden">
            {/* Advanced Background Effects */}
            <div className="absolute inset-0 gradient-mesh z-0" />
            <div className="absolute inset-0 bg-grid-pattern-fade z-0" />

            {/* Floating Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-[120px] animate-float" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-600/15 rounded-full blur-[100px] animate-float" style={{ animationDelay: '1s' }} />

            <div className="container mx-auto px-4 z-10 text-center relative">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col items-center"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full glass-strong text-sm font-semibold text-red-400 mb-6 md:mb-8 hover-glow group cursor-pointer max-w-[95vw] mx-auto z-20"
                    >
                        <Zap size={16} className="text-red-500 fill-red-500 group-hover:animate-pulse shrink-0" />
                        <span className="tracking-wider uppercase text-[10px] md:text-xs font-bold truncate">Sistema de Alto Rendimiento</span>
                        <Sparkles size={14} className="text-orange-400 opacity-70 shrink-0" />
                    </motion.div>

                    {/* Main Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tight leading-[0.95] text-white"
                    >
                        DESATA TU <br />
                        <span className="text-fire-animated neon-text-subtle inline-block mt-2">POTENCIAL</span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto font-normal leading-relaxed"
                    >
                        La fusión definitiva entre <span className="text-white font-semibold">Tecnología</span> y <span className="text-white font-semibold">Neurociencia</span>.
                        <br className="hidden md:block" />
                        Prepárate para el ICFES con el sistema que está <span className="text-fire-animated font-semibold">redefiniendo la educación</span>.
                    </motion.p>

                    {/* FASE 1: Strategic Start Date Banner */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.55, duration: 0.5 }}
                        className="mb-10 px-6 py-3 rounded-xl bg-red-900/30 border border-red-500/40 backdrop-blur-md inline-flex items-center gap-3 shadow-lg shadow-red-900/20 animate-pulse-slow"
                    >
                        <Calendar className="text-red-400 w-5 h-5" />
                        <span className="text-lg md:text-xl font-black text-white tracking-wide">
                            INICIO DE CLASES: <span className="text-fire-animated">10 DE DICIEMBRE</span>
                        </span>
                    </motion.div>

                    {/* Exam Countdowns */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto mb-12"
                    >
                        <ExamCountdown
                            targetDate={examCalendarB}
                            examName="Examen Calendario B - 15 Mar 2026"
                            calendarType="B"
                        />
                        <ExamCountdown
                            targetDate={examCalendarA}
                            examName="Examen Calendario A - 26 Jul 2026"
                            calendarType="A"
                        />
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center"
                    >
                        <a
                            href="https://wa.me/573008871908?text=Hola,%20quiero%20información%20sobre%20los%20planes%20PreICFES%202026"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group px-10 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-2xl shadow-red-900/40 hover-lift hover-glow relative overflow-hidden"
                        >
                            <span className="relative z-10">INICIAR MISIÓN</span>
                            <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </a>

                        <a
                            href="#precios"
                            className="px-10 py-4 glass-strong hover:bg-white/10 text-white rounded-2xl font-bold text-lg border border-white/10 hover:border-white/20 transition-all duration-300 hover-lift"
                        >
                            EXPLORAR PLANES
                        </a>
                    </motion.div>

                    {/* Stats or Trust Indicators */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.1, duration: 0.8 }}
                        className="mt-24 flex flex-wrap gap-8 justify-center items-center text-sm"
                    >
                        <div className="flex items-center gap-2 text-gray-400">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span><span className="text-white font-semibold">525+</span> Horas de Entrenamiento</span>
                        </div>
                        <div className="hidden sm:block w-px h-4 bg-white/10" />
                        <div className="flex items-center gap-2 text-gray-400">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                            <span><span className="text-white font-semibold">1000GB</span> Cloud Vault</span>
                        </div>
                        <div className="hidden sm:block w-px h-4 bg-white/10" />
                        <div className="flex items-center gap-2 text-gray-400">
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                            <span><span className="text-white font-semibold">106+</span> Cuadernillos Oficiales</span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
