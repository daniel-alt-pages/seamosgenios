// Panel de Administración - Seamos Genios
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings,
    Palette,
    DollarSign,
    Calendar,
    Clock,
    Type,
    LogOut,
    Save,
    Plus,
    Trash2,
    Eye,
    EyeOff,
    Check,
    X,
    Loader2,
    Shield,
    RefreshCw,
    ChevronDown,
    ChevronUp,
    Star,
    Zap,
    Github,
    BarChart3,
    LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSiteConfig, useFormatPrice } from '../contexts/SiteConfigContext';
import GitHubIntegration from '../components/admin/GitHubIntegration';
import GridDashboard from '../components/admin/GridDashboard';
import AnalyticsDashboard from '../components/admin/AnalyticsDashboard';

// Componente de Login
const AdminLogin = () => {
    const { loginWithGoogle, error, clearError, loading } = useAuth();
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleGoogleLogin = async () => {
        setIsLoggingIn(true);
        await loginWithGoogle();
        setIsLoggingIn(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
                    {/* Logo/Header */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/30">
                            <Shield className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-2xl font-black text-white mb-2">Panel de Administración</h1>
                        <p className="text-gray-400 text-sm">Seamos Genios - Gestión de Contenido</p>
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3"
                            >
                                <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-red-400 text-sm font-medium">{error}</p>
                                    <button
                                        onClick={clearError}
                                        className="text-red-400/60 text-xs mt-1 hover:text-red-400"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Google Login Button */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={isLoggingIn || loading}
                        className="w-full py-4 px-6 bg-white hover:bg-gray-100 text-gray-800 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                        {isLoggingIn ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                <span>Verificando acceso...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-6 h-6" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                <span>Iniciar con Google</span>
                            </>
                        )}
                    </button>

                    <p className="text-center text-gray-500 text-xs mt-6">
                        Solo usuarios autorizados pueden acceder
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

// Componente de Panel de Edición de Planes
const PlansEditor = ({ plans, onSave }) => {
    const [editedPlans, setEditedPlans] = useState(plans);
    const [expandedPlan, setExpandedPlan] = useState(null);
    const [saving, setSaving] = useState(false);
    const formatPrice = useFormatPrice();

    useEffect(() => {
        setEditedPlans(plans);
    }, [plans]);

    const handlePlanChange = (index, field, value) => {
        const updated = [...editedPlans];
        updated[index] = { ...updated[index], [field]: value };
        setEditedPlans(updated);
    };

    const handleFeatureChange = (planIndex, featureIndex, value) => {
        const updated = [...editedPlans];
        updated[planIndex].features[featureIndex] = value;
        setEditedPlans(updated);
    };

    const addFeature = (planIndex) => {
        const updated = [...editedPlans];
        updated[planIndex].features.push("Nueva característica");
        setEditedPlans(updated);
    };

    const removeFeature = (planIndex, featureIndex) => {
        const updated = [...editedPlans];
        updated[planIndex].features.splice(featureIndex, 1);
        setEditedPlans(updated);
    };

    const addPlan = () => {
        setEditedPlans([...editedPlans, {
            id: `plan-${Date.now()}`,
            name: "Nuevo Plan",
            price: 200000,
            originalPrice: 300000,
            currency: "COP",
            available: true,
            popular: false,
            urgent: false,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            inscriptionDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            features: ["Característica 1", "Característica 2"]
        }]);
    };

    const removePlan = (index) => {
        if (confirm('¿Estás seguro de eliminar este plan?')) {
            const updated = [...editedPlans];
            updated.splice(index, 1);
            setEditedPlans(updated);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        await onSave(editedPlans);
        setSaving(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-green-400" />
                    Planes y Precios
                </h2>
                <button
                    onClick={addPlan}
                    className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 rounded-lg text-sm font-medium flex items-center gap-2 transition-all"
                >
                    <Plus className="w-4 h-4" />
                    Agregar Plan
                </button>
            </div>

            <div className="space-y-4">
                {editedPlans.map((plan, index) => (
                    <motion.div
                        key={plan.id || index}
                        layout
                        className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden"
                    >
                        {/* Plan Header */}
                        <div
                            className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                            onClick={() => setExpandedPlan(expandedPlan === index ? null : index)}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.popular ? 'bg-red-500/20' : 'bg-white/10'}`}>
                                    {plan.popular ? <Star className="w-5 h-5 text-red-400" /> : <Zap className="w-5 h-5 text-gray-400" />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{plan.name}</h3>
                                    <p className="text-sm text-gray-400">
                                        {formatPrice(plan.price)}
                                        {plan.originalPrice && <span className="line-through ml-2 text-gray-500">{formatPrice(plan.originalPrice)}</span>}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${plan.available ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {plan.available ? 'Activo' : 'Inactivo'}
                                </span>
                                {expandedPlan === index ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                            </div>
                        </div>

                        {/* Plan Details (Collapsible) */}
                        <AnimatePresence>
                            {expandedPlan === index && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="border-t border-white/10"
                                >
                                    <div className="p-6 space-y-6">
                                        {/* Basic Info */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">Nombre del Plan</label>
                                                <input
                                                    type="text"
                                                    value={plan.name}
                                                    onChange={(e) => handlePlanChange(index, 'name', e.target.value)}
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none transition-colors"
                                                />
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="flex-1">
                                                    <label className="block text-sm font-medium text-gray-400 mb-2">Precio</label>
                                                    <input
                                                        type="number"
                                                        value={plan.price}
                                                        onChange={(e) => handlePlanChange(index, 'price', parseInt(e.target.value))}
                                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none transition-colors"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="block text-sm font-medium text-gray-400 mb-2">Precio Original</label>
                                                    <input
                                                        type="number"
                                                        value={plan.originalPrice}
                                                        onChange={(e) => handlePlanChange(index, 'originalPrice', parseInt(e.target.value))}
                                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none transition-colors"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dates */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                                    <Calendar className="w-4 h-4 inline mr-1" />
                                                    Fecha de Inicio
                                                </label>
                                                <input
                                                    type="date"
                                                    value={plan.startDate}
                                                    onChange={(e) => handlePlanChange(index, 'startDate', e.target.value)}
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                                    <Calendar className="w-4 h-4 inline mr-1" />
                                                    Fecha de Fin
                                                </label>
                                                <input
                                                    type="date"
                                                    value={plan.endDate}
                                                    onChange={(e) => handlePlanChange(index, 'endDate', e.target.value)}
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                                    <Calendar className="w-4 h-4 inline mr-1" />
                                                    Cierre Inscripciones
                                                </label>
                                                <input
                                                    type="date"
                                                    value={plan.inscriptionDeadline}
                                                    onChange={(e) => handlePlanChange(index, 'inscriptionDeadline', e.target.value)}
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none transition-colors"
                                                />
                                            </div>
                                        </div>

                                        {/* Toggles */}
                                        <div className="flex flex-wrap gap-4">
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <div className={`w-12 h-6 rounded-full relative transition-colors ${plan.available ? 'bg-green-500' : 'bg-gray-600'}`}>
                                                    <input
                                                        type="checkbox"
                                                        checked={plan.available}
                                                        onChange={(e) => handlePlanChange(index, 'available', e.target.checked)}
                                                        className="sr-only"
                                                    />
                                                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${plan.available ? 'left-6' : 'left-0.5'}`} />
                                                </div>
                                                <span className="text-sm text-gray-300">Disponible</span>
                                            </label>

                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <div className={`w-12 h-6 rounded-full relative transition-colors ${plan.popular ? 'bg-red-500' : 'bg-gray-600'}`}>
                                                    <input
                                                        type="checkbox"
                                                        checked={plan.popular}
                                                        onChange={(e) => handlePlanChange(index, 'popular', e.target.checked)}
                                                        className="sr-only"
                                                    />
                                                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${plan.popular ? 'left-6' : 'left-0.5'}`} />
                                                </div>
                                                <span className="text-sm text-gray-300">Popular (Destacado)</span>
                                            </label>

                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <div className={`w-12 h-6 rounded-full relative transition-colors ${plan.urgent ? 'bg-orange-500' : 'bg-gray-600'}`}>
                                                    <input
                                                        type="checkbox"
                                                        checked={plan.urgent}
                                                        onChange={(e) => handlePlanChange(index, 'urgent', e.target.checked)}
                                                        className="sr-only"
                                                    />
                                                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${plan.urgent ? 'left-6' : 'left-0.5'}`} />
                                                </div>
                                                <span className="text-sm text-gray-300">Urgente (Últimos días)</span>
                                            </label>
                                        </div>

                                        {/* Features */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-3">Características</label>
                                            <div className="space-y-2">
                                                {plan.features.map((feature, featureIndex) => (
                                                    <div key={featureIndex} className="flex items-center gap-2">
                                                        <input
                                                            type="text"
                                                            value={feature}
                                                            onChange={(e) => handleFeatureChange(index, featureIndex, e.target.value)}
                                                            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-red-500 focus:outline-none transition-colors"
                                                        />
                                                        <button
                                                            onClick={() => removeFeature(index, featureIndex)}
                                                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={() => addFeature(index)}
                                                    className="w-full py-2 border border-dashed border-white/20 rounded-lg text-gray-400 text-sm hover:border-white/40 hover:text-white transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    Agregar característica
                                                </button>
                                            </div>
                                        </div>

                                        {/* Delete Plan Button */}
                                        <button
                                            onClick={() => removePlan(index)}
                                            className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Eliminar Plan
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            {/* Save Button */}
            <motion.button
                onClick={handleSave}
                disabled={saving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-lg shadow-red-900/30"
            >
                {saving ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Guardando...
                    </>
                ) : (
                    <>
                        <Save className="w-5 h-5" />
                        Guardar Cambios
                    </>
                )}
            </motion.button>
        </div>
    );
};

// Componente de Editor de Tema/Colores
const ThemeEditor = ({ theme, onSave }) => {
    const [editedTheme, setEditedTheme] = useState(theme);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setEditedTheme(theme);
    }, [theme]);

    const handleSave = async () => {
        setSaving(true);
        await onSave(editedTheme);
        setSaving(false);
    };

    const colorPresets = [
        { name: 'Rojo Fuego', primary: '#ef4444', secondary: '#f97316' },
        { name: 'Azul Océano', primary: '#3b82f6', secondary: '#06b6d4' },
        { name: 'Verde Esmeralda', primary: '#10b981', secondary: '#22c55e' },
        { name: 'Púrpura Real', primary: '#8b5cf6', secondary: '#a855f7' },
        { name: 'Rosa Neón', primary: '#ec4899', secondary: '#f472b6' },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Palette className="w-6 h-6 text-purple-400" />
                Tema y Colores
            </h2>

            {/* Presets */}
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">Presets de Color</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {colorPresets.map((preset) => (
                        <button
                            key={preset.name}
                            onClick={() => setEditedTheme({ ...editedTheme, primaryColor: preset.primary, secondaryColor: preset.secondary })}
                            className="p-3 rounded-xl border border-white/10 hover:border-white/30 transition-all text-center"
                        >
                            <div className="flex justify-center gap-1 mb-2">
                                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: preset.primary }} />
                                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: preset.secondary }} />
                            </div>
                            <span className="text-xs text-gray-400">{preset.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Custom Colors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Color Primario</label>
                    <div className="flex items-center gap-3">
                        <input
                            type="color"
                            value={editedTheme.primaryColor}
                            onChange={(e) => setEditedTheme({ ...editedTheme, primaryColor: e.target.value })}
                            className="w-12 h-12 rounded-lg cursor-pointer border-0"
                        />
                        <input
                            type="text"
                            value={editedTheme.primaryColor}
                            onChange={(e) => setEditedTheme({ ...editedTheme, primaryColor: e.target.value })}
                            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none transition-colors font-mono"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Color Secundario</label>
                    <div className="flex items-center gap-3">
                        <input
                            type="color"
                            value={editedTheme.secondaryColor}
                            onChange={(e) => setEditedTheme({ ...editedTheme, secondaryColor: e.target.value })}
                            className="w-12 h-12 rounded-lg cursor-pointer border-0"
                        />
                        <input
                            type="text"
                            value={editedTheme.secondaryColor}
                            onChange={(e) => setEditedTheme({ ...editedTheme, secondaryColor: e.target.value })}
                            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none transition-colors font-mono"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Color Acento</label>
                    <div className="flex items-center gap-3">
                        <input
                            type="color"
                            value={editedTheme.accentColor}
                            onChange={(e) => setEditedTheme({ ...editedTheme, accentColor: e.target.value })}
                            className="w-12 h-12 rounded-lg cursor-pointer border-0"
                        />
                        <input
                            type="text"
                            value={editedTheme.accentColor}
                            onChange={(e) => setEditedTheme({ ...editedTheme, accentColor: e.target.value })}
                            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none transition-colors font-mono"
                        />
                    </div>
                </div>
            </div>

            {/* Preview */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <label className="block text-sm font-medium text-gray-400 mb-4">Vista Previa</label>
                <div className="flex items-center gap-4">
                    <button
                        className="px-6 py-3 rounded-xl font-bold text-white transition-all"
                        style={{ background: `linear-gradient(to right, ${editedTheme.primaryColor}, ${editedTheme.secondaryColor})` }}
                    >
                        Botón Primario
                    </button>
                    <button
                        className="px-6 py-3 rounded-xl font-bold border-2 transition-all"
                        style={{ borderColor: editedTheme.primaryColor, color: editedTheme.primaryColor }}
                    >
                        Botón Secundario
                    </button>
                    <span style={{ color: editedTheme.accentColor }} className="font-bold">
                        Texto Acento
                    </span>
                </div>
            </div>

            {/* Save Button */}
            <motion.button
                onClick={handleSave}
                disabled={saving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-lg shadow-purple-900/30"
            >
                {saving ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Guardando...
                    </>
                ) : (
                    <>
                        <Save className="w-5 h-5" />
                        Guardar Tema
                    </>
                )}
            </motion.button>
        </div>
    );
};

// Componente de Editor de Textos del Hero
const HeroEditor = ({ hero, brand, onSaveHero, onSaveBrand }) => {
    const [editedHero, setEditedHero] = useState(hero);
    const [editedBrand, setEditedBrand] = useState(brand);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setEditedHero(hero);
        setEditedBrand(brand);
    }, [hero, brand]);

    const handleSave = async () => {
        setSaving(true);
        await onSaveHero(editedHero);
        await onSaveBrand(editedBrand);
        setSaving(false);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Type className="w-6 h-6 text-blue-400" />
                Textos y Contenido
            </h2>

            {/* Brand Info */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <h3 className="font-bold text-white text-lg">Información de Marca</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Nombre del Curso</label>
                        <input
                            type="text"
                            value={editedBrand.name}
                            onChange={(e) => setEditedBrand({ ...editedBrand, name: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Eslogan</label>
                        <input
                            type="text"
                            value={editedBrand.tagline}
                            onChange={(e) => setEditedBrand({ ...editedBrand, tagline: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">WhatsApp (con código país)</label>
                        <input
                            type="text"
                            value={editedBrand.whatsappNumber}
                            onChange={(e) => setEditedBrand({ ...editedBrand, whatsappNumber: e.target.value })}
                            placeholder="573001234567"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Año</label>
                        <input
                            type="text"
                            value={editedBrand.year}
                            onChange={(e) => setEditedBrand({ ...editedBrand, year: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none transition-colors"
                        />
                    </div>
                </div>
            </div>

            {/* Hero Texts */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <h3 className="font-bold text-white text-lg">Sección Hero</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Badge (etiqueta superior)</label>
                        <input
                            type="text"
                            value={editedHero.badge}
                            onChange={(e) => setEditedHero({ ...editedHero, badge: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Título (parte normal)</label>
                        <input
                            type="text"
                            value={editedHero.title}
                            onChange={(e) => setEditedHero({ ...editedHero, title: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Título (parte destacada)</label>
                        <input
                            type="text"
                            value={editedHero.titleHighlight}
                            onChange={(e) => setEditedHero({ ...editedHero, titleHighlight: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none transition-colors"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-400 mb-2">Subtítulo</label>
                        <textarea
                            value={editedHero.subtitle}
                            onChange={(e) => setEditedHero({ ...editedHero, subtitle: e.target.value })}
                            rows={2}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none transition-colors resize-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Texto Botón Principal</label>
                        <input
                            type="text"
                            value={editedHero.ctaText}
                            onChange={(e) => setEditedHero({ ...editedHero, ctaText: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Texto Botón Secundario</label>
                        <input
                            type="text"
                            value={editedHero.ctaSecondaryText}
                            onChange={(e) => setEditedHero({ ...editedHero, ctaSecondaryText: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none transition-colors"
                        />
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <motion.button
                onClick={handleSave}
                disabled={saving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-lg shadow-blue-900/30"
            >
                {saving ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Guardando...
                    </>
                ) : (
                    <>
                        <Save className="w-5 h-5" />
                        Guardar Contenido
                    </>
                )}
            </motion.button>
        </div>
    );
};

// Componente de Editor de Timeline/Cronograma
const TimelineEditor = ({ timeline, onSave }) => {
    const [editedTimeline, setEditedTimeline] = useState(timeline || []);
    const [expandedPhase, setExpandedPhase] = useState(null);
    const [saving, setSaving] = useState(false);
    const formatPrice = useFormatPrice();

    useEffect(() => {
        setEditedTimeline(timeline || []);
    }, [timeline]);

    const handlePhaseChange = (index, field, value) => {
        const updated = [...editedTimeline];
        updated[index] = { ...updated[index], [field]: value };
        setEditedTimeline(updated);
    };

    const addPhase = () => {
        setEditedTimeline([...editedTimeline, {
            id: `fase-${Date.now()}`,
            title: "Nueva Fase",
            dateLabel: "Fecha",
            targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            unlockDate: new Date().toISOString().split('T')[0],
            description: "Descripción de la fase",
            price: 300000,
            basePrice: 500000,
            savingsText: "$200.000 (40% OFF)"
        }]);
    };

    const removePhase = (index) => {
        if (confirm('¿Estás seguro de eliminar esta fase?')) {
            const updated = [...editedTimeline];
            updated.splice(index, 1);
            setEditedTimeline(updated);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        await onSave(editedTimeline);
        setSaving(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Clock className="w-6 h-6 text-orange-400" />
                    Cronograma de Fases
                </h2>
                <button
                    onClick={addPhase}
                    className="px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-400 rounded-lg text-sm font-medium flex items-center gap-2 transition-all"
                >
                    <Plus className="w-4 h-4" />
                    Agregar Fase
                </button>
            </div>

            <p className="text-gray-400 text-sm">
                Edita las fases de venta y sus precios. Los cambios se reflejan inmediatamente en el cronograma del sitio.
            </p>

            <div className="space-y-4">
                {editedTimeline.map((phase, index) => (
                    <motion.div
                        key={phase.id || index}
                        layout
                        className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden"
                    >
                        {/* Phase Header */}
                        <div
                            className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                            onClick={() => setExpandedPhase(expandedPhase === index ? null : index)}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold">
                                    {index + 1}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{phase.title}</h3>
                                    <p className="text-sm text-gray-400">
                                        {phase.price ? formatPrice(phase.price) : phase.priceText || 'Sin precio'}
                                        <span className="ml-2 text-gray-500">• {phase.dateLabel}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {expandedPhase === index ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                            </div>
                        </div>

                        {/* Phase Details (Collapsible) */}
                        <AnimatePresence>
                            {expandedPhase === index && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="border-t border-white/10"
                                >
                                    <div className="p-6 space-y-6">
                                        {/* Basic Info */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">Título de la Fase</label>
                                                <input
                                                    type="text"
                                                    value={phase.title}
                                                    onChange={(e) => handlePhaseChange(index, 'title', e.target.value)}
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-orange-500 focus:outline-none transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">Etiqueta de Fecha</label>
                                                <input
                                                    type="text"
                                                    value={phase.dateLabel}
                                                    onChange={(e) => handlePhaseChange(index, 'dateLabel', e.target.value)}
                                                    placeholder="Ej: Hasta 10 Dic"
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-orange-500 focus:outline-none transition-colors"
                                                />
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Descripción</label>
                                            <input
                                                type="text"
                                                value={phase.description}
                                                onChange={(e) => handlePhaseChange(index, 'description', e.target.value)}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-orange-500 focus:outline-none transition-colors"
                                            />
                                        </div>

                                        {/* Dates */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                                    <Calendar className="w-4 h-4 inline mr-1" />
                                                    Fecha Objetivo (Cierre)
                                                </label>
                                                <input
                                                    type="date"
                                                    value={phase.targetDate}
                                                    onChange={(e) => handlePhaseChange(index, 'targetDate', e.target.value)}
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-orange-500 focus:outline-none transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                                    <Calendar className="w-4 h-4 inline mr-1" />
                                                    Fecha de Desbloqueo
                                                </label>
                                                <input
                                                    type="date"
                                                    value={phase.unlockDate}
                                                    onChange={(e) => handlePhaseChange(index, 'unlockDate', e.target.value)}
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-orange-500 focus:outline-none transition-colors"
                                                />
                                            </div>
                                        </div>

                                        {/* Pricing */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">Precio Oferta</label>
                                                <input
                                                    type="number"
                                                    value={phase.price || ''}
                                                    onChange={(e) => handlePhaseChange(index, 'price', e.target.value ? parseInt(e.target.value) : null)}
                                                    placeholder="Dejar vacío para texto"
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-orange-500 focus:outline-none transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">Precio Base</label>
                                                <input
                                                    type="number"
                                                    value={phase.basePrice}
                                                    onChange={(e) => handlePhaseChange(index, 'basePrice', parseInt(e.target.value))}
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-orange-500 focus:outline-none transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">Texto de Ahorro</label>
                                                <input
                                                    type="text"
                                                    value={phase.savingsText}
                                                    onChange={(e) => handlePhaseChange(index, 'savingsText', e.target.value)}
                                                    placeholder="Ej: $125.000 (25% OFF)"
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-orange-500 focus:outline-none transition-colors"
                                                />
                                            </div>
                                        </div>

                                        {/* Text for price (when no numeric price) */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Texto alternativo de precio (opcional)</label>
                                            <input
                                                type="text"
                                                value={phase.priceText || ''}
                                                onChange={(e) => handlePhaseChange(index, 'priceText', e.target.value)}
                                                placeholder="Ej: Última Oportunidad (solo si no hay precio numérico)"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-orange-500 focus:outline-none transition-colors"
                                            />
                                        </div>

                                        {/* Delete Phase Button */}
                                        <button
                                            onClick={() => removePhase(index)}
                                            className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Eliminar Fase
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            {/* Save Button */}
            <motion.button
                onClick={handleSave}
                disabled={saving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-lg shadow-orange-900/30"
            >
                {saving ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Guardando...
                    </>
                ) : (
                    <>
                        <Save className="w-5 h-5" />
                        Guardar Cronograma
                    </>
                )}
            </motion.button>
        </div>
    );
};

// Componente Principal del Panel de Admin
const AdminPanel = () => {
    const { user, isAdmin, logout, loading: authLoading } = useAuth();
    const { config, loading: configLoading, updatePlans, updateTheme, updateHero, updateBrand, updateTimeline } = useSiteConfig();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showPreview, setShowPreview] = useState(false);

    // Si está cargando
    if (authLoading || configLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Cargando panel de administración...</p>
                </div>
            </div>
        );
    }

    // Si no está autenticado o no es admin
    if (!user || !isAdmin) {
        return <AdminLogin />;
    }

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-red-400' },
        { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'text-cyan-400' },
        { id: 'plans', label: 'Planes', icon: DollarSign, color: 'text-green-400' },
        { id: 'timeline', label: 'Cronograma', icon: Clock, color: 'text-orange-400' },
        { id: 'theme', label: 'Tema', icon: Palette, color: 'text-purple-400' },
        { id: 'content', label: 'Contenido', icon: Type, color: 'text-blue-400' },
        { id: 'github', label: 'GitHub', icon: Github, color: 'text-gray-400' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
                <div className="container mx-auto px-4">
                    <div className="h-16 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                                <Settings className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="font-bold text-white">Panel de Admin</h1>
                                <p className="text-xs text-gray-400">Seamos Genios</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Preview Toggle */}
                            <button
                                onClick={() => setShowPreview(!showPreview)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${showPreview
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                    : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                                    }`}
                            >
                                {showPreview ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                {showPreview ? 'Ver Sitio' : 'Preview'}
                            </button>

                            {/* User Info */}
                            <div className="flex items-center gap-3">
                                {user.photoURL && (
                                    <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full" />
                                )}
                                <div className="hidden md:block">
                                    <p className="text-sm font-medium text-white">{user.displayName}</p>
                                    <p className="text-xs text-gray-400">{user.email}</p>
                                </div>
                            </div>

                            {/* Logout */}
                            <button
                                onClick={logout}
                                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                title="Cerrar sesión"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Preview Frame */}
            <AnimatePresence>
                {showPreview && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-black/90 pt-16"
                    >
                        <div className="h-full p-4">
                            <div className="h-full bg-white rounded-2xl overflow-hidden shadow-2xl">
                                <iframe
                                    src="/"
                                    className="w-full h-full border-0"
                                    title="Vista previa del sitio"
                                />
                            </div>
                        </div>
                        <button
                            onClick={() => setShowPreview(false)}
                            className="absolute top-20 right-8 p-3 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-white/10 text-white border border-white/20'
                                    : 'text-gray-400 hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${activeTab === tab.id ? tab.color : ''}`} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className={activeTab === 'dashboard' || activeTab === 'analytics' ? 'max-w-full' : 'max-w-4xl'}>
                    <AnimatePresence mode="wait">
                        {activeTab === 'dashboard' && (
                            <motion.div
                                key="dashboard"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <GridDashboard />
                            </motion.div>
                        )}
                        {activeTab === 'analytics' && (
                            <motion.div
                                key="analytics"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <AnalyticsDashboard />
                            </motion.div>
                        )}
                        {activeTab === 'plans' && (
                            <motion.div
                                key="plans"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <PlansEditor plans={config.plans} onSave={updatePlans} />
                            </motion.div>
                        )}
                        {activeTab === 'timeline' && (
                            <motion.div
                                key="timeline"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <TimelineEditor timeline={config.timeline} onSave={updateTimeline} />
                            </motion.div>
                        )}
                        {activeTab === 'theme' && (
                            <motion.div
                                key="theme"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <ThemeEditor theme={config.theme} onSave={updateTheme} />
                            </motion.div>
                        )}
                        {activeTab === 'content' && (
                            <motion.div
                                key="content"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <HeroEditor
                                    hero={config.hero}
                                    brand={config.brand}
                                    onSaveHero={updateHero}
                                    onSaveBrand={updateBrand}
                                />
                            </motion.div>
                        )}
                        {activeTab === 'github' && (
                            <motion.div
                                key="github"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <GitHubIntegration />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Last Updated Info */}
                {config.lastUpdated && (
                    <div className="mt-8 text-center text-gray-500 text-sm">
                        <RefreshCw className="w-4 h-4 inline mr-2" />
                        Última actualización: {new Date(config.lastUpdated).toLocaleString('es-CO')}
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminPanel;
