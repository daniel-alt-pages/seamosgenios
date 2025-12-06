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
        <section className="py-24 relative overflow-hidden bg-black" id="ranking">
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
                        RESULTADOS <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">DESTACADOS</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        Estos son los puntajes reales de nuestros estudiantes en simulacros recientes.
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
                                <div className="grid grid-cols-3 gap-2 md:gap-4 items-end h-[350px] md:h-[400px] mb-12">
                                    {/* 2nd Place (Left) */}
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        whileInView={{ opacity: 1, height: "auto" }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.2 }}
                                        className="relative flex flex-col justify-end"
                                    >
                                        <div className="text-center mb-2">
                                            <div className="w-12 h-12 md:w-16 md:h-16 mx-auto rounded-full border-2 border-gray-400 bg-gray-800 flex items-center justify-center mb-2 shadow-lg shadow-gray-500/20">
                                                <span className="text-xl md:text-2xl">🥈</span>
                                            </div>
                                            <div className="font-bold text-gray-300 truncate text-xs md:text-sm px-1">{podiumOrder[0]?.name}</div>
                                            <div className="text-xs text-gray-500 font-mono font-bold">{podiumOrder[0]?.total} Ptos</div>
                                        </div>
                                        <div className="h-32 md:h-48 w-full bg-gradient-to-t from-gray-900 to-gray-800 rounded-t-xl border-t border-x border-gray-700/50 flex items-end justify-center pb-4 group hover:from-gray-800 hover:to-gray-700 transition-colors">
                                            <span className="text-4xl font-black text-white/30 group-hover:text-white/40 transition-colors">2</span>
                                        </div>
                                    </motion.div>

                                    {/* 1st Place (Center - HIGHEST) */}
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        whileInView={{ opacity: 1, height: "auto" }}
                                        viewport={{ once: true }}
                                        className="relative flex flex-col justify-end z-10"
                                    >
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 animate-bounce-slow">
                                            <Crown size={32} className="text-yellow-400 fill-yellow-400 drop-shadow-lg" />
                                        </div>
                                        <div className="text-center mb-2">
                                            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full border-4 border-yellow-400 bg-gray-800 flex items-center justify-center mb-2 shadow-xl shadow-yellow-500/30">
                                                <span className="text-2xl md:text-3xl">🥇</span>
                                            </div>
                                            <div className="font-bold text-yellow-100 truncate text-sm md:text-base px-1">{podiumOrder[1]?.name}</div>
                                            <div className="text-xs md:text-sm text-yellow-400 font-bold font-mono">{podiumOrder[1]?.total} Ptos</div>
                                        </div>
                                        <div className="h-44 md:h-64 w-full bg-gradient-to-t from-yellow-900/40 via-yellow-900/20 to-yellow-600/20 rounded-t-xl border-t border-x border-yellow-500/50 flex items-end justify-center pb-4 relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-yellow-400/5 animate-pulse" />
                                            <span className="text-6xl font-black text-yellow-500/40 group-hover:text-yellow-500/50 transition-colors">1</span>
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
                                        <div className="text-center mb-2">
                                            <div className="w-12 h-12 md:w-16 md:h-16 mx-auto rounded-full border-2 border-orange-700 bg-gray-800 flex items-center justify-center mb-2 shadow-lg shadow-orange-900/20">
                                                <span className="text-xl md:text-2xl">🥉</span>
                                            </div>
                                            <div className="font-bold text-gray-300 truncate text-xs md:text-sm px-1">{podiumOrder[2]?.name}</div>
                                            <div className="text-xs text-orange-400 font-mono font-bold">{podiumOrder[2]?.total} Ptos</div>
                                        </div>
                                        <div className="h-24 md:h-32 w-full bg-gradient-to-t from-orange-900/40 to-orange-900/10 rounded-t-xl border-t border-x border-orange-800/50 flex items-end justify-center pb-4 group hover:from-orange-900/30 transition-colors">
                                            <span className="text-4xl font-black text-white/30 group-hover:text-white/40 transition-colors">3</span>
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
                                            className="flex items-center gap-4 p-3 rounded-lg glass-card border border-white/5 hover:border-white/10 transition-colors"
                                        >
                                            <span className="font-mono text-gray-500 w-6 text-center font-bold">#{i + 4}</span>
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-xs shadow-inner">
                                                🎓
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <div className="text-sm font-bold text-gray-200 truncate">{student.name}</div>
                                                <div className="text-[10px] text-gray-500 truncate">{student.city || 'Colombia'}</div>
                                            </div>
                                            <div className="font-mono font-bold text-white bg-white/5 px-2 py-1 rounded-md">{student.total}</div>
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
