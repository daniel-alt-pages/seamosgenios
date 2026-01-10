// Servicio para integración con GitHub desde el panel de admin
// Maneja el token con expiración de 30 minutos en sessionStorage

const GITHUB_TOKEN_KEY = 'admin_github_token';
const GITHUB_TOKEN_EXPIRY_KEY = 'admin_github_token_expiry';
const TOKEN_DURATION_MS = 30 * 60 * 1000; // 30 minutos

// Configuración del repositorio
const REPO_CONFIG = {
    owner: 'daniel-alt-pages',
    repo: 'seamosgenios',
    branch: 'main'
};

/**
 * Verifica si hay un token válido guardado
 */
export function hasValidToken() {
    const token = sessionStorage.getItem(GITHUB_TOKEN_KEY);
    const expiry = sessionStorage.getItem(GITHUB_TOKEN_EXPIRY_KEY);

    if (!token || !expiry) return false;

    const expiryTime = parseInt(expiry, 10);
    if (Date.now() > expiryTime) {
        // Token expirado, limpiar
        clearToken();
        return false;
    }

    return true;
}

/**
 * Obtiene el token guardado
 */
export function getToken() {
    if (!hasValidToken()) return null;
    return sessionStorage.getItem(GITHUB_TOKEN_KEY);
}

/**
 * Guarda el token con expiración de 30 minutos
 */
export function saveToken(token) {
    const expiry = Date.now() + TOKEN_DURATION_MS;
    sessionStorage.setItem(GITHUB_TOKEN_KEY, token);
    sessionStorage.setItem(GITHUB_TOKEN_EXPIRY_KEY, expiry.toString());
}

/**
 * Limpia el token guardado
 */
export function clearToken() {
    sessionStorage.removeItem(GITHUB_TOKEN_KEY);
    sessionStorage.removeItem(GITHUB_TOKEN_EXPIRY_KEY);
}

/**
 * Obtiene el tiempo restante del token en minutos
 */
export function getTokenRemainingTime() {
    const expiry = sessionStorage.getItem(GITHUB_TOKEN_EXPIRY_KEY);
    if (!expiry) return 0;

    const remaining = parseInt(expiry, 10) - Date.now();
    return Math.max(0, Math.ceil(remaining / 60000)); // en minutos
}

/**
 * Valida el token haciendo una petición a la API de GitHub
 */
export async function validateToken(token) {
    try {
        const response = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (response.ok) {
            const user = await response.json();
            return { valid: true, user };
        }

        return { valid: false, error: 'Token inválido' };
    } catch (error) {
        return { valid: false, error: error.message };
    }
}

/**
 * Obtiene el contenido de un archivo del repositorio
 */
export async function getFileContent(path) {
    const token = getToken();
    if (!token) throw new Error('No hay token válido');

    const response = await fetch(
        `https://api.github.com/repos/${REPO_CONFIG.owner}/${REPO_CONFIG.repo}/contents/${path}?ref=${REPO_CONFIG.branch}`,
        {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        }
    );

    if (!response.ok) {
        throw new Error(`Error obteniendo archivo: ${response.statusText}`);
    }

    const data = await response.json();
    return {
        content: atob(data.content),
        sha: data.sha
    };
}

/**
 * Hace commit de cambios a un archivo
 */
export async function commitFile(path, content, message, sha = null) {
    const token = getToken();
    if (!token) throw new Error('No hay token válido');

    // Si no tenemos el SHA, obtenerlo primero
    let fileSha = sha;
    if (!fileSha) {
        try {
            const fileData = await getFileContent(path);
            fileSha = fileData.sha;
        } catch (e) {
            // Archivo nuevo, no necesita SHA
            fileSha = null;
        }
    }

    const body = {
        message,
        content: btoa(unescape(encodeURIComponent(content))),
        branch: REPO_CONFIG.branch
    };

    if (fileSha) {
        body.sha = fileSha;
    }

    const response = await fetch(
        `https://api.github.com/repos/${REPO_CONFIG.owner}/${REPO_CONFIG.repo}/contents/${path}`,
        {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al hacer commit');
    }

    return await response.json();
}

/**
 * Obtener lista de commits recientes
 */
export async function getRecentCommits(limit = 5) {
    const token = getToken();
    if (!token) throw new Error('No hay token válido');

    const response = await fetch(
        `https://api.github.com/repos/${REPO_CONFIG.owner}/${REPO_CONFIG.repo}/commits?per_page=${limit}`,
        {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        }
    );

    if (!response.ok) {
        throw new Error('Error obteniendo commits');
    }

    return await response.json();
}

/**
 * Actualiza la configuración del repositorio
 */
export function setRepoConfig(owner, repo, branch = 'main') {
    REPO_CONFIG.owner = owner;
    REPO_CONFIG.repo = repo;
    REPO_CONFIG.branch = branch;
}

/**
 * Obtiene la configuración actual del repositorio
 */
export function getRepoConfig() {
    return { ...REPO_CONFIG };
}

/**
 * Hace commit de múltiples archivos en un solo commit usando Git Data API
 * @param {string} token - Token de GitHub
 * @param {string} owner - Dueño del repositorio
 * @param {string} repo - Nombre del repositorio
 * @param {Array} files - Array de { path, content }
 * @param {string} message - Mensaje del commit
 */
export async function commitMultipleFiles(token, owner, repo, files, message) {
    const apiBase = `https://api.github.com/repos/${owner}/${repo}`;
    const headers = {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
    };

    try {
        // 1. Obtener la referencia del branch actual
        const refResponse = await fetch(`${apiBase}/git/ref/heads/${REPO_CONFIG.branch}`, { headers });
        if (!refResponse.ok) throw new Error('Error obteniendo referencia del branch');
        const refData = await refResponse.json();
        const latestCommitSha = refData.object.sha;

        // 2. Obtener el tree del commit actual
        const commitResponse = await fetch(`${apiBase}/git/commits/${latestCommitSha}`, { headers });
        if (!commitResponse.ok) throw new Error('Error obteniendo commit');
        const commitData = await commitResponse.json();
        const baseTreeSha = commitData.tree.sha;

        // 3. Crear blobs para cada archivo
        const treeItems = await Promise.all(files.map(async (file) => {
            const blobResponse = await fetch(`${apiBase}/git/blobs`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    content: file.content,
                    encoding: 'utf-8'
                })
            });
            if (!blobResponse.ok) throw new Error(`Error creando blob para ${file.path}`);
            const blobData = await blobResponse.json();

            return {
                path: file.path,
                mode: '100644',
                type: 'blob',
                sha: blobData.sha
            };
        }));

        // 4. Crear nuevo tree
        const treeResponse = await fetch(`${apiBase}/git/trees`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                base_tree: baseTreeSha,
                tree: treeItems
            })
        });
        if (!treeResponse.ok) throw new Error('Error creando tree');
        const treeData = await treeResponse.json();

        // 5. Crear nuevo commit
        const newCommitResponse = await fetch(`${apiBase}/git/commits`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                message,
                tree: treeData.sha,
                parents: [latestCommitSha]
            })
        });
        if (!newCommitResponse.ok) throw new Error('Error creando commit');
        const newCommitData = await newCommitResponse.json();

        // 6. Actualizar referencia del branch
        const updateRefResponse = await fetch(`${apiBase}/git/refs/heads/${REPO_CONFIG.branch}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({
                sha: newCommitData.sha
            })
        });
        if (!updateRefResponse.ok) throw new Error('Error actualizando referencia');

        return { success: true, commit: newCommitData };
    } catch (error) {
        console.error('Error in commitMultipleFiles:', error);
        return { success: false, error: error.message };
    }
}

export default {
    hasValidToken,
    getToken,
    saveToken,
    clearToken,
    getTokenRemainingTime,
    validateToken,
    getFileContent,
    commitFile,
    commitMultipleFiles,
    getRecentCommits,
    setRepoConfig,
    getRepoConfig
};
