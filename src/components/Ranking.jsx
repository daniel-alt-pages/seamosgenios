import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, ArrowRight, TrendingUp, Flame, BarChart3, Calculator, BookOpen, Globe, Microscope, Users } from 'lucide-react';

const Ranking = () => {
    const [rankingData, setRankingData] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const listVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.1 }
        })
    };

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const response = await fetch('/ranking.csv');
                const text = await response.text();

                // Parse CSV
                const rows = text.split('\n').slice(1).filter(row => row.trim() !== '');
                const parsedData = rows.map(row => {
                    const cols = row.split(',');
                    if (cols.length < 8) return null;

                    const scoreStr = cols[7]?.split('/')[0] || "0";
                    return {
                        name: cols[0]?.trim(),
                        id: cols[1],
                        math: parseInt(cols[2]) || 0,
                        reading: parseInt(cols[3]) || 0,
                        social: parseInt(cols[4]) || 0,
                        science: parseInt(cols[5]) || 0,
                        english: parseInt(cols[6]) || 0,
                        total: parseInt(scoreStr),
                        city: cols[8]?.trim()
                    };
                }).filter(item => item !== null);

                // Sort by total score descending
                const sortedData = parsedData.sort((a, b) => b.total - a.total);

                // Calculate Stats
                const totalStudents = sortedData.length;
                const avgTotal = Math.round(sortedData.reduce((acc, curr) => acc + curr.total, 0) / totalStudents);
                const avgMath = Math.round(sortedData.reduce((acc, curr) => acc + curr.math, 0) / totalStudents);
                const avgReading = Math.round(sortedData.reduce((acc, curr) => acc + curr.reading, 0) / totalStudents);
                const avgSocial = Math.round(sortedData.reduce((acc, curr) => acc + curr.social, 0) / totalStudents);
                const avgScience = Math.round(sortedData.reduce((acc, curr) => acc + curr.science, 0) / totalStudents);
                const avgEnglish = Math.round(sortedData.reduce((acc, curr) => acc + curr.english, 0) / totalStudents);

                setStats({
                    students: totalStudents,
                    avgTotal,
                    areas: [
                        { name: "Matemáticas", score: avgMath, icon: Calculator, color: "text-blue-400", bar: "bg-blue-500" },
                        { name: "Lectura Crítica", score: avgReading, icon: BookOpen, color: "text-yellow-400", bar: "bg-yellow-500" },
                        { name: "Sociales", score: avgSocial, icon: Users, color: "text-orange-400", bar: "bg-orange-500" },
                        { name: "Ciencias", score: avgScience, icon: Microscope, color: "text-green-400", bar: "bg-green-500" },
                        { name: "Inglés", score: avgEnglish, icon: Globe, color: "text-purple-400", bar: "bg-purple-500" }
                    ]
                });

                setRankingData(sortedData);
                setLoading(false);

            } catch (error) {
                console.error("Error loading ranking:", error);
                setLoading(false);
            }
        };

        fetchRanking();
    }, []);

    const top3 = rankingData.length >= 3 ? rankingData.slice(0, 3) : [
        { name: "Cargando...", total: 0 }, { name: "Cargando...", total: 0 }, { name: "Cargando...", total: 0 }
    ];

    // Correct podium order: 2nd (Left), 1st (Center), 3rd (Right)
    const podiumOrder = [top3[1], top3[0], top3[2]];
    const leaderboard = rankingData.slice(3, 7);

    return (
        <section className="py-24 relative overflow-hidden" id="ranking">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-900/10 via-black to-black" />

            {/* Subtle Texture Overlay */}
            <div
                className="absolute inset-0 opacity-[0.03] bg-center bg-cover pointer-events-none mix-blend-screen"
                style={{ backgroundImage: `url('/images/ranking-bg.png')` }}
            />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 text-sm font-bold text-yellow-400 border border-yellow-500/20 animate-pulse-glow">
                        <Crown size={16} />
                        <span className="uppercase tracking-wider">Excelencia Académica</span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black mb-6 text-white">
                        RESULTADOS <span className="text-fire-animated">DESTACADOS</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        Estos son los puntajes reales de nuestros estudiantes en la prueba oficial de agosto 2025.
                        Una muestra del potencial que desbloqueamos juntos.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 mb-16">

                    {/* LEFT: PODIUM & LEADERBOARD (8 cols) */}
                    <div className="xl:col-span-8">
                        {loading ? (
                            <div className="h-[400px] flex items-center justify-center text-gray-500 font-mono animate-pulse">Cargando datos en tiempo real...</div>
                        ) : (
                            <>
                                {/* PODIUM */}
                                <div className="grid grid-cols-3 gap-2 md:gap-4 items-end h-[350px] md:h-[400px] mb-24 relative z-0">
                                    {/* 2nd Place (Left) */}
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        whileInView={{ opacity: 1, height: "auto" }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.2 }}
                                        className="relative flex flex-col justify-end"
                                    >
                                        <div className="text-center mb-4">
                                            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full border-2 border-slate-400 bg-slate-900/50 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(148,163,184,0.15)] relative backdrop-blur-sm">
                                                <span className="text-2xl font-black text-slate-300">2</span>
                                                <div className="absolute -top-1 -right-1">
                                                    <Trophy size={16} className="text-slate-400 fill-slate-400" />
                                                </div>
                                            </div>
                                            <div className="font-black text-white text-xs md:text-sm px-1 uppercase tracking-tight mb-2">{podiumOrder[0]?.name}</div>
                                            <div className="inline-block px-3 py-1 rounded-md bg-slate-800/80 border border-slate-600/50 backdrop-blur-md">
                                                <span className="text-lg md:text-xl font-black text-slate-200 tracking-wide">{podiumOrder[0]?.total} <span className="text-xs md:text-sm text-slate-400 font-bold uppercase">Ptos</span></span>
                                            </div>
                                        </div>
                                        <div className="h-40 md:h-52 w-full bg-slate-900/40 rounded-t-lg border border-slate-700/30 flex items-end justify-center pb-6 relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-gradient-to-b from-slate-800/10 to-slate-900/90" />
                                            {/* Removed large background number to prevent overlap/clutter */}
                                            <div className="h-full w-full absolute top-0 left-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                                        </div>
                                    </motion.div>

                                    {/* 1st Place (Center - HIGHEST) */}
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        whileInView={{ opacity: 1, height: "auto" }}
                                        viewport={{ once: true }}
                                        className="relative flex flex-col justify-end z-10"
                                    >
                                        <div className="absolute -top-14 left-1/2 -translate-x-1/2 animate-bounce-slow">
                                            <Crown size={40} className="text-yellow-400 fill-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                                        </div>
                                        <div className="text-center mb-4">
                                            <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full border-2 border-yellow-400 bg-yellow-900/20 flex items-center justify-center mb-3 shadow-[0_0_30px_rgba(234,179,8,0.2)] relative backdrop-blur-sm">
                                                <span className="text-3xl font-black text-yellow-400">1</span>
                                                <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                                                    <Trophy size={14} className="text-yellow-900 fill-yellow-900" />
                                                </div>
                                            </div>
                                            <div className="font-black text-white text-sm md:text-base px-1 uppercase tracking-tight mb-2">{podiumOrder[1]?.name}</div>
                                            <div className="inline-block px-4 py-1.5 rounded-lg bg-yellow-900/40 border border-yellow-500/50 backdrop-blur-md shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                                                <span className="text-2xl md:text-3xl font-black text-yellow-400 tracking-wide">{podiumOrder[1]?.total} <span className="text-sm md:text-base text-yellow-600 font-bold uppercase">Ptos</span></span>
                                            </div>
                                        </div>
                                        <div className="h-52 md:h-72 w-full bg-yellow-900/20 rounded-t-lg border border-yellow-600/30 flex items-end justify-center pb-6 relative overflow-hidden group shadow-[0_0_50px_rgba(234,179,8,0.1)]">
                                            <div className="absolute inset-0 bg-gradient-to-b from-yellow-900/5 to-yellow-900/80" />
                                            <div className="h-full w-full absolute top-0 left-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                                            {/* Shining effect */}
                                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000"></div>
                                        </div>
                                    </motion.div>

                                    {/* 3rd Place (Right) */}
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        whileInView={{ opacity: 1, height: "auto" }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.3 }}
                                        className="relative flex flex-col justify-end"
                                    >
                                        <div className="text-center mb-4">
                                            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full border-2 border-orange-700 bg-orange-900/20 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(194,65,12,0.15)] relative backdrop-blur-sm">
                                                <span className="text-2xl font-black text-orange-500">3</span>
                                                <div className="absolute -top-1 -right-1">
                                                    <Trophy size={16} className="text-orange-600 fill-orange-600" />
                                                </div>
                                            </div>
                                            <div className="font-black text-white text-xs md:text-sm px-1 uppercase tracking-tight mb-2">{podiumOrder[2]?.name}</div>
                                            <div className="inline-block px-3 py-1 rounded-md bg-orange-900/40 border border-orange-700/50 backdrop-blur-md">
                                                <span className="text-lg md:text-xl font-black text-orange-400 tracking-wide">{podiumOrder[2]?.total} <span className="text-xs md:text-sm text-orange-600 font-bold uppercase">Ptos</span></span>
                                            </div>
                                        </div>
                                        <div className="h-32 md:h-40 w-full bg-orange-900/20 rounded-t-lg border border-orange-800/30 flex items-end justify-center pb-6 relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-gradient-to-b from-orange-900/5 to-orange-950/90" />
                                            <div className="h-full w-full absolute top-0 left-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* LIST */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between px-2 mb-2">
                                        <span className="text-sm font-bold text-gray-400">Otros Estudiantes Destacados</span>
                                        <a href="https://ranking-de-genios.vercel.app/" target="_blank" rel="noreferrer" className="text-xs text-yellow-500 hover:text-yellow-400 flex items-center gap-1 transition-colors">
                                            Ver lista completa <ArrowRight size={12} />
                                        </a>
                                    </div>
                                    {leaderboard.map((student, i) => (
                                        <motion.div
                                            key={i}
                                            variants={listVariants}
                                            initial="hidden"
                                            whileInView="visible"
                                            custom={i}
                                            className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.07] transition-all group"
                                        >
                                            <span className="font-display text-gray-500 w-8 text-center font-bold text-lg group-hover:text-white transition-colors">#{i + 4}</span>
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-lg shadow-lg border border-white/10 group-hover:border-white/20 transition-colors">
                                                🎓
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <div className="text-sm md:text-base font-bold text-gray-200 truncate group-hover:text-white transition-colors">{student.name}</div>
                                                <div className="text-[11px] text-gray-500 truncate flex items-center gap-1">
                                                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500/50"></span>
                                                    {student.city || 'Estudiante PreICFES'}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="font-display font-black text-white bg-black/40 border border-white/5 px-3 py-1.5 rounded-lg shadow-inner text-sm md:text-base">
                                                    {student.total} <span className="text-[8px] uppercase text-gray-500 font-bold ml-1">Ptos</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* RIGHT: STATS DASHBOARD (4 cols) */}
                    <div className="xl:col-span-4 space-y-6">
                        {/* Global Avg Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="p-6 rounded-3xl glass-strong border border-white/10 relative overflow-hidden group hover:border-white/20 transition-colors"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <BarChart3 size={64} className="text-white" />
                            </div>
                            <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Promedio General</h3>
                            <div className="text-5xl font-black text-white mb-2 tracking-tight">{stats ? stats.avgTotal : "---"}</div>
                            <p className="text-xs text-gray-500 mb-4">Puntaje promedio de {stats ? stats.students : "---"} estudiantes</p>

                            <div className="w-full bg-gray-800 rounded-full h-1.5 mb-1">
                                <div className="bg-white h-1.5 rounded-full" style={{ width: `${(stats?.avgTotal / 500) * 100}%` }}></div>
                            </div>
                            <div className="flex justify-between text-[10px] text-gray-500">
                                <span>0</span>
                                <span>500</span>
                            </div>
                        </motion.div>

                        {/* Areas Breakdown */}
                        <div className="p-6 rounded-3xl glass-card border border-white/5 hover:border-white/10 transition-colors">
                            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                                <Trophy size={16} className="text-yellow-400" />
                                Rendimiento por Áreas
                            </h3>

                            <div className="space-y-5">
                                {stats?.areas.map((area, index) => {
                                    const Icon = area.icon;
                                    return (
                                        <div key={index}>
                                            <div className="flex justify-between items-center mb-1.5">
                                                <div className="flex items-center gap-2">
                                                    <Icon size={14} className={area.color} />
                                                    <span className="text-sm text-gray-300 font-medium">{area.name}</span>
                                                </div>
                                                <span className="text-sm font-bold text-white">{area.score}<span className="text-[10px] text-gray-600 font-normal">/100</span></span>
                                            </div>
                                            <div className="w-full bg-gray-800/50 rounded-full h-2 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${area.score}%` }}
                                                    transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                                                    className={`h-full rounded-full ${area.bar}`}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* CTA Card */}
                        <div className="p-6 rounded-3xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 text-center">
                            <h3 className="text-white font-bold mb-2">Transparencia Total</h3>
                            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                                Accede a la plataforma oficial para ver el listado detallado de todos los estudiantes y sus resultados.
                            </p>
                            <a
                                href="https://ranking-de-genios.vercel.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-black text-sm font-bold rounded-xl transition-all hover:scale-105 shadow-xl shadow-white/5"
                            >
                                <Globe size={16} />
                                Ver Plataforma Oficial
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Ranking;
