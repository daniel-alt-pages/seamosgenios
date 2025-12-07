import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, ArrowRight } from 'lucide-react';

const RotateDevicePrompt = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        const checkOrientation = () => {
            if (dismissed) {
                setIsVisible(false);
                return;
            }

            // Mostrar solo si es portrait y el ancho es menor a 1024px (tablets/móviles para abajo)
            // y la altura es mayor que el ancho.
            const isPortrait = window.innerHeight > window.innerWidth;
            const isMobileOrTablet = window.innerWidth < 1024;

            if (isPortrait && isMobileOrTablet) {
                setIsVisible(true);
                // Auto-dismiss after 5 seconds
                const timer = setTimeout(() => {
                    setIsVisible(false);
                    setDismissed(true);
                }, 5000);
                return () => clearTimeout(timer);
            } else {
                setIsVisible(false);
            }
        };

        // Chequear al montar y al cambiar tamaño
        checkOrientation();
        window.addEventListener('resize', checkOrientation);

        return () => window.removeEventListener('resize', checkOrientation);
    }, [dismissed]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-4 left-4 right-4 z-[999] md:hidden"
                >
                    <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 animate-pulse">
                                <Smartphone size={20} className="text-white rotate-90" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-sm font-bold text-white leading-tight">Mejor Horizontal</h3>
                                <p className="text-xs text-gray-400">Gira tu dispositivo para ver mejor.</p>
                            </div>
                        </div>

                        <button
                            onClick={() => { setIsVisible(false); setDismissed(true); }}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default RotateDevicePrompt;
