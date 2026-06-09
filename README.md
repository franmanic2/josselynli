# Joselyn Li — Panel de Administración

Panel administrativo para la venta y gestión de postres artesanales.

**Stack:** Vue 3 · Vite · TypeScript · Tailwind CSS v3 · Firebase (Auth + Firestore + Storage) · Pinia · Vue Router 4 · Chart.js

---

## Configuración inicial

### 1. Clonar e instalar dependencias

```sh
npm install
```

### 2. Configurar Firebase

Crea un proyecto en [Firebase Console](https://console.firebase.google.com/) y activa:
- **Authentication** → Método: Email/Contraseña
- **Firestore Database** → Modo producción o prueba
- **Storage** → Modo producción o prueba

Crea el usuario administrador en Authentication:
- Email: `admin@josselynli.com` (o el que prefieras)
- Contraseña: `admin123`

Copia `.env.example` a `.env` y rellena tus credenciales:

```sh
cp .env.example .env
```

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### 3. Reglas de Firestore y Storage (desarrollo)

En Firestore Rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

En Storage Rules:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. Iniciar en desarrollo

```sh
npm run dev
```

La primera vez que inicies sesión, la app carga automáticamente 5 postres y 6 ventas de ejemplo.

---

## Scripts

```sh
npm run dev        # servidor de desarrollo
npm run build      # build de producción
npm run type-check # verificación de tipos
```

---

## Estructura

```
src/
├── components/
│   ├── layout/     AppSidebar, AppTopbar, AppLayout
│   ├── ui/         MetricCard, StatusBadge, AppModal, AppToast, ConfirmModal
│   ├── postres/    DessertCard, DessertGrid, DessertFormModal, SaleModal
│   └── ventas/     VentasTable, VentasFilters
├── views/          Login, Dashboard, Postres, Ventas, Resumen
├── stores/         auth, postres, ventas
├── composables/    useToast
├── utils/          seed
└── firebase.ts
```
