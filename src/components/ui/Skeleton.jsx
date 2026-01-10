// Componentes de Skeleton Loading profesionales
import { motion } from 'framer-motion';

// Skeleton base con shimmer animation
export const Skeleton = ({ className = '', variant = 'rectangular' }) => {
    const baseStyles = 'relative overflow-hidden bg-white/5 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent';

    const variants = {
        rectangular: 'rounded-lg',
        circular: 'rounded-full',
        text: 'rounded h-4',
    };

    return (
        <div className={`${baseStyles} ${variants[variant]} ${className}`} />
    );
};

// Skeleton para Cards de estadísticas
export const StatCardSkeleton = () => (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
        <Skeleton className="w-24 h-3 mb-3" />
        <Skeleton className="w-32 h-10 mb-2" />
        <Skeleton className="w-20 h-3" />
    </div>
);

// Skeleton para filas de tabla
export const TableRowSkeleton = ({ columns = 6 }) => (
    <div className="flex items-center gap-4 p-4 border-b border-white/5">
        <Skeleton className="w-10 h-10" variant="circular" />
        {Array.from({ length: columns - 1 }).map((_, i) => (
            <Skeleton key={i} className="flex-1 h-4" />
        ))}
    </div>
);

// Skeleton para tabla completa
export const TableSkeleton = ({ rows = 5, columns = 6 }) => (
    <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 flex gap-4">
            <Skeleton className="w-64 h-10" />
            <Skeleton className="w-24 h-10" />
            <Skeleton className="w-24 h-10" />
        </div>
        {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} columns={columns} />
        ))}
    </div>
);

// Skeleton para Chart
export const ChartSkeleton = ({ height = 'h-64' }) => (
    <div className={`rounded-2xl bg-white/5 border border-white/10 p-6 ${height}`}>
        <Skeleton className="w-32 h-4 mb-4" />
        <div className="flex items-end gap-2 h-[calc(100%-3rem)]">
            {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton
                    key={i}
                    className="flex-1"
                    style={{ height: `${Math.random() * 60 + 20}%` }}
                />
            ))}
        </div>
    </div>
);

// Skeleton para Card de Pricing
export const PricingCardSkeleton = () => (
    <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
        <Skeleton className="w-12 h-12 mb-4" variant="circular" />
        <Skeleton className="w-32 h-6 mb-2" />
        <Skeleton className="w-24 h-10 mb-6" />
        <div className="space-y-3 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                    <Skeleton className="w-5 h-5" variant="circular" />
                    <Skeleton className="flex-1 h-4" />
                </div>
            ))}
        </div>
        <Skeleton className="w-full h-12 rounded-xl" />
    </div>
);

// Skeleton para Dashboard Analytics
export const AnalyticsSkeleton = () => (
    <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <StatCardSkeleton key={i} />
            ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartSkeleton />
            <ChartSkeleton />
        </div>

        {/* Table */}
        <TableSkeleton rows={5} />
    </div>
);

export default Skeleton;
