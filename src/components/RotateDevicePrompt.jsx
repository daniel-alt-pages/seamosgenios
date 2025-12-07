import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone } from 'lucide-react';

const RotateDevicePrompt = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const checkOrientation = () => {
            // Mostrar solo si es portrait y el ancho es menor a 1024px (tablets/móviles para abajo)
            // y la altura es mayor que el ancho.
            const isPortrait = window.innerHeight > window.innerWidth;
            const isMobileOrTablet = window.innerWidth < 1024;

            setIsVisible(isPortrait && isMobileOrTablet);
        };

        // Chequear al montar y al cambiar tamaño
        checkOrientation();
        window.addEventListener('resize', checkOrientation);

        return () => window.removeEventListener('resize', checkOrientation);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center text-center p-6 touch-none"
                // Permitir interacción nula para obligar (o añadir botón de cerrar si se desea ser menos intrusivo)
                >
                    <motion.div
                        animate={{ rotate: [0, 90, 0] }}
                        transition={{
                            repeat: Infinity,
                            duration: 3,
                            ease: "easeInOut",
                            repeatDelay: 1.5
                        }}
                        className="relative mb-12"
                    >
                        {/* Realistic Device Frame */}
                        <div className="w-[100px] h-[160px] border-[6px] border-[#333] rounded-[2rem] bg-[#0a0a0a] shadow-2xl flex flex-col items-center justify-between p-2 relative overflow-hidden">

                            {/* Dynamic Glare Effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-20" />

                            {/* Top Speaker/Notch Area */}
                            <div className="w-full flex justify-center py-1 z-10">
                                <div className="w-12 h-1.5 bg-[#222] rounded-full" />
                            </div>

                            {/* Screen Content */}
                            <div className="w-full h-full bg-[#111] rounded-[1.2rem] flex items-center justify-center relative overflow-hidden border border-white/5">
                                {/* Abstract UI Representation */}
                                <div className="space-y-2 w-3/4 opacity-50">
                                    <div className="w-full h-2 bg-gray-700 rounded-full" />
                                    <div className="w-2/3 h-2 bg-gray-800 rounded-full" />
                                    <div className="w-full h-16 bg-gradient-to-br from-red-900/20 to-transparent rounded-lg mt-4 border border-red-500/20" />
                                </div>

                                {/* Logo/Icon in center */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-8 h-8 bg-red-600 rounded-full blur-md opacity-40 animate-pulse" />
                                </div>
                            </div>

                            {/* Bottom Area (Home bar indication) */}
                            <div className="w-full flex justify-center py-2 z-10">
                                <div className="w-16 h-1 bg-[#222] rounded-full" />
                            </div>
                        </div>
                    </motion.div>

                    <h2 className="text-3xl font-black text-white mb-4 tracking-tight">
                        Mejor Experiencia <br />
                        <span className="text-gradient">Horizontal</span>
                    </h2>

                    <p className="text-gray-400 max-w-xs mx-auto text-lg leading-relaxed">
                        Nuestra plataforma de alto rendimiento está diseñada para verse mejor con tu dispositivo girado.
                    </p>

                    <div className="mt-12 flex items-center gap-2 text-sm text-gray-500 font-medium uppercase tracking-widest animate-pulse">
                        <Smartphone size={16} className="rotate-90" />
                        Gira tu dispositivo
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default RotateDevicePrompt;
