# 🔐 Configuración de Firebase para el Panel de Administración

## 1. Reglas de Firestore

Copia estas reglas en **Firebase Console > Firestore Database > Rules**:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Función para verificar si el usuario es admin
    function isAdmin() {
      return request.auth != null && 
             exists(/databases/$(database)/documents/admins/$(request.auth.token.email));
    }
    
    // Configuración del sitio - Lectura pública, escritura solo admin
    match /site_config/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Lista de administradores - Solo admins pueden leer/escribir
    match /admins/{email} {
      allow read: if request.auth != null && request.auth.token.email == email;
      allow write: if isAdmin();
    }
    
    // Logs de administración - Solo admins
    match /admin_logs/{document=**} {
      allow read, write: if isAdmin();
    }
  }
}
```

## 2. Agregar tu primer administrador

En **Firebase Console > Firestore Database > Data**, crea la siguiente estructura:

```
admins/
  └── tu-email@gmail.com (documento)
        └── isActive: true (campo boolean)
        └── name: "Tu Nombre" (campo string)
        └── createdAt: (timestamp)
```

### Pasos

1. Ve a Firebase Console > Firestore Database
2. Click en "Start collection"
3. Collection ID: `admins`
4. Document ID: tu email completo (ej: `daniel@gmail.com`)
5. Agregar campos:
   - `isActive` (boolean): `true`
   - `name` (string): Tu nombre
   - `role` (string): `superadmin`

## 3. Habilitar Google Auth

1. Ve a **Firebase Console > Authentication > Sign-in method**
2. Habilita **Google** como proveedor
3. Configura el email de soporte del proyecto

## 4. URLs autorizadas

En **Firebase Console > Authentication > Settings > Authorized domains**, agrega:

- `localhost`
- Tu dominio de producción

---

## 📋 Estructura de Firestore

### Colección: `site_config`

Documento principal: `main`

```json
{
  "brand": {
    "name": "PreICFES Seamos Genios",
    "tagline": "Tu camino al éxito académico",
    "whatsappNumber": "573008871908",
    "year": "2026"
  },
  "theme": {
    "primaryColor": "#ef4444",
    "secondaryColor": "#f97316",
    "accentColor": "#fbbf24"
  },
  "plans": [...],
  "hero": {...},
  "dates": {...},
  "lastUpdated": "2024-12-30T...",
  "updatedBy": "admin@email.com"
}
```

### Colección: `admins`

Un documento por cada administrador con su email como ID.

```json
{
  "isActive": true,
  "name": "Nombre del Admin",
  "role": "superadmin",
  "createdAt": "2024-12-30T..."
}
```

---

## 🚀 Acceso al Panel

- **URL Local**: <http://localhost:5173/admin>
- **URL Producción**: <https://tu-dominio.com/admin>

Solo los usuarios cuyo email esté en la colección `admins` podrán acceder.
