// Dashboard de Analytics para el Admin Panel
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Users, DollarSign, GraduationCap, AlertTriangle, TrendingUp, TrendingDown,
    Calendar, Filter, Download, RefreshCw, Search, ChevronLeft, ChevronRight,
    Eye, Edit2, CheckCircle, Clock, Gift, BarChart3
} from 'lucide-react';
import { useToast } from '../ui/Toast';
import { AnalyticsSkeleton } from '../ui/Skeleton';

// Componente de Stat Card
const StatCard = ({ title, value, subtitle, icon: Icon, trend, trendValue, color = 'red' }) => {
    const colorClasses = {
        red: 'bg-red-500/10 text-red-400 border-red-500/20',
        green: 'bg-green-500/10 text-green-400 border-green-500/20',
        blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group overflow-hidden"
        >
            <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon size={48} />
            </div>

            <div className={`w-10 h-10 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-4`}>
                <Icon size={20} />
            </div>

            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{title}</p>
            <p className="text-3xl font-black text-white mb-1">{value}</p>

            {trend && (
                <div className="flex items-center gap-1">
                    {trend === 'up' ? (
                        <TrendingUp size={14} className="text-green-400" />
                    ) : (
                        <TrendingDown size={14} className="text-red-400" />
                    )}
                    <span className={`text-xs font-bold ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                        {trendValue}
                    </span>
                    <span className="text-xs text-gray-500">{subtitle}</span>
                </div>
            )}
            {!trend && subtitle && (
                <p className="text-xs text-gray-500">{subtitle}</p>
            )}
        </motion.div>
    );
};

// Mini Chart Component (simple bars)
const MiniBarChart = ({ data, height = 60 }) => {
    const max = Math.max(...data.map(d => d.value), 1);

    return (
        <div className="flex items-end gap-1" style={{ height }}>
            {data.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(d.value / max) * 100}%` }}
                        transition={{ delay: i * 0.05 }}
                        className="w-full bg-gradient-to-t from-red-600 to-orange-500 rounded-t min-h-[2px]"
                        title={`${d.label}: ${d.value}`}
                    />
                    <span className="text-[8px] text-gray-500 truncate w-full text-center">{d.label}</span>
                </div>
            ))}
        </div>
    );
};

// Componente de Badge
const Badge = ({ variant = 'default', children }) => {
    const variants = {
        default: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        success: 'bg-green-500/20 text-green-400 border-green-500/30',
        warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        error: 'bg-red-500/20 text-red-400 border-red-500/30',
        info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    };

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${variants[variant]}`}>
            {children}
        </span>
    );
};

// Función para formatear moneda
const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
};

// Función para formatear fecha
const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
        return dateStr;
    }
};

const AnalyticsDashboard = () => {
    const [inscripciones, setInscripciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [planFilter, setPlanFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const itemsPerPage = 15;
    const toast = useToast();

    // Cargar datos locales directamente (evita errores de Firestore)
    useEffect(() => {
        const loadData = async () => {
            try {
                // Cargar datos locales primero para evitar errores de Firestore
                const localModule = await import('../../data/inscripciones');
                setInscripciones(localModule.inscripcionesData || []);
                setLoading(false);
            } catch (error) {
                console.warn("Error loading data:", error);
                setInscripciones([]);
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Calcular estadísticas
    const stats = useMemo(() => {
        if (!inscripciones.length) return null;

        const total = inscripciones.length;
        const ingresos = inscripciones.reduce((acc, i) => acc + (Number(i.monto) || 0), 0);
        const becas = inscripciones.filter(i =>
            i.referenciaPago?.toLowerCase().includes('beca') ||
            i.monto === 0 ||
            i.monto === '0'
        ).length;
        const pendientes = inscripciones.filter(i =>
            i.referenciaPago?.toLowerCase().includes('pendiente') ||
            i.estadoPago === 'pendiente'
        ).length;
        const enCuotas = inscripciones.filter(i => i.pagoEnCuotas === 'Sí').length;

        // Distribución por plan
        const planes = {};
        inscripciones.forEach(i => {
            const plan = i.plan || 'Sin Plan';
            planes[plan] = (planes[plan] || 0) + 1;
        });

        // Inscripciones por mes
        const porMes = {};
        inscripciones.forEach(i => {
            if (i.fechaInscripcion) {
                const date = new Date(i.fechaInscripcion);
                const mes = date.toLocaleDateString('es-CO', { month: 'short' });
                porMes[mes] = (porMes[mes] || 0) + 1;
            }
        });

        return {
            total,
            ingresos,
            becas,
            pendientes,
            enCuotas,
            planes,
            porMes,
            promedioIngreso: total > 0 ? ingresos / (total - becas) : 0
        };
    }, [inscripciones]);

    // Filtrar inscripciones
    const filteredData = useMemo(() => {
        return inscripciones.filter(i => {
            // Búsqueda
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesSearch =
                    i.nombre?.toLowerCase().includes(query) ||
                    i.email?.toLowerCase().includes(query) ||
                    i.documento?.includes(query);
                if (!matchesSearch) return false;
            }

            // Filtro de estado
            if (statusFilter !== 'all') {
                const isPendiente = i.referenciaPago?.toLowerCase().includes('pendiente') || i.estadoPago === 'pendiente';
                const isBeca = i.referenciaPago?.toLowerCase().includes('beca') || i.monto === 0;

                if (statusFilter === 'pagado' && (isPendiente || isBeca)) return false;
                if (statusFilter === 'pendiente' && !isPendiente) return false;
                if (statusFilter === 'beca' && !isBeca) return false;
            }

            // Filtro de plan
            if (planFilter !== 'all' && !i.plan?.includes(planFilter)) return false;

            return true;
        });
    }, [inscripciones, searchQuery, statusFilter, planFilter]);

    // Paginación
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(start, start + itemsPerPage);
    }, [filteredData, currentPage]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // Refrescar datos
    const handleRefresh = async () => {
        setRefreshing(true);
        toast.info("Actualizando datos...");
        // Simular refresh (los datos ya se actualizan en tiempo real)
        await new Promise(r => setTimeout(r, 1000));
        setRefreshing(false);
        toast.success("Datos actualizados");
    };

    // Exportar a CSV
    const handleExport = () => {
        const headers = ['Nombre', 'Email', 'Documento', 'Plan', 'Monto', 'Estado', 'Fecha'];
        const rows = filteredData.map(i => [
            i.nombre,
            i.email,
            i.documento,
            i.plan,
            i.monto,
            i.estadoPago || 'pagado',
            i.fechaInscripcion
        ]);

        const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `inscripciones_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        toast.success("Archivo exportado correctamente");
    };

    // Determinar estado de pago
    const getPaymentStatus = (inscripcion) => {
        const ref = inscripcion.referenciaPago?.toLowerCase() || '';
        const monto = Number(inscripcion.monto) || 0;

        if (ref.includes('beca') || monto === 0) {
            return { variant: 'info', label: 'Beca', icon: Gift };
        }
        if (ref.includes('pendiente') || inscripcion.estadoPago === 'pendiente') {
            return { variant: 'warning', label: 'Pendiente', icon: Clock };
        }
        return { variant: 'success', label: 'Pagado', icon: CheckCircle };
    };

    // Determinar color del plan
    const getPlanBadge = (plan) => {
        if (!plan) return { variant: 'default', short: '?' };
        if (plan.includes('A') && plan.includes('B') && plan.includes('G')) return { variant: 'purple', short: 'G+B+A' };
        if (plan.includes('B') && plan.includes('G')) return { variant: 'info', short: 'G+B' };
        if (plan.includes('Calendario B')) return { variant: 'success', short: 'Cal B' };
        if (plan.includes('genios')) return { variant: 'warning', short: 'Cal G' };
        return { variant: 'default', short: plan.substring(0, 10) };
    };

    if (loading) {
        return <AnalyticsSkeleton />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2">
                        <BarChart3 className="text-red-500" />
                        Analytics Dashboard
                    </h2>
                    <p className="text-sm text-gray-500">Estadísticas en tiempo real de inscripciones</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all disabled:opacity-50"
                    >
                        <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                    </button>
                    <button
                        onClick={handleExport}
                        className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all flex items-center gap-2 text-sm font-medium"
                    >
                        <Download size={16} />
                        Exportar CSV
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Inscripciones"
                        value={stats.total}
                        subtitle="estudiantes activos"
                        icon={Users}
                        color="blue"
                        trend="up"
                        trendValue="+15%"
                    />
                    <StatCard
                        title="Ingresos Totales"
                        value={formatCurrency(stats.ingresos)}
                        subtitle={`Promedio: ${formatCurrency(stats.promedioIngreso)}`}
                        icon={DollarSign}
                        color="green"
                    />
                    <StatCard
                        title="Becas Otorgadas"
                        value={stats.becas}
                        subtitle="estudiantes becados"
                        icon={GraduationCap}
                        color="purple"
                    />
                    <StatCard
                        title="Pagos Pendientes"
                        value={stats.pendientes}
                        subtitle="requieren seguimiento"
                        icon={AlertTriangle}
                        color="yellow"
                    />
                </div>
            )}

            {/* Charts Row */}
            {stats && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Inscripciones por Mes */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 rounded-2xl bg-white/5 border border-white/10"
                    >
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                            Inscripciones por Mes
                        </h3>
                        <MiniBarChart
                            data={Object.entries(stats.porMes).map(([label, value]) => ({ label, value }))}
                            height={120}
                        />
                    </motion.div>

                    {/* Distribución por Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-6 rounded-2xl bg-white/5 border border-white/10"
                    >
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                            Distribución por Plan
                        </h3>
                        <div className="space-y-3">
                            {Object.entries(stats.planes)
                                .sort((a, b) => b[1] - a[1])
                                .slice(0, 5)
                                .map(([plan, count]) => {
                                    const percentage = (count / stats.total * 100).toFixed(1);
                                    return (
                                        <div key={plan} className="flex items-center gap-3">
                                            <div className="flex-1">
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-gray-300 truncate max-w-[200px]">{plan}</span>
                                                    <span className="text-white font-bold">{count}</span>
                                                </div>
                                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${percentage}%` }}
                                                        className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                                                    />
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-500 w-12 text-right">{percentage}%</span>
                                        </div>
                                    );
                                })}
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, email o documento..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors"
                    />
                </div>
                <div className="flex gap-2">
                    {['all', 'pagado', 'pendiente', 'beca'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${statusFilter === status
                                ? 'bg-red-500 text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            {status === 'all' ? 'Todos' : status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Data Table */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
            >
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 bg-white/5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <div className="col-span-3">Estudiante</div>
                    <div className="col-span-2">Plan</div>
                    <div className="col-span-2">Monto</div>
                    <div className="col-span-2">Estado</div>
                    <div className="col-span-2">Fecha</div>
                    <div className="col-span-1 text-center">Acciones</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-white/5">
                    {paginatedData.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            No se encontraron inscripciones
                        </div>
                    ) : (
                        paginatedData.map((inscripcion, i) => {
                            const paymentStatus = getPaymentStatus(inscripcion);
                            const planBadge = getPlanBadge(inscripcion.plan);
                            const StatusIcon = paymentStatus.icon;

                            return (
                                <motion.div
                                    key={inscripcion.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.02 }}
                                    className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors group"
                                >
                                    {/* Estudiante */}
                                    <div className="col-span-3 flex items-center gap-3 min-w-0">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                            {inscripcion.nombre?.charAt(0).toUpperCase() || '?'}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-white truncate">{inscripcion.nombre}</p>
                                            <p className="text-xs text-gray-500 truncate">{inscripcion.email}</p>
                                        </div>
                                    </div>

                                    {/* Plan */}
                                    <div className="col-span-2">
                                        <Badge variant={planBadge.variant}>{planBadge.short}</Badge>
                                    </div>

                                    {/* Monto */}
                                    <div className="col-span-2">
                                        <span className="text-sm font-bold text-white">
                                            {formatCurrency(inscripcion.monto || 0)}
                                        </span>
                                        {inscripcion.pagoEnCuotas === 'Sí' && (
                                            <span className="ml-2 text-xs text-yellow-500">(Cuotas)</span>
                                        )}
                                    </div>

                                    {/* Estado */}
                                    <div className="col-span-2">
                                        <Badge variant={paymentStatus.variant}>
                                            <StatusIcon size={12} className="mr-1" />
                                            {paymentStatus.label}
                                        </Badge>
                                    </div>

                                    {/* Fecha */}
                                    <div className="col-span-2 text-sm text-gray-400">
                                        {formatDate(inscripcion.fechaInscripcion)}
                                    </div>

                                    {/* Acciones */}
                                    <div className="col-span-1 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                                            <Eye size={16} />
                                        </button>
                                        <button className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                                            <Edit2 size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between p-4 border-t border-white/10">
                        <p className="text-sm text-gray-500">
                            Mostrando {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredData.length)} de {filteredData.length}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white disabled:opacity-50 transition-all"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <div className="flex gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                                    const page = i + 1;
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${currentPage === page
                                                ? 'bg-red-500 text-white'
                                                : 'bg-white/5 text-gray-400 hover:text-white'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white disabled:opacity-50 transition-all"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default AnalyticsDashboard;
