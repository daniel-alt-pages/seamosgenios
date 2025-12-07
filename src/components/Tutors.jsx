import { motion } from 'framer-motion';
import { User, BookOpen, Calculator, Globe, HeartPulse, GraduationCap, Gavel, Crown, Palette, Rocket } from 'lucide-react';

const Tutors = () => {
    const tutors = [
        {
            name: "Daniel De La Cruz",
            role: "Presidente y Fundador (+5 Años)",
            institution: "Universidad del Rosario - Escuela de Administración",
            description: "Condecorado 2 veces por excelencia académica en el diplomado Samsung Innovation Campus. Ganador de una Hackathon de Programación. Completamente autodidacta.",
            highlight: "Líder Visionario",
            image: "https://i.ibb.co/2716K9yw/Daniel-De-La-Cruz-SEAMOSGENIOS.jpg",
            icon: Crown,
            color: "text-amber-400",
            bg: "bg-amber-500/10",
            special: true
        },
        {
            name: "Angel Pacheco",
            role: "Vicepresidente (+3 Años)",
            institution: "Doble Titulación: UNAL & Uniandes",
            description: "Estudia Ing. Agrícola en la UNAL y Matemáticas Puras en Los Andes simultáneamente. Subió de 308 a 475 en el ICFES.",
            highlight: "475 Puntos",
            image: "https://i.ibb.co/KcnYhKMt/Angel-Pacheco-SEAMOSGENIOS.jpg",
            icon: Calculator,
            color: "text-blue-400",
            bg: "bg-blue-500/10"
        },
        {
            name: "Daniel Cuspoca",
            role: "Matemáticas / Física (+2 Años)",
            institution: "Universidad Industrial de Santander",
            description: "Medicina (UIS). Ejemplo de superación: pasó de 348 a 477. Fanático a morir de la física.",
            highlight: "477 Puntos",
            image: "https://i.ibb.co/23RN8xMB/Daniel-Cuspoca-SEAMOSGENIOS.jpg",
            icon: Calculator,
            color: "text-cyan-400",
            bg: "bg-cyan-500/10"
        },
        {
            name: "Alexandra Nikol",
            role: "Lectura Crítica (+3 Años)",
            institution: "Universidad Industrial de Santander",
            description: "Medicina (UIS). 428 puntos. Logró 100/100 en Lectura, Matemáticas e Inglés (C1 Oxford).",
            highlight: "100/100 Perfect",
            image: "https://i.ibb.co/Hf1JvLhG/Alexandra-Nikol-SEAMOSGENIOS.jpg",
            icon: BookOpen,
            color: "text-pink-400",
            bg: "bg-pink-500/10"
        },
        {
            name: "Viviana Rincón",
            role: "Matemáticas e Inglés (+3 Años)",
            institution: "Universidad Industrial de Santander",
            description: "Medicina (UIS). 424 puntos, 100/100 en Matemáticas e Inglés (C1 Oxford). Formación en lenguas extranjeras.",
            highlight: "C1 Oxford",
            image: "https://i.ibb.co/HTCYycBX/Viviana-Rinc-n-SEAMOSGENIOS.jpg",
            icon: Globe,
            color: "text-purple-400",
            bg: "bg-purple-500/10"
        },
        {
            name: "José Londoño",
            role: "Ciencias Naturales (+3 Años)",
            institution: "Próximo estudiante de medicina",
            description: "450 puntos en ICFES. Entusiasta de las ciencias con énfasis en bioquímica.",
            highlight: "Bioquímica Expert",
            image: "https://i.ibb.co/JjCRR0G3/Jos-Londo-o-SEAMOSGENIOS.jpg",
            icon: HeartPulse,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10"
        },
        {
            name: "Jesús Tovar",
            role: "Ciencias (+4 Años)",
            institution: "Universidad Surcolombiana",
            description: "Ciencias Naturales. 405 en ICFES. Amante del conocimiento empirista.",
            highlight: "Ciencias",
            image: "https://i.ibb.co/wZqdyq9J/Jes-s-Tovar-SEAMOSGENIOS.jpg",
            icon: HeartPulse,
            color: "text-green-400",
            bg: "bg-green-500/10"
        },
        {
            name: "Hellen Aranda",
            role: "Lectura Crítica (+1 Año)",
            institution: "Universidad del Tolima",
            description: "Logró 424 puntos, con 100/100 en Matemáticas e Inglés. Posee el puntaje más alto en la historia de su institución.",
            highlight: "Puntaje Histórico",
            image: "https://i.ibb.co/wNvntF8G/Hellen-Tovar-SEAMOSGENIOS.jpg",
            icon: BookOpen,
            color: "text-rose-400",
            bg: "bg-rose-500/10"
        },
        {
            name: "David Cardona",
            role: "Sociales y Ciudadanas (+2 Años)",
            institution: "Universidad Icesi",
            description: "Logró 477 puntos en su primera presentación. Joven apasionado con visión crítica y analítica.",
            highlight: "477 Puntos",
            image: "https://i.ibb.co/C5Km98Yy/David-Cardona-SEAMOSGENIOS.jpg",
            icon: Gavel,
            color: "text-orange-400",
            bg: "bg-orange-500/10"
        },
        {
            name: "Carlos Murillo",
            role: "Sociales y Ciudadanas (+3 Años)",
            institution: "Universidad de Pamplona",
            description: "Subió de 353 a 441 en el ICFES. Estudiante de Derecho. Amante de la filosofía. Líder innato.",
            highlight: "Derecho",
            image: "https://i.ibb.co/1J0wggxj/Carlos-Murillo-SEAMOSGENIOS.jpg",
            icon: Gavel,
            color: "text-yellow-400",
            bg: "bg-yellow-500/10"
        },
        {
            name: "Sofia Suárez",
            role: "Lectura Crítica (+4 Años)",
            institution: "Universidad Industrial de Santander",
            description: "Estudiante de Medicina y Artista Plástica. 449 puntos en ICFES y 89.3 en UdeA. Conexión ciencia-arte.",
            highlight: "Medicina + Arte",
            image: "/images/Sofia-Suarez-SEAMOSGENIOS.jpg",
            icon: Palette,
            color: "text-indigo-400",
            bg: "bg-indigo-500/10"
        },
        {
            name: "Sara Palacio",
            role: "Matemáticas e Inglés (+2 Años)",
            institution: "Universidad de Antioquia",
            description: "Admitida a Ingeniería Aeroespacial (UdeA). Logró 424 puntos en su primera presentación. Pasión por las matemáticas.",
            highlight: "Ing. Aeroespacial",
            image: "/images/Sara-Palacio-SEAMOSGENIOS.jpg",
            icon: Rocket,
            color: "text-teal-400",
            bg: "bg-teal-500/10"
        }
    ];

    return (
        <section className="py-24 relative" id="tutores">
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 text-sm font-semibold text-gray-400 border border-white/10">
                        <User size={16} />
                        <span className="uppercase tracking-wider">Equipo Académico</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black mb-6 text-white flex items-center justify-center gap-4">
                        Mentores de <span className="text-fire-animated">Excelencia</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        El equipo detrás de los resultados. Estudiantes de las mejores universidades del país y puntajes ICFES excepcionales.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {tutors.map((tutor, index) => {
                        const Icon = tutor.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="group relative h-full"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${tutor.special ? 'from-amber-500/20 to-transparent' : 'from-white/5 to-transparent'} rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                <div className={`relative h-full p-6 rounded-3xl glass-card border ${tutor.special ? 'border-amber-500/30' : 'border-white/5'} group-hover:border-white/20 transition-all duration-300 hover:-translate-y-2 flex flex-col`}>

                                    {/* Header: Avatar & Badge */}
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`w-24 h-24 rounded-2xl overflow-hidden shadow-lg border-2 ${tutor.special ? 'border-amber-500/50 shadow-amber-900/20' : 'border-white/10'} group-hover:scale-110 transition-transform duration-300`}>
                                            <img
                                                src={tutor.image}
                                                alt={tutor.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        {tutor.highlight && (
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${tutor.bg} ${tutor.color}`}>
                                                {tutor.highlight}
                                            </span>
                                        )}
                                    </div>

                                    <div className="mb-4 flex-grow">
                                        <h3 className={`text-lg font-bold ${tutor.special ? 'text-amber-100' : 'text-white'} mb-1`}>{tutor.name}</h3>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1">
                                            <Icon size={12} className={tutor.color} />
                                            {tutor.role}
                                        </p>

                                        <div className="flex items-center gap-2 mb-3 text-xs text-gray-400">
                                            <GraduationCap size={14} className={tutor.color} />
                                            <span className="truncate">{tutor.institution}</span>
                                        </div>

                                        <p className="text-sm text-gray-400 leading-relaxed border-t border-white/5 pt-3">
                                            {tutor.description}
                                        </p>
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

export default Tutors;
