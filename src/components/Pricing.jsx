import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Lock, Clock, Star, Zap, Crown, Timer, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { getPricingInfo, getTimeRemaining, formatDate } from '../utils/pricingLogic';

// Componente para el contador regresivo individual de cada plan
const PlanCountdown = ({ targetDate, label }) => {
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        if (!targetDate) return;

        const updateCountdown = () => {
            const timeLeft = getTimeRemaining(targetDate);
            setCountdown(timeLeft);
        };

        updateCountdown();
        const countdownInterval = setInterval(updateCountdown, 1000);

        return () => clearInterval(countdownInterval);
    }, [targetDate]);

    if (countdown.expired) return null;

    return (
        <div className="mb-6 p-4 glass-strong rounded-2xl border border-red-500/20">
            <div className="text-xs text-red-400 font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                <Timer className="w-4 h-4 animate-pulse" />
                {label}
            </div>
            <div className="flex gap-3 justify-center">
                <div className="text-center">
                    <div className="text-2xl font-black text-gradient">{countdown.days}</div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider">Días</div>
                </div>
                <div className="text-xl text-gray-600 self-center">:</div>
                <div className="text-center">
                    <div className="text-2xl font-black text-gradient">{String(countdown.hours).padStart(2, '0')}</div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider">Hrs</div>
                </div>
                <div className="text-xl text-gray-600 self-center">:</div>
                <div className="text-center">
                    <div className="text-2xl font-black text-gradient">{String(countdown.minutes).padStart(2, '0')}</div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider">Min</div>
                </div>
                <div className="text-xl text-gray-600 self-center">:</div>
                <div className="text-center">
                    <div className="text-2xl font-black text-white">{String(countdown.seconds).padStart(2, '0')}</div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider">Seg</div>
                </div>
            </div>
        </div>
    );
};

const Pricing = () => {
    const [plans, setPlans] = useState([]);
    const [loadingPlan, setLoadingPlan] = useState(null); // Estado para la animación de carga

    useEffect(() => {
        const updatePlans = () => {
            setPlans(getPricingInfo());
        };
        updatePlans();
        const plansInterval = setInterval(updatePlans, 60000);
        return () => clearInterval(plansInterval);
    }, []);

    const getIconForPlan = (index) => {
        const icons = [Star, Zap, Crown];
        return icons[index % icons.length];
    };

    const handleBuyClick = (e, link, index) => {
        e.preventDefault();
        setLoadingPlan(index);

        // Simular proceso de "Iniciando Chat Seguro..."
        setTimeout(() => {
            window.open(link, '_blank');
            setLoadingPlan(null);
        }, 1200);
    };

    return (
        <section className="py-32 relative overflow-hidden" id="precios">
            <div className="absolute inset-0 bg-grid-pattern opacity-30" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-gradient-to-r from-red-600/10 via-orange-600/10 to-red-600/10 rounded-full blur-[150px]" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 text-sm font-semibold text-red-400">
                        <Star size={16} className="fill-red-400" />
                        <span className="uppercase tracking-wider">Inversión en tu Futuro</span>
                    </div>

                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-center mb-6 text-white flex flex-wrap items-center justify-center gap-2 md:gap-4">
                        Elige tu <span className="text-fire-animated">Camino</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        Planes diseñados para adaptarse a tus necesidades y objetivos académicos
                    </p>
                </motion.div>

                <div className={`grid gap-5 md:gap-8 max-w-7xl mx-auto ${plans.length === 1 ? 'md:grid-cols-1 max-w-2xl' : plans.length === 2 ? 'md:grid-cols-2 max-w-5xl' : 'md:grid-cols-3'}`}>
                    {plans.map((plan, index) => {
                        const IconComponent = getIconForPlan(index);
                        const isLoading = loadingPlan === index;

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15, duration: 0.6 }}
                                className={`relative group ${plan.popular ? 'md:scale-105 z-10' : ''}`}
                            >
                                {/* Popular Badge */}
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                                        <div className="px-6 py-2 bg-gradient-to-r from-red-600 to-orange-600 rounded-full text-xs font-black uppercase tracking-wider shadow-2xl shadow-red-900/50 flex items-center gap-2">
                                            <Zap size={14} className="fill-white" />
                                            MÁS POPULAR
                                        </div>
                                    </div>
                                )}

                                {/* Urgent Badge */}
                                {plan.urgent && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                                        <div className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 rounded-full text-xs font-black uppercase tracking-wider shadow-2xl shadow-orange-900/50 flex items-center gap-2 animate-pulse-glow">
                                            <Clock size={14} className="fill-white" />
                                            ÚLTIMOS DÍAS
                                        </div>
                                    </div>
                                )}

                                <div className={`relative h-full rounded-3xl overflow-hidden glass-card transition-all duration-500 ${plan.popular
                                    ? 'neon-border hover-lift'
                                    : 'border border-white/5 hover:border-white/10 hover-lift'
                                    } bg-gradient-to-br ${plan.popular ? 'from-red-900/50 to-orange-900/50' : 'from-gray-800/50 to-gray-900/50'} p-5 md:p-8`}>

                                    {/* Not Available Overlay */}
                                    {!plan.available && (
                                        <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-10 flex flex-col items-center justify-center text-center p-8 rounded-3xl">
                                            {plan.expired ? (
                                                <>
                                                    <Clock className="w-16 h-16 text-orange-500 mb-6 animate-pulse-glow" />
                                                    <h3 className="text-3xl font-black mb-3 text-white">{plan.name}</h3>
                                                    <div className="px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full mb-4">
                                                        <p className="text-orange-400 text-sm font-bold uppercase tracking-wider">
                                                            Inscripciones Cerradas
                                                        </p>
                                                    </div>
                                                    <p className="text-gray-400 text-sm">
                                                        {plan.expiredMessage}
                                                    </p>
                                                </>
                                            ) : (
                                                <>
                                                    <Lock className="w-16 h-16 text-red-500 mb-6 animate-pulse-glow" />
                                                    <h3 className="text-3xl font-black mb-3 text-white">{plan.name}</h3>
                                                    <p className="text-gray-400 text-sm mb-4">
                                                        {plan.description}
                                                    </p>
                                                    {plan.availableDate && (
                                                        <div className="mt-4 px-4 py-2 glass-strong rounded-full text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                                                            <CalendarIcon size={14} />
                                                            {formatDate(plan.availableDate)}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {/* Icon */}
                                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl glass-strong flex items-center justify-center mb-4 md:mb-6 ${plan.popular ? 'neon-box' : ''
                                        }`}>
                                        <IconComponent className={`w-7 h-7 ${plan.popular ? 'text-red-400' : 'text-gray-400'
                                            }`} />
                                    </div>

                                    {/* Plan Name */}
                                    <h3 className="text-xl md:text-3xl font-black mb-2 text-white">{plan.name}</h3>

                                    {/* Start Date Highlight */}
                                    {plan.startDate && (
                                        <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 w-fit">
                                            <CalendarIcon size={14} className="text-red-400" />
                                            <span className="text-sm font-bold text-white tracking-wide">
                                                Inicio: <span className="text-red-400">10 Diciembre</span>
                                            </span>
                                        </div>
                                    )}

                                    {/* End Date */}
                                    {plan.endDate && (
                                        <div className="mb-4 text-sm text-gray-400 flex items-center gap-2">
                                            <CalendarIcon size={14} className="text-red-400" />
                                            Hasta {formatDate(plan.endDate)}
                                        </div>
                                    )}

                                    {/* Individual Countdown */}
                                    {plan.countdownTarget && plan.countdownLabel && (
                                        <PlanCountdown
                                            targetDate={plan.countdownTarget}
                                            label={plan.countdownLabel}
                                        />
                                    )}

                                    {/* Pricing */}
                                    <div className="flex flex-wrap items-end gap-x-3 gap-y-1 mb-6 md:mb-8">
                                        <span className={`text-3xl md:text-5xl font-black ${plan.popular ? 'text-gradient' : 'text-white'}`}>
                                            {plan.price}
                                        </span>
                                        {plan.originalPrice && (
                                            <span className="text-gray-500 line-through text-base md:text-lg mb-1.5 md:mb-2">
                                                {plan.originalPrice}
                                            </span>
                                        )}
                                    </div>

                                    {/* Features */}
                                    {plan.features && (
                                        <ul className="space-y-4 mb-8 flex-grow">
                                            {plan.features.map((feature, i) => (
                                                <li key={i} className="flex items-start gap-3 text-gray-300">
                                                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${plan.popular
                                                        ? 'bg-red-500/20 border border-red-500/50'
                                                        : 'bg-white/5 border border-white/10'
                                                        }`}>
                                                        <Check className={`w-3 h-3 ${plan.popular ? 'text-red-400' : 'text-gray-400'
                                                            }`} />
                                                    </div>
                                                    <span className="text-sm leading-relaxed">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {/* CTA Button with Animation */}
                                    {plan.available && plan.whatsappLink && (
                                        <motion.a
                                            href={plan.whatsappLink}
                                            onClick={(e) => handleBuyClick(e, plan.whatsappLink, index)}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer relative overflow-hidden ${plan.popular
                                                ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-2xl shadow-red-900/40 hover-glow'
                                                : 'glass-strong hover:bg-white/10 text-white border border-white/10 hover:border-white/20'
                                                }`}
                                        >
                                            <AnimatePresence mode='wait'>
                                                {isLoading ? (
                                                    <motion.div
                                                        key="loading"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                        <span>Iniciando...</span>
                                                    </motion.div>
                                                ) : (
                                                    <motion.div
                                                        key="content"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                                        </svg>
                                                        Inscribirme Ahora
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.a>
                                    )}

                                    {/* Shimmer Effect */}
                                    {plan.popular && (
                                        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="mt-16 text-center"
                >
                    <div className="inline-flex items-center gap-3 px-6 py-3 glass-strong rounded-full text-sm text-gray-400">
                        <Check className="w-5 h-5 text-green-400" />
                        <span>Garantía de satisfacción de <span className="text-white font-semibold">30 días</span></span>
                    </div>
                </motion.div>
            </div>
        </section >
    );
};

export default Pricing;
