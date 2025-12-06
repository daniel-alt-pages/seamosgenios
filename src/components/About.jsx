import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Target, Users, ChevronRight, ChevronLeft, GraduationCap, Home, Wifi, Zap } from 'lucide-react';

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
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[120px]" />

            <div className="container mx-auto px-4 relative z-10">
                {/* 100% Virtual Section - Moved to Top */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-24"
                >
                    <div className="text-center mb-12">
                        <h3 className="text-3xl md:text-4xl font-black mb-4">
                            El Poder de ser <span className="text-fire-animated">100% Virtual</span>
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Point 1 */}
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors group">
                            <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400 mb-4 group-hover:scale-110 transition-transform">
                                <GraduationCap size={24} />
                            </div>
                            <h4 className="text-lg font-bold mb-2 text-fire-animated">Acceso a los Mejores</h4>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Mentores de la U. Nacional, ICESI, UIS y U. de los Andes.
                            </p>
                        </div>

                        {/* Point 2 */}
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors group">
                            <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400 mb-4 group-hover:scale-110 transition-transform">
                                <Home size={24} />
                            </div>
                            <h4 className="text-lg font-bold mb-2 text-fire-animated">Cero Desplazamientos</h4>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Más tiempo para estudiar desde la comodidad de sus casas.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors group">
                            <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400 mb-4 group-hover:scale-110 transition-transform">
                                <Wifi size={24} />
                            </div>
                            <h4 className="text-lg font-bold mb-2 text-fire-animated">Flexibilidad Total</h4>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Clases en vivo grabadas y disponibles 24/7 en nuestra nube privada.
                            </p>
                        </div>

                        {/* Point 4 */}
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors group">
                            <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center text-yellow-400 mb-4 group-hover:scale-110 transition-transform">
                                <Zap size={24} />
                            </div>
                            <h4 className="text-lg font-bold mb-2 text-fire-animated">Disciplina Digital</h4>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Aprendizaje de autogestión y herramientas que usarán en la universidad.
                            </p>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">
                            Más que un PreICFES, <br />
                            somos una <span className="text-fire-animated">Revolución</span>
                        </h2>
                        <p className="text-lg text-gray-300 mb-10 leading-relaxed font-light">
                            Somos un movimiento de impacto social comprometido a ofrecer todas las herramientas y consejos para el éxito de sus estudiantes. Los acompañamos en todo el trayecto.
                        </p>

                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
                                    <Rocket size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-fire-animated">Misión</h3>
                                    <p className="text-gray-400 leading-relaxed">
                                        Transformar vidas brindando herramientas reales para abrir las puertas del futuro académico de cualquier estudiante.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                                    <Target size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-fire-animated">Visión</h3>
                                    <p className="text-gray-400 leading-relaxed">
                                        Democratizar la educación en Colombia y ser el programa virtual líder, comprometido con la calidad, el impacto social y la oportunidad para todos.
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
                                        <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-orange-900/10 z-0" />

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
