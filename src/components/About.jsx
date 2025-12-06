import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Target, Users, ChevronRight, ChevronLeft } from 'lucide-react';

const slides = [
    {
        src: "/images/CARTA%20DE%20RECOMENDACION%202026-1.svg",
        alt: "Carta de Recomendación 2026-1",
        caption: "Reconocimiento Oficial"
    },
    {
        src: "/images/podio%20de%20honor.svg",
        alt: "Podio de Honor",
        caption: "Nuestros Mejores Estudiantes"
    }
];

const About = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <section className="py-24 bg-black relative overflow-hidden" id="nosotros">
            {/* Shapes */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px]" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-black mb-8 text-white">
                            Más que un PreICFES, <br />
                            somos una <span className="text-gradient from-blue-400 to-purple-500">Revolución</span>
                        </h2>

                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                                    <Rocket size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Misión Sin Límites</h3>
                                    <p className="text-gray-400 leading-relaxed">
                                        Nacimos para desafiar el sistema tradicional. Creemos que cada estudiante tiene un genio interior esperando ser desbloqueado con la metodología correcta.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                                    <Target size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Resultados Comprobados</h3>
                                    <p className="text-gray-400 leading-relaxed">
                                        Nuestra metodología híbrida (En vivo + Plataforma IA) ha llevado a cientos de estudiantes a las mejores universidades del país.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Comunidad de Genios</h3>
                                    <p className="text-gray-400 leading-relaxed">
                                        No estudias solo. Te unes a una comunidad vibrante de soñadores y hacedores que se impulsan mutuamente hacia el éxito.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Visual Content - Vertical Slider with Clean Rotating Border */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative flex justify-center"
                    >
                        {/* 
                            Truco del Borde Giratorio Limpio:
                            El padre tiene padding (p-[3px]).
                            El hijo absoluto (gradiente) gira detrás.
                            El hijo relativo (contenido) tapa el centro.
                            overflow-hidden en el padre corta las esquinas.
                        */}
                        <div className="relative w-full max-w-[450px] aspect-[557/797] rounded-3xl overflow-hidden bg-gray-900 p-[3px] shadow-2xl">

                            {/* Rotating Gradient Background */}
                            <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,#ef4444,#000000,#ffffff,#ef4444)] animate-[spin_4s_linear_infinite]" />

                            {/* Main Card Content (Z-10 to sit on top of gradient) */}
                            <div className="relative h-full w-full rounded-[21px] overflow-hidden bg-black z-10 flex flex-col">

                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentSlide}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="absolute inset-0 p-1 flex items-center justify-center"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10 z-0" />

                                        <img
                                            src={slides[currentSlide].src}
                                            alt={slides[currentSlide].alt}
                                            className="relative z-10 w-full h-full object-contain drop-shadow-md"
                                        />
                                    </motion.div>
                                </AnimatePresence>

                                {/* Controls */}
                                <button
                                    onClick={prevSlide}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20 backdrop-blur-sm z-20 border border-white/5"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20 backdrop-blur-sm z-20 border border-white/5"
                                >
                                    <ChevronRight size={20} />
                                </button>

                                {/* Indicators */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                                    {slides.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentSlide(idx)}
                                            className={`w-2 h-2 rounded-full transition-all duration-300 ${currentSlide === idx
                                                ? 'bg-red-500 w-6 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                                                : 'bg-white/30 hover:bg-white/50'
                                                }`}
                                        />
                                    ))}
                                </div>

                                {/* Bottom overlay for text readability if needed */}
                                <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-10" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;
