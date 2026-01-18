# TaskFlow Project

TaskFlow — це full-stack мобільний додаток для управління задачами, створений за патернами з Flutter проекту HubX (`/Users/alex/hubx-mobile`).

## Tech Stack

### Backend (`/backend`)
- **NestJS** + TypeScript
- **PostgreSQL** + Prisma ORM
- **JWT** авторизація (access + refresh tokens)
- **Swagger** документація (`/api/docs`)
- **Docker** + docker-compose

### Mobile (`/mobile`)
- **React Native** 0.73 + TypeScript
- **Zustand** — client state
- **TanStack Query** — server state
- **React Navigation** — навігація (stack + tabs)
- **react-hook-form + Zod** — форми та валідація
- **i18next** — локалізація (EN, UK)
- **react-native-image-crop-picker** — камера/галерея з кропом
- **react-native-mmkv** — швидке сховище (з шифруванням для токенів)
- **@shopify/flash-list** — продуктивні списки

## Архітектура

### Feature-Based Structure (як в HubX)

```
mobile/src/
├── app/                      # Entry point
│   ├── App.tsx              # Root component
│   ├── providers.tsx        # QueryClient, GestureHandler, SafeArea
│   └── navigation/
│       ├── RootNavigator.tsx    # Auth vs Main routing
│       ├── AuthNavigator.tsx    # Login, Register
│       └── MainNavigator.tsx    # Tabs + Stacks
│
├── features/                 # Feature modules
│   ├── auth/
│   │   ├── api/authApi.ts       # API calls
│   │   ├── stores/authStore.ts  # Zustand store
│   │   ├── hooks/useLogin.ts    # Form logic (ViewModel)
│   │   ├── screens/             # UI screens
│   │   ├── components/          # Feature components
│   │   └── types/index.ts       # TypeScript + Zod schemas
│   │
│   ├── tasks/
│   │   ├── api/tasksApi.ts
│   │   ├── hooks/useTasks.ts    # TanStack Query hooks
│   │   ├── screens/
│   │   ├── components/
│   │   └── types/
│   │
│   └── profile/
│       ├── api/profileApi.ts
│       ├── hooks/useAvatarPicker.ts  # Camera/gallery picker
│       ├── screens/
│       └── components/
│
├── shared/
│   ├── api/
│   │   ├── client.ts            # Axios instance + interceptors
│   │   └── errorHandler.ts      # Error mapping
│   ├── components/              # Button, Input, Card, Avatar, LoadingOverlay
│   ├── constants/               # Colors, SPACING, DURATIONS, API_CONFIG
│   ├── hooks/                   # Shared hooks
│   └── utils/
│       └── storage.ts           # MMKV wrapper + token storage
│
├── i18n/
│   ├── index.ts                 # i18next config
│   └── locales/
│       ├── en.json
│       └── uk.json
│
└── styles/
    └── theme.ts
```

### Backend Structure

```
backend/src/
├── auth/
│   ├── auth.controller.ts       # POST /auth/register, login, refresh, logout
│   ├── auth.service.ts          # Token generation, bcrypt
│   ├── strategies/              # JWT, Refresh token strategies
│   ├── guards/                  # JwtAuthGuard, RefreshTokenGuard
│   └── dto/                     # RegisterDto, LoginDto
│
├── users/
│   ├── users.controller.ts      # GET/PATCH /users/me, POST avatar
│   ├── users.service.ts
│   └── dto/
│
├── tasks/
│   ├── tasks.controller.ts      # CRUD /tasks, /tasks/:id/complete
│   ├── tasks.service.ts         # Pagination, filters, ownership check
│   └── dto/
│
├── prisma/
│   └── prisma.service.ts
│
└── main.ts                      # Bootstrap, Swagger, ValidationPipe
```

## Ключові патерни

### 1. Логіка в хуках, не в компонентах
```typescript
// hooks/useLogin.ts — вся логіка тут
export function useLogin() {
  const { login, isLoading } = useAuthStore();
  const form = useForm({ resolver: zodResolver(loginSchema) });
  // ...
  return { form, error, isLoading, onSubmit };
}

// screens/LoginScreen.tsx — тільки UI
const { form, error, isLoading, onSubmit } = useLogin();
return <LoginForm ... />;
```

### 2. Zustand для client state, TanStack Query для server state
```typescript
// Client state (auth, settings)
const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  login: async (data) => { ... },
}));

// Server state (tasks, profile)
const { data, isLoading } = useQuery({
  queryKey: ['tasks', filters],
  queryFn: () => tasksApi.getTasks(filters),
});
```

### 3. Всі тексти через i18n
```typescript
// ❌ Погано
<Text>Save</Text>

// ✅ Добре
<Text>{t('common.save')}</Text>
```

### 4. Константи замість магічних чисел
```typescript
// ❌ Погано
<View style={{ padding: 16, marginBottom: 8 }} />

// ✅ Добре
<View style={{ padding: SPACING.md, marginBottom: SPACING.sm }} />
```

### 5. Token refresh через interceptor
```typescript
// shared/api/client.ts
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Refresh token logic
    }
  }
);
```

## API Endpoints

### Auth
- `POST /auth/register` — реєстрація
- `POST /auth/login` — логін (returns access + refresh)
- `POST /auth/refresh` — оновлення токенів
- `POST /auth/logout` — вихід

### Users
- `GET /users/me` — профіль
- `PATCH /users/me` — оновлення профілю
- `POST /users/me/avatar` — завантаження аватара
- `DELETE /users/me/avatar` — видалення аватара

### Tasks
- `GET /tasks` — список (pagination, filters: priority, isCompleted, search)
- `GET /tasks/:id` — одна задача
- `POST /tasks` — створення
- `PATCH /tasks/:id` — оновлення
- `DELETE /tasks/:id` — видалення
- `PATCH /tasks/:id/complete` — позначити виконаною

## Prisma Schema

```prisma
model User {
  id           String   @id @default(uuid())
  email        String   @unique
  password     String
  name         String?
  avatarUrl    String?
  refreshToken String?
  tasks        Task[]
}

model Task {
  id          String    @id @default(uuid())
  title       String
  description String?
  isCompleted Boolean   @default(false)
  priority    Priority  @default(MEDIUM)  // LOW, MEDIUM, HIGH
  dueDate     DateTime?
  userId      String
  user        User      @relation(...)
}
```

## Команди

### Backend
```bash
cd backend
npm install
docker-compose up db -d          # PostgreSQL
cp .env.example .env             # Налаштувати змінні
npx prisma migrate dev           # Міграції
npm run start:dev                # Dev server (localhost:3000)
```

### Mobile
```bash
cd mobile
npm install
npx pod-install                  # iOS pods
npm run ios                      # або npm run android
```

### Тести
```bash
cd mobile && npm test -- --coverage
```

## Файли для вивчення

1. **Архітектура навігації**: `mobile/src/app/navigation/RootNavigator.tsx`
2. **Auth flow**: `mobile/src/features/auth/stores/authStore.ts`
3. **API client**: `mobile/src/shared/api/client.ts`
4. **Task hooks**: `mobile/src/features/tasks/hooks/useTasks.ts`
5. **Avatar picker**: `mobile/src/features/profile/hooks/useAvatarPicker.ts`
6. **Backend auth**: `backend/src/auth/auth.service.ts`

## Mapping від HubX Flutter

Детальний маппінг патернів: `docs/hubx-to-react-native-mapping.md`

| Flutter (HubX) | React Native (TaskFlow) |
|----------------|-------------------------|
| BLoC/Cubit | Zustand + TanStack Query |
| GoRouter | React Navigation |
| Dio | Axios |
| easy_localization | i18next |
| flutter_secure_storage | react-native-mmkv |
| GetIt | Direct imports |
| freezed | TypeScript + Zod |
