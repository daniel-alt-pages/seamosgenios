// Dashboard con GridStack - Paneles arrastrables y redimensionables
import { useEffect, useRef, useState, useCallback } from 'react';
import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';
import {
    Users, DollarSign, TrendingUp, Calendar, BarChart3,
    Settings, Save, RotateCcw, Lock, Unlock, Maximize2,
    GripVertical, X, Plus
} from 'lucide-react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

// Widgets disponibles
const WIDGET_TYPES = {
    stats: { title: 'Estadísticas', icon: BarChart3, minW: 2, minH: 2 },
    inscripciones: { title: 'Inscripciones', icon: Users, minW: 3, minH: 3 },
    ingresos: { title: 'Ingresos', icon: DollarSign, minW: 2, minH: 2 },
    timeline: { title: 'Timeline', icon: Calendar, minW: 4, minH: 2 },
    chart: { title: 'Gráfico', icon: TrendingUp, minW: 3, minH: 3 },
};

// Componente de Widget individual
const Widget = ({ type, data, onRemove, isLocked }) => {
    const config = WIDGET_TYPES[type] || WIDGET_TYPES.stats;
    const Icon = config.icon;

    const renderContent = () => {
        switch (type) {
            case 'stats':
                return (
                    <div className="grid grid-cols-2 gap-3 p-2">
                        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <p className="text-xs text-blue-400 font-bold">Total</p>
                            <p className="text-2xl font-black text-white">{data?.total || 141}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                            <p className="text-xs text-green-400 font-bold">Ingresos</p>
                            <p className="text-lg font-black text-white">$28.5M</p>
                        </div>
                        <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                            <p className="text-xs text-purple-400 font-bold">Becas</p>
                            <p className="text-2xl font-black text-white">12</p>
                        </div>
                        <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                            <p className="text-xs text-yellow-400 font-bold">Pendientes</p>
                            <p className="text-2xl font-black text-white">8</p>
                        </div>
                    </div>
                );
            case 'chart':
                return (
                    <div className="p-4 h-full flex items-end gap-1">
                        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-gradient-to-t from-red-600 to-orange-500 rounded-t transition-all hover:opacity-80"
                                style={{ height: `${h}%` }}
                            />
                        ))}
                    </div>
                );
            case 'inscripciones':
                return (
                    <div className="p-3 space-y-2 overflow-auto max-h-[200px]">
                        {['María García', 'Juan López', 'Ana Martínez', 'Carlos Ruiz'].map((name, i) => (
                            <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
                                    {name[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{name}</p>
                                    <p className="text-xs text-gray-500">Calendario B</p>
                                </div>
                                <span className="text-xs text-green-400 font-bold">Pagado</span>
                            </div>
                        ))}
                    </div>
                );
            default:
                return (
                    <div className="p-4 flex items-center justify-center h-full text-gray-500">
                        <Icon size={48} className="opacity-20" />
                    </div>
                );
        }
    };

    return (
        <div className="h-full flex flex-col rounded-xl bg-[#0a0a0a] border border-white/10 overflow-hidden group">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-white/5 cursor-move gs-drag-handle">
                <div className="flex items-center gap-2">
                    <GripVertical size={14} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
                    <Icon size={14} className="text-red-400" />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{config.title}</span>
                </div>
                {!isLocked && (
                    <button
                        onClick={onRemove}
                        className="p-1 rounded hover:bg-red-500/20 text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
                {renderContent()}
            </div>
        </div>
    );
};

const GridDashboard = () => {
    const gridRef = useRef(null);
    const gridInstance = useRef(null);
    const [isLocked, setIsLocked] = useState(false);
    const [widgets, setWidgets] = useState([]);
    const [saving, setSaving] = useState(false);

    // Layout por defecto
    const defaultLayout = [
        { id: 'w1', type: 'stats', x: 0, y: 0, w: 4, h: 3 },
        { id: 'w2', type: 'chart', x: 4, y: 0, w: 4, h: 3 },
        { id: 'w3', type: 'inscripciones', x: 8, y: 0, w: 4, h: 4 },
        { id: 'w4', type: 'timeline', x: 0, y: 3, w: 8, h: 2 },
    ];

    // Cargar layout guardado (con fallback a localStorage)
    useEffect(() => {
        const loadLayout = async () => {
            // Primero intentar localStorage
            const localLayout = localStorage.getItem('dashboard_layout');
            if (localLayout) {
                try {
                    setWidgets(JSON.parse(localLayout));
                    return;
                } catch (e) {
                    console.warn('Invalid local layout, trying Firestore');
                }
            }

            // Luego intentar Firestore
            try {
                const docRef = doc(db, 'admin_settings', 'dashboard_layout');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setWidgets(docSnap.data().widgets || defaultLayout);
                } else {
                    setWidgets(defaultLayout);
                }
            } catch (error) {
                console.warn('Firestore not available, using default layout');
                setWidgets(defaultLayout);
            }
        };
        loadLayout();
    }, []);

    // Inicializar GridStack
    useEffect(() => {
        if (!gridRef.current || widgets.length === 0) return;

        // Limpiar instancia anterior
        if (gridInstance.current) {
            gridInstance.current.destroy(false);
        }

        // Crear nueva instancia
        gridInstance.current = GridStack.init({
            float: true,
            cellHeight: 60,
            column: 12,
            margin: 8,
            animate: true,
            draggable: {
                handle: '.gs-drag-handle'
            },
            resizable: {
                handles: 'e,se,s,sw,w'
            },
            staticGrid: isLocked
        }, gridRef.current);

        // Cargar widgets
        gridInstance.current.load(widgets.map(w => ({
            id: w.id,
            x: w.x,
            y: w.y,
            w: w.w,
            h: w.h,
            minW: WIDGET_TYPES[w.type]?.minW || 2,
            minH: WIDGET_TYPES[w.type]?.minH || 2,
        })));

        // Escuchar cambios
        gridInstance.current.on('change', (event, items) => {
            if (items) {
                setWidgets(prev => prev.map(w => {
                    const updated = items.find(i => i.id === w.id);
                    if (updated) {
                        return { ...w, x: updated.x, y: updated.y, w: updated.w, h: updated.h };
                    }
                    return w;
                }));
            }
        });

        return () => {
            if (gridInstance.current) {
                gridInstance.current.destroy(false);
            }
        };
    }, [widgets.length, isLocked]);

    // Actualizar estado de bloqueo
    useEffect(() => {
        if (gridInstance.current) {
            gridInstance.current.setStatic(isLocked);
        }
    }, [isLocked]);

    // Guardar layout (localStorage + Firestore)
    const saveLayout = async () => {
        setSaving(true);

        // Siempre guardar en localStorage primero
        localStorage.setItem('dashboard_layout', JSON.stringify(widgets));

        // Intentar guardar en Firestore
        try {
            await setDoc(doc(db, 'admin_settings', 'dashboard_layout'), {
                widgets,
                updatedAt: new Date().toISOString()
            });
            alert('Layout guardado correctamente');
        } catch (error) {
            console.warn('Firestore save failed, saved locally:', error);
            alert('Layout guardado localmente (Firestore no disponible)');
        }
        setSaving(false);
    };

    // Resetear layout
    const resetLayout = () => {
        if (confirm('¿Restaurar layout por defecto?')) {
            setWidgets(defaultLayout);
        }
    };

    // Agregar widget
    const addWidget = (type) => {
        const newWidget = {
            id: `w${Date.now()}`,
            type,
            x: 0,
            y: 0,
            w: WIDGET_TYPES[type]?.minW || 3,
            h: WIDGET_TYPES[type]?.minH || 2
        };
        setWidgets(prev => [...prev, newWidget]);
    };

    // Eliminar widget
    const removeWidget = (id) => {
        if (gridInstance.current) {
            const el = gridRef.current?.querySelector(`[gs-id="${id}"]`);
            if (el) gridInstance.current.removeWidget(el);
        }
        setWidgets(prev => prev.filter(w => w.id !== id));
    };

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <BarChart3 className="text-red-500" size={20} />
                        Dashboard Personalizable
                    </h2>
                </div>

                <div className="flex items-center gap-2">
                    {/* Add Widget Dropdown */}
                    <div className="relative group">
                        <button className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all flex items-center gap-2 text-sm">
                            <Plus size={16} />
                            Agregar Panel
                        </button>
                        <div className="absolute top-full left-0 mt-2 w-48 py-2 rounded-xl bg-[#151515] border border-white/10 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                            {Object.entries(WIDGET_TYPES).map(([key, config]) => {
                                const Icon = config.icon;
                                return (
                                    <button
                                        key={key}
                                        onClick={() => addWidget(key)}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                                    >
                                        <Icon size={14} />
                                        {config.title}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Lock Toggle */}
                    <button
                        onClick={() => setIsLocked(!isLocked)}
                        className={`px-3 py-2 rounded-lg border transition-all flex items-center gap-2 text-sm ${isLocked
                            ? 'bg-red-500/20 border-red-500/30 text-red-400'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                            }`}
                    >
                        {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
                        {isLocked ? 'Bloqueado' : 'Editar'}
                    </button>

                    {/* Reset */}
                    <button
                        onClick={resetLayout}
                        className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all"
                        title="Restaurar layout"
                    >
                        <RotateCcw size={16} />
                    </button>

                    {/* Save */}
                    <button
                        onClick={saveLayout}
                        disabled={saving}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium flex items-center gap-2 hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                        <Save size={16} />
                        {saving ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </div>

            {/* Grid Container */}
            <div
                ref={gridRef}
                className="grid-stack"
                style={{ minHeight: 400 }}
            >
                {widgets.map(widget => (
                    <div
                        key={widget.id}
                        className="grid-stack-item"
                        gs-id={widget.id}
                        gs-x={widget.x}
                        gs-y={widget.y}
                        gs-w={widget.w}
                        gs-h={widget.h}
                        gs-min-w={WIDGET_TYPES[widget.type]?.minW || 2}
                        gs-min-h={WIDGET_TYPES[widget.type]?.minH || 2}
                    >
                        <div className="grid-stack-item-content">
                            <Widget
                                type={widget.type}
                                data={widget.data}
                                onRemove={() => removeWidget(widget.id)}
                                isLocked={isLocked}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Custom GridStack Styles */}
            <style>{`
                .grid-stack {
                    background: transparent;
                }
                .grid-stack-item-content {
                    background: transparent;
                    border-radius: 12px;
                    overflow: hidden;
                }
                .grid-stack > .grid-stack-item > .grid-stack-item-content {
                    inset: 4px;
                }
                .grid-stack-item.ui-draggable-dragging {
                    opacity: 0.8;
                    z-index: 100;
                }
                .grid-stack-item.ui-resizable-resizing {
                    opacity: 0.9;
                }
                .grid-stack-placeholder > .placeholder-content {
                    background: rgba(239, 68, 68, 0.1) !important;
                    border: 2px dashed rgba(239, 68, 68, 0.3) !important;
                    border-radius: 12px;
                }
                .ui-resizable-handle {
                    opacity: 0;
                    transition: opacity 0.2s;
                }
                .grid-stack-item:hover .ui-resizable-handle {
                    opacity: 1;
                }
                .ui-resizable-se {
                    background: linear-gradient(135deg, transparent 50%, rgba(239,68,68,0.5) 50%);
                    width: 16px !important;
                    height: 16px !important;
                    right: 2px !important;
                    bottom: 2px !important;
                    border-radius: 0 0 8px 0;
                }
            `}</style>
        </div>
    );
};

export default GridDashboard;
