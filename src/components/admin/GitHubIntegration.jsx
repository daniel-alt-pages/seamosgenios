// Componente de integración con GitHub para el panel de admin
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Github,
    Key,
    Clock,
    Check,
    X,
    Loader2,
    GitCommit,
    Upload,
    RefreshCw,
    Eye,
    EyeOff,
    AlertTriangle,
    Shield
} from 'lucide-react';
import {
    hasValidToken,
    getToken,
    saveToken,
    clearToken,
    getTokenRemainingTime,
    validateToken,
    getRecentCommits,
    getRepoConfig,
    setRepoConfig
} from '../../services/githubService';

// Formulario para ingresar el token de GitHub
export const GitHubTokenForm = ({ onTokenValidated }) => {
    const [token, setToken] = useState('');
    const [showToken, setShowToken] = useState(false);
    const [validating, setValidating] = useState(false);
    const [error, setError] = useState(null);
    const [repoOwner, setRepoOwner] = useState('daniel-alt-pages');
    const [repoName, setRepoName] = useState('seamosgenios');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setValidating(true);

        // Validar token con GitHub API
        const result = await validateToken(token);

        if (result.valid) {
            // Guardar token con expiración de 30 min
            saveToken(token);

            // Guardar config del repo si se proporcionó
            if (repoOwner && repoName) {
                setRepoConfig(repoOwner, repoName);
            }

            onTokenValidated(result.user);
        } else {
            setError(result.error || 'Token inválido');
        }

        setValidating(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-white/5 rounded-2xl border border-white/10"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center">
                    <Github className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-white text-lg">Conectar con GitHub</h3>
                    <p className="text-sm text-gray-400">Ingresa tu Personal Access Token</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Token Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        <Key className="w-4 h-4 inline mr-1" />
                        GitHub Personal Access Token
                    </label>
                    <div className="relative">
                        <input
                            type={showToken ? 'text' : 'password'}
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                            className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-sm focus:border-gray-500 focus:outline-none transition-colors"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowToken(!showToken)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                            {showToken ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        El token se guardará por 30 minutos en tu navegador.
                    </p>
                </div>

                {/* Repo Config (Optional) */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Owner/Organización</label>
                        <input
                            type="text"
                            value={repoOwner}
                            onChange={(e) => setRepoOwner(e.target.value)}
                            placeholder="usuario o org"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-gray-500 focus:outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Repositorio</label>
                        <input
                            type="text"
                            value={repoName}
                            onChange={(e) => setRepoName(e.target.value)}
                            placeholder="nombre-del-repo"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-gray-500 focus:outline-none transition-colors"
                        />
                    </div>
                </div>

                {/* Error */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2"
                        >
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                            <span className="text-red-400 text-sm">{error}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={validating || !token}
                    className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                >
                    {validating ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Validando...
                        </>
                    ) : (
                        <>
                            <Shield className="w-5 h-5" />
                            Conectar
                        </>
                    )}
                </button>

                {/* Help text */}
                <div className="text-xs text-gray-500 text-center space-y-1">
                    <p>¿No tienes un token?</p>
                    <a
                        href="https://github.com/settings/tokens/new?scopes=repo&description=SeamosGenios%20Admin"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                    >
                        Crear token en GitHub →
                    </a>
                </div>
            </form>
        </motion.div>
    );
};

// Panel de GitHub cuando hay token válido
export const GitHubPanel = ({ user, onLogout }) => {
    const [remainingTime, setRemainingTime] = useState(getTokenRemainingTime());
    const [commits, setCommits] = useState([]);
    const [loadingCommits, setLoadingCommits] = useState(false);
    const repoConfig = getRepoConfig();

    useEffect(() => {
        // Actualizar tiempo restante cada minuto
        const interval = setInterval(() => {
            const time = getTokenRemainingTime();
            setRemainingTime(time);
            if (time <= 0) {
                clearToken();
                onLogout();
            }
        }, 60000);

        return () => clearInterval(interval);
    }, [onLogout]);

    useEffect(() => {
        loadCommits();
    }, []);

    const loadCommits = async () => {
        setLoadingCommits(true);
        try {
            const data = await getRecentCommits(5);
            setCommits(data);
        } catch (err) {
            console.error('Error loading commits:', err);
        }
        setLoadingCommits(false);
    };

    const handleLogout = () => {
        clearToken();
        onLogout();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Status Header */}
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Check className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                        <p className="font-medium text-white">Conectado como {user?.login || 'Usuario'}</p>
                        <p className="text-sm text-gray-400">{repoConfig.owner}/{repoConfig.repo}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-orange-400" />
                        <span className="text-orange-400 font-medium">{remainingTime} min</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Desconectar"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Recent Commits */}
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <GitCommit className="w-5 h-5 text-purple-400" />
                        Commits Recientes
                    </h3>
                    <button
                        onClick={loadCommits}
                        disabled={loadingCommits}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 ${loadingCommits ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {loadingCommits ? (
                    <div className="text-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
                    </div>
                ) : commits.length > 0 ? (
                    <div className="space-y-3">
                        {commits.map((commit) => (
                            <div
                                key={commit.sha}
                                className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <p className="text-sm text-white truncate">{commit.commit.message}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-gray-500 font-mono">{commit.sha.substring(0, 7)}</span>
                                    <span className="text-xs text-gray-500">•</span>
                                    <span className="text-xs text-gray-500">
                                        {new Date(commit.commit.author.date).toLocaleDateString('es-CO')}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 text-center py-4">No se pudieron cargar los commits</p>
                )}
            </div>

            {/* Info */}
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <p className="text-sm text-blue-300">
                    <strong>Nota:</strong> Los cambios de contenido (precios, textos, colores) se guardan automáticamente en Firebase.
                    GitHub se usa para versionar cambios de código cuando sea necesario.
                </p>
            </div>
        </motion.div>
    );
};

// Componente principal de GitHub Integration
const GitHubIntegration = () => {
    const [isConnected, setIsConnected] = useState(hasValidToken());
    const [githubUser, setGithubUser] = useState(null);

    useEffect(() => {
        // Verificar token al cargar
        if (hasValidToken()) {
            setIsConnected(true);
        }
    }, []);

    const handleTokenValidated = (user) => {
        setGithubUser(user);
        setIsConnected(true);
    };

    const handleLogout = () => {
        setGithubUser(null);
        setIsConnected(false);
    };

    return (
        <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                <Github className="w-6 h-6" />
                Integración GitHub
            </h2>

            {isConnected ? (
                <GitHubPanel user={githubUser} onLogout={handleLogout} />
            ) : (
                <GitHubTokenForm onTokenValidated={handleTokenValidated} />
            )}
        </div>
    );
};

export default GitHubIntegration;
