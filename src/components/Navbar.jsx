import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const menuItems = ['Inicio', 'Nosotros', 'Planes', 'Contacto'];

    return (
        <nav className={`fixed w-full z-50 top-0 left-0 transition-all duration-500 ${scrolled
                ? 'glass-strong border-b border-white/10 shadow-2xl'
                : 'bg-transparent border-b border-white/5'
            }`}>
            <div className="container mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-2 group cursor-pointer"
                    >
                        <div className="text-2xl md:text-3xl font-black tracking-tighter flex items-center gap-1.5">
                            <span className="text-white">SEAMOS</span>
                            <span className="text-gradient neon-text-subtle">GENIOS</span>
                            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse-glow" />
                        </div>
                    </motion.div>

                    {/* Desktop Menu */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="hidden md:flex items-center gap-10"
                    >
                        {menuItems.map((item, index) => (
                            <motion.a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 * index }}
                                className="text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors relative group"
                            >
                                {item}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-600 to-orange-600 transition-all duration-300 group-hover:w-full" />
                            </motion.a>
                        ))}
                    </motion.div>

                    {/* CTA Button Desktop */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="hidden md:block"
                    >
                        <button className="group px-6 py-2.5 glass-strong hover:bg-white/10 border border-white/10 hover:border-red-500/50 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 hover-lift flex items-center gap-2">
                            <Sparkles size={14} className="text-red-400 group-hover:animate-pulse" />
                            Aula Virtual
                        </button>
                    </motion.div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white p-2 hover:bg-white/5 rounded-xl transition-colors"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden glass-strong border-t border-white/10 overflow-hidden"
                    >
                        <div className="flex flex-col p-6 gap-6 container mx-auto">
                            {menuItems.map((item, index) => (
                                <motion.a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-xl font-bold text-gray-300 hover:text-white transition-colors flex items-center gap-3 group"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    {item}
                                </motion.a>
                            ))}
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-2xl font-bold uppercase tracking-widest shadow-2xl shadow-red-900/40 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <Sparkles size={16} />
                                Aula Virtual
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
