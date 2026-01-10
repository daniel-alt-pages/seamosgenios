// Sistema de guardado de cambios con drafts locales y commit a GitHub
import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Save, Upload, Cloud, CloudOff, Check, X, Loader2,
    Eye, RotateCcw, History, Github, AlertTriangle
} from 'lucide-react';
import { getToken, hasValidToken, getRepoConfig, commitMultipleFiles } from '../../services/githubService';

// Context para el sistema de cambios
const ChangesContext = createContext(null);

// Hook para usar el sistema de cambios
export function useChanges() {
    const context = useContext(ChangesContext);
    if (!context) {
        throw new Error('useChanges must be used within ChangesProvider');
    }
    return context;
}

// Provider del sistema de cambios
export function ChangesProvider({ children }) {
    const [pendingChanges, setPendingChanges] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [commitStatus, setCommitStatus] = useState(null); // 'success' | 'error' | null

    // Cargar drafts al iniciar
    useEffect(() => {
        const savedDrafts = localStorage.getItem('admin_drafts');
        if (savedDrafts) {
            try {
                setPendingChanges(JSON.parse(savedDrafts));
            } catch (e) {
                console.warn('Error loading drafts:', e);
            }
        }
    }, []);

    // Guardar draft localmente
    const saveDraft = useCallback((key, data) => {
        setPendingChanges(prev => {
            const updated = { ...prev, [key]: { data, timestamp: Date.now() } };
            localStorage.setItem('admin_drafts', JSON.stringify(updated));
            return updated;
        });
        setLastSaved(Date.now());
    }, []);

    // Eliminar un draft específico
    const discardDraft = useCallback((key) => {
        setPendingChanges(prev => {
            const updated = { ...prev };
            delete updated[key];
            localStorage.setItem('admin_drafts', JSON.stringify(updated));
            return updated;
        });
    }, []);

    // Limpiar todos los drafts
    const discardAllDrafts = useCallback(() => {
        setPendingChanges({});
        localStorage.removeItem('admin_drafts');
    }, []);

    // Verificar si hay cambios pendientes
    const hasChanges = Object.keys(pendingChanges).length > 0;

    // Commit a GitHub
    const commitToGitHub = useCallback(async (message = 'Actualización desde Admin Panel') => {
        if (!hasValidToken()) {
            setCommitStatus('error');
            return { success: false, error: 'No hay token de GitHub válido' };
        }

        if (!hasChanges) {
            return { success: true, message: 'No hay cambios pendientes' };
        }

        setIsSaving(true);
        setCommitStatus(null);

        try {
            const token = getToken();
            const { owner, repo } = getRepoConfig();

            // Preparar archivos para commit
            const files = Object.entries(pendingChanges).map(([path, { data }]) => ({
                path,
                content: typeof data === 'string' ? data : JSON.stringify(data, null, 2)
            }));

            // Hacer commit
            const result = await commitMultipleFiles(token, owner, repo, files, message);

            if (result.success) {
                discardAllDrafts();
                setCommitStatus('success');
                setTimeout(() => setCommitStatus(null), 3000);
                return { success: true };
            } else {
                setCommitStatus('error');
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('Error committing to GitHub:', error);
            setCommitStatus('error');
            return { success: false, error: error.message };
        } finally {
            setIsSaving(false);
        }
    }, [pendingChanges, hasChanges, discardAllDrafts]);

    return (
        <ChangesContext.Provider value={{
            pendingChanges,
            hasChanges,
            saveDraft,
            discardDraft,
            discardAllDrafts,
            commitToGitHub,
            isSaving,
            lastSaved,
            commitStatus
        }}>
            {children}
        </ChangesContext.Provider>
    );
}

// Barra flotante de estado de cambios
export function ChangesStatusBar() {
    const {
        hasChanges,
        pendingChanges,
        commitToGitHub,
        discardAllDrafts,
        isSaving,
        commitStatus
    } = useChanges();

    const [showConfirm, setShowConfirm] = useState(false);
    const [commitMessage, setCommitMessage] = useState('');
    const hasToken = hasValidToken();
    const changesCount = Object.keys(pendingChanges).length;

    if (!hasChanges && !commitStatus) return null;

    const handleCommit = async () => {
        const result = await commitToGitHub(commitMessage || 'Actualización desde Admin Panel');
        if (result.success) {
            setShowConfirm(false);
            setCommitMessage('');
        }
    };

    return (
        <>
            {/* Barra flotante */}
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
            >
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-black/90 backdrop-blur-xl border border-white/20 shadow-2xl">
                    {/* Indicador de cambios */}
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${hasChanges ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
                        <span className="text-sm text-gray-300">
                            {commitStatus === 'success' ? (
                                <span className="text-green-400 flex items-center gap-1">
                                    <Check size={14} /> Publicado
                                </span>
                            ) : commitStatus === 'error' ? (
                                <span className="text-red-400 flex items-center gap-1">
                                    <X size={14} /> Error
                                </span>
                            ) : (
                                `${changesCount} cambio${changesCount !== 1 ? 's' : ''} pendiente${changesCount !== 1 ? 's' : ''}`
                            )}
                        </span>
                    </div>

                    {/* Separador */}
                    <div className="w-px h-6 bg-white/20" />

                    {/* Descartar */}
                    <button
                        onClick={discardAllDrafts}
                        disabled={isSaving || !hasChanges}
                        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
                        title="Descartar cambios"
                    >
                        <RotateCcw size={18} />
                    </button>

                    {/* Guardar localmente */}
                    <button
                        onClick={() => { }}
                        className="p-2 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-all"
                        title="Guardado automático activo"
                    >
                        <Cloud size={18} />
                    </button>

                    {/* Publicar a GitHub */}
                    <button
                        onClick={() => setShowConfirm(true)}
                        disabled={isSaving || !hasChanges || !hasToken}
                        className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all ${hasToken
                                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            } disabled:opacity-50`}
                    >
                        {isSaving ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Upload size={16} />
                        )}
                        {isSaving ? 'Publicando...' : 'Publicar'}
                    </button>
                </div>
            </motion.div>

            {/* Modal de confirmación */}
            <AnimatePresence>
                {showConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
                        onClick={() => setShowConfirm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-md p-6 rounded-2xl bg-[#1a1a1a] border border-white/10"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                                    <Github className="text-green-400" size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Publicar cambios</h3>
                                    <p className="text-sm text-gray-400">{changesCount} archivo(s) modificado(s)</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Mensaje del commit
                                </label>
                                <input
                                    type="text"
                                    value={commitMessage}
                                    onChange={e => setCommitMessage(e.target.value)}
                                    placeholder="Ej: Actualización de precios"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50"
                                />
                            </div>

                            <div className="mb-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                                <p className="text-sm text-yellow-300 flex items-start gap-2">
                                    <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                                    Los cambios se publicarán directamente en el repositorio de producción.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="flex-1 py-3 rounded-xl bg-white/5 text-gray-300 font-medium hover:bg-white/10 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleCommit}
                                    disabled={isSaving}
                                    className="flex-1 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Publicando...
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={16} />
                                            Publicar
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

// Componente de vista previa del sitio
export function SitePreview({ isOpen, onClose }) {
    const [device, setDevice] = useState('desktop'); // desktop | tablet | mobile

    const deviceSizes = {
        desktop: { width: '100%', height: '100%' },
        tablet: { width: '768px', height: '100%' },
        mobile: { width: '375px', height: '100%' }
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black"
        >
            {/* Header */}
            <div className="h-14 px-4 flex items-center justify-between bg-[#0a0a0a] border-b border-white/10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <X size={20} />
                    </button>
                    <span className="text-white font-medium">Vista Previa</span>
                </div>

                {/* Device Switcher */}
                <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5">
                    {['desktop', 'tablet', 'mobile'].map(d => (
                        <button
                            key={d}
                            onClick={() => setDevice(d)}
                            className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${device === d
                                    ? 'bg-white/10 text-white'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {d.charAt(0).toUpperCase() + d.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="w-20" /> {/* Spacer */}
            </div>

            {/* Preview Frame */}
            <div className="h-[calc(100%-3.5rem)] flex items-center justify-center p-4 bg-[#1a1a1a]">
                <div
                    className="h-full bg-white rounded-lg overflow-hidden shadow-2xl transition-all duration-300"
                    style={deviceSizes[device]}
                >
                    <iframe
                        src="/"
                        className="w-full h-full border-0"
                        title="Vista previa del sitio"
                    />
                </div>
            </div>
        </motion.div>
    );
}

export default ChangesProvider;
