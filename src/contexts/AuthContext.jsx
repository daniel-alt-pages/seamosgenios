// Context de autenticación para administradores
import { createContext, useContext, useState, useEffect } from 'react';
import {
    signInWithPopup,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';

const AuthContext = createContext(null);

// Lista de emails autorizados como administradores
// Esto también se puede mover a Firestore para mayor flexibilidad
const ADMIN_EMAILS = [
    'danielff999gf@gmail.com',
    // Agrega más emails autorizados aquí
];

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Verificar si el usuario es admin
    const checkAdminStatus = async (userEmail) => {
        // Primero verificar en la lista local
        if (ADMIN_EMAILS.includes(userEmail)) {
            return true;
        }

        // Luego verificar en Firestore
        try {
            const adminDoc = await getDoc(doc(db, 'admins', userEmail));
            return adminDoc.exists() && adminDoc.data()?.isActive === true;
        } catch (err) {
            console.error("Error checking admin status:", err);
            return false;
        }
    };

    // Escuchar cambios de autenticación
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const adminStatus = await checkAdminStatus(firebaseUser.email);
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    photoURL: firebaseUser.photoURL
                });
                setIsAdmin(adminStatus);

                // Registrar acceso del admin
                if (adminStatus) {
                    try {
                        await setDoc(doc(db, 'admin_logs', firebaseUser.uid), {
                            email: firebaseUser.email,
                            lastAccess: new Date().toISOString(),
                            displayName: firebaseUser.displayName
                        }, { merge: true });
                    } catch (err) {
                        console.error("Error logging admin access:", err);
                    }
                }
            } else {
                setUser(null);
                setIsAdmin(false);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Login con Google
    const loginWithGoogle = async () => {
        setError(null);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const adminStatus = await checkAdminStatus(result.user.email);

            if (!adminStatus) {
                await signOut(auth);
                setError('No tienes permisos de administrador. Contacta al administrador del sistema.');
                return false;
            }

            return true;
        } catch (err) {
            console.error("Error signing in with Google:", err);
            setError(err.message);
            return false;
        }
    };

    // Login con email/password (para casos especiales)
    const loginWithEmail = async (email, password) => {
        setError(null);
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            const adminStatus = await checkAdminStatus(result.user.email);

            if (!adminStatus) {
                await signOut(auth);
                setError('No tienes permisos de administrador.');
                return false;
            }

            return true;
        } catch (err) {
            console.error("Error signing in:", err);
            setError(err.message);
            return false;
        }
    };

    // Cerrar sesión
    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setIsAdmin(false);
        } catch (err) {
            console.error("Error signing out:", err);
            setError(err.message);
        }
    };

    const value = {
        user,
        isAdmin,
        loading,
        error,
        loginWithGoogle,
        loginWithEmail,
        logout,
        clearError: () => setError(null)
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook para usar la autenticación
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
