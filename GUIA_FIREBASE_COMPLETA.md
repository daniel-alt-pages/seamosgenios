# 🔥 GUÍA COMPLETA: Configuración de Firebase para Panel de Administración

## 📋 Índice

1. [Habilitar Google Authentication](#1-habilitar-google-authentication)
2. [Configurar Reglas de Firestore](#2-configurar-reglas-de-firestore)
3. [Verificar Colecciones en Firestore](#3-verificar-colecciones-en-firestore)
4. [Probar el Panel de Admin](#4-probar-el-panel-de-admin)
5. [Solución de Problemas](#5-solución-de-problemas)

---

## 1. Habilitar Google Authentication

### Paso 1.1: Abrir Firebase Console

1. Abre tu navegador y ve a: **<https://console.firebase.google.com/>**
2. Inicia sesión con tu cuenta de Google
3. Selecciona el proyecto **"seamosgenios-94122"**

### Paso 1.2: Navegar a Authentication

1. En el menú lateral izquierdo, haz clic en **"Build"** (Compilar)
2. Luego haz clic en **"Authentication"**

### Paso 1.3: Habilitar proveedor de Google

1. Haz clic en la pestaña **"Sign-in method"** (Método de inicio de sesión)
2. En la lista de proveedores, busca **"Google"** y haz clic en él
3. Activa el toggle **"Enable"** (Habilitar)
4. En **"Project support email"**, selecciona tu email: `danielff999gf@gmail.com`
5. Haz clic en **"Save"** (Guardar)

```
✅ Resultado esperado: Google aparecerá como "Enabled" (Habilitado) en la lista
```

### Paso 1.4: Configurar dominios autorizados

1. En la misma sección de Authentication, ve a la pestaña **"Settings"** (Configuración)
2. Haz clic en **"Authorized domains"** (Dominios autorizados)
3. Verifica que estos dominios estén en la lista:
   - `localhost`
   - `seamosgenios-94122.firebaseapp.com`
   - `seamosgenios-94122.web.app`
4. Si falta alguno, haz clic en **"Add domain"** y agrégalo

---

## 2. Configurar Reglas de Firestore

### Paso 2.1: Navegar a Firestore Rules

1. En el menú lateral, haz clic en **"Build"** → **"Firestore Database"**
2. Haz clic en la pestaña **"Rules"** (Reglas)

### Paso 2.2: Copiar y pegar las reglas

1. Borra todo el contenido actual
2. Copia y pega exactamente este código:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // ✅ Configuración del sitio - Lectura pública, escritura con autenticación
    match /site_config/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // ✅ Lista de administradores
    match /admins/{email} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // ✅ Logs de administración
    match /admin_logs/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

1. Haz clic en **"Publish"** (Publicar)

```
✅ Resultado esperado: Mensaje "Rules published" (Reglas publicadas)
```

---

## 3. Verificar Colecciones en Firestore

### Paso 3.1: Navegar a los datos

1. En Firestore Database, haz clic en la pestaña **"Data"** (Datos)

### Paso 3.2: Verificar colección "admins"

1. Busca la colección **"admins"** en el panel izquierdo
2. Dentro debería haber un documento con ID: `danielff999gf@gmail.com`
3. El documento debe contener:

   ```
   isActive: true (boolean)
   name: "Daniel" (string)
   role: "superadmin" (string)
   createdAt: "2024-12-30T..." (string)
   ```

### Paso 3.3: Verificar colección "site_config"

1. Busca la colección **"site_config"**
2. Dentro debería haber un documento con ID: `main`
3. El documento contiene toda la configuración del sitio (plans, theme, hero, etc.)

### Si las colecciones NO existen

Ejecuta nuevamente el script de inicialización:

```bash
node scripts/initFirestore.mjs
```

---

## 4. Probar el Panel de Admin

### Paso 4.1: Reiniciar el servidor de desarrollo

1. En tu terminal, detén el servidor actual (Ctrl+C)
2. Ejecuta nuevamente:

```bash
npm run dev
```

### Paso 4.2: Acceder al panel de admin

1. Abre tu navegador
2. Ve a: **<http://localhost:5173/admin>**

### Paso 4.3: Iniciar sesión con Google

1. Haz clic en el botón **"Iniciar con Google"**
2. Aparecerá una ventana popup de Google
3. Selecciona tu cuenta: `danielff999gf@gmail.com`
4. Acepta los permisos

```
✅ Resultado esperado: Entras al panel de administración con las pestañas:
   - Planes
   - Tema  
   - Contenido
```

### Paso 4.4: Probar edición de precios

1. En la pestaña **"Planes"**, haz clic en un plan para expandirlo
2. Cambia el precio (ej: de 250000 a 275000)
3. Haz clic en **"Guardar Cambios"**
4. Abre otra pestaña con: **<http://localhost:5173/>**
5. ¡Verifica que el nuevo precio aparece inmediatamente!

---

## 5. Solución de Problemas

### ❌ Error: "No tienes permisos de administrador"

**Causa:** Tu email no está en la lista de admins.
**Solución:**

1. Ve a Firestore → Data → admins
2. Crea un documento con ID: `danielff999gf@gmail.com`
3. Agrega el campo: `isActive: true` (boolean)

### ❌ Error: "Missing or insufficient permissions"

**Causa:** Las reglas de Firestore no están configuradas.
**Solución:**

1. Ve a Firestore → Rules
2. Copia las reglas del Paso 2.2
3. Publica las reglas

### ❌ Error: Popup de Google no aparece

**Causa:** Google Auth no está habilitado.
**Solución:**

1. Ve a Authentication → Sign-in method
2. Habilita Google como proveedor
3. Guarda los cambios

### ❌ Error: "auth/popup-blocked"

**Causa:** El navegador bloqueó la ventana popup.
**Solución:**

1. Busca el icono de popup bloqueado en la barra de direcciones
2. Permite popups para localhost
3. Recarga la página e intenta de nuevo

### ❌ La página muestra "Cargando..." indefinidamente

**Causa:** Error de conexión con Firestore.
**Solución:**

1. Verifica que el archivo `.env` tenga las credenciales correctas
2. Reinicia el servidor de desarrollo
3. Revisa la consola del navegador (F12) para ver errores

---

## 📱 URLs Importantes

| Recurso | URL |
|---------|-----|
| Firebase Console | <https://console.firebase.google.com/project/seamosgenios-94122> |
| Authentication | <https://console.firebase.google.com/project/seamosgenios-94122/authentication> |
| Firestore Data | <https://console.firebase.google.com/project/seamosgenios-94122/firestore/data> |
| Firestore Rules | <https://console.firebase.google.com/project/seamosgenios-94122/firestore/rules> |
| Panel Admin Local | <http://localhost:5173/admin> |
| Sitio Local | <http://localhost:5173/> |

---

## ✅ Checklist Final

- [ ] Google Authentication habilitado
- [ ] Email de soporte configurado
- [ ] Reglas de Firestore publicadas
- [ ] Colección `admins` existe con tu email
- [ ] Colección `site_config` existe con documento `main`
- [ ] Servidor de desarrollo reiniciado
- [ ] Login exitoso en /admin
- [ ] Cambios se guardan y reflejan en el sitio

---

## 🎉 ¡Listo

Una vez completados todos los pasos, podrás:

- ✏️ Editar precios y planes
- 🎨 Cambiar colores del tema
- 📝 Modificar textos del sitio
- 👀 Ver cambios en tiempo real

Los cambios se guardan en Firebase y se reflejan **inmediatamente** para todos los usuarios.
