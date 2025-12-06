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
                        className="hidden lg:flex items-center gap-10"
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
                        className="hidden lg:block"
                    >
                        <button className="group px-6 py-2.5 glass-strong hover:bg-white/10 border border-white/10 hover:border-red-500/50 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 hover-lift flex items-center gap-2">
                            <Sparkles size={14} className="text-red-400 group-hover:animate-pulse" />
                            Aula Virtual
                        </button>
                    </motion.div>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden text-white p-2 hover:bg-white/5 rounded-xl transition-colors"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay & Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Sidebar Drawer */}
                        <motion.aside
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-[100dvh] w-[85%] max-w-[320px] bg-[#050505] border-l border-white/10 z-[100] flex flex-col shadow-2xl overflow-y-auto"
                        >
                            {/* Mobile Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/5">
                                <span className="text-xl font-black tracking-tighter text-white">MENÚ</span>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Menu Items Container */}
                            <div className="flex-1 flex flex-col justify-center px-6 gap-6">
                                {menuItems.map((item, i) => (
                                    <motion.a
                                        key={item}
                                        href={`#${item.toLowerCase()}`}
                                        className="group relative flex items-center gap-3 text-2xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-gray-400 to-gray-600 hover:from-white hover:to-gray-200 transition-all"
                                        onClick={() => setIsOpen(false)}
                                        initial="hidden"
                                        animate="visible"
                                        custom={i}
                                        variants={{
                                            hidden: { opacity: 0, x: 30 },
                                            visible: (i) => ({
                                                opacity: 1,
                                                x: 0,
                                                transition: {
                                                    delay: 0.05 + (i * 0.05),
                                                    staggerChildren: 0.03
                                                }
                                            })
                                        }}
                                    >
                                        {/* Staggered Letter Animation */}
                                        <span className="flex">
                                            {item.split("").map((char, charIndex) => (
                                                <motion.span
                                                    key={`${item}-${charIndex}`}
                                                    variants={{
                                                        hidden: { opacity: 0, y: 10 },
                                                        visible: { opacity: 1, y: 0 }
                                                    }}
                                                    className="inline-block"
                                                >
                                                    {char}
                                                </motion.span>
                                            ))}
                                        </span>

                                        {/* Decorative Active Dot */}
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300 shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                                    </motion.a>
                                ))}
                            </div>

                            {/* Footer / CTA */}
                            <div className="p-8 border-t border-white/5">
                                <motion.button
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 rounded-xl font-bold uppercase tracking-widest shadow-[0_0_30px_rgba(220,38,38,0.3)] flex items-center justify-center gap-3 text-white hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    <Sparkles size={18} />
                                    Aula Virtual
                                </motion.button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
