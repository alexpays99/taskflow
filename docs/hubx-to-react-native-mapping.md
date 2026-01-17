# HubX Flutter → TaskFlow React Native: Pattern Mapping

This document maps the patterns from the HubX Flutter project to their React Native equivalents for TaskFlow.

---

## 1. PROJECT ARCHITECTURE

### HubX Flutter Structure
```
lib/
├── core/                    # Infrastructure layer
│   ├── di/                  # GetIt dependency injection
│   ├── infrastructure/      # HTTP, storage, error handling
│   └── ui/                  # Themes, shared widgets
├── features/                # Feature modules (Clean Architecture)
│   └── [feature]/
│       ├── data/           # DTOs, repositories, data sources
│       ├── domain/         # Entities, use cases, repository interfaces
│       └── presentation/   # BLoCs, screens, widgets
├── shared/                  # Cross-feature services
└── router/                  # GoRouter configuration
```

### TaskFlow React Native Equivalent
```
src/
├── app/                     # App entry, providers, navigation
│   └── navigation/         # React Navigation setup
├── features/               # Feature modules (same pattern)
│   └── [feature]/
│       ├── api/           # API functions (replaces data sources)
│       ├── hooks/         # Custom hooks (replaces use cases)
│       ├── stores/        # Zustand stores (replaces BLoCs)
│       ├── screens/       # Screen components
│       ├── components/    # Feature-specific components
│       └── types/         # TypeScript interfaces
├── shared/                 # Shared utilities
│   ├── api/               # Axios client, interceptors
│   ├── components/        # Reusable UI components
│   ├── hooks/             # Shared hooks
│   └── constants/         # Colors, spacing, durations
├── i18n/                   # Localization
└── styles/                 # Theme configuration
```

---

## 2. STATE MANAGEMENT

| Flutter (HubX) | React Native (TaskFlow) |
|----------------|------------------------|
| **BLoC/Cubit** | **Zustand stores** |
| `emit(state.copyWith(...))` | `set((state) => ({ ...state, ... }))` |
| `BlocProvider` | React Context (automatic with Zustand) |
| `BlocBuilder` | `useStore()` hook |
| `BlocListener` | `useEffect` with store subscription |

### HubX BLoC Pattern
```dart
class LoginBloc extends Bloc<LoginEvent, LoginState> {
  LoginBloc() : super(const LoginState()) {
    on<LoginEmailChanged>(_onEmailChanged);
    on<LoginSubmitted>(_onLoginSubmitted);
  }

  void _onEmailChanged(LoginEmailChanged event, Emitter<LoginState> emit) {
    emit(state.copyWith(email: event.email));
  }
}
```

### TaskFlow Zustand Equivalent
```typescript
// stores/authStore.ts
interface AuthState {
  email: string;
  isLoading: boolean;
  error: string | null;
  setEmail: (email: string) => void;
  login: (email: string, password: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  email: '',
  isLoading: false,
  error: null,
  setEmail: (email) => set({ email }),
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const token = await authApi.login(email, password);
      await storage.set('token', token);
      set({ isLoading: false });
    } catch (e) {
      set({ error: e.message, isLoading: false });
    }
  },
}));
```

### Server State: TanStack Query
```typescript
// hooks/useTasks.ts
export function useTasks(filters?: TaskFilters) {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => tasksApi.getTasks(filters),
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tasksApi.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
```

---

## 3. NAVIGATION

| Flutter (HubX) | React Native (TaskFlow) |
|----------------|------------------------|
| **GoRouter** | **React Navigation** |
| `GoRouter(routes: [...])` | `createNativeStackNavigator()` |
| `context.go('/path')` | `navigation.navigate('Screen')` |
| `ShellRoute` | `createBottomTabNavigator()` |
| `redirect` guards | `NavigationContainer` + auth state |

### HubX GoRouter
```dart
final router = GoRouter(
  initialLocation: '/welcome',
  refreshListenable: sessionNotifier,
  redirect: (context, state) {
    final isLoggedIn = sessionNotifier.isAuthorized;
    if (!isLoggedIn && !state.matchedLocation.startsWith('/auth')) {
      return '/welcome';
    }
    return null;
  },
  routes: [
    ShellRoute(
      builder: (context, state, child) => MainScreen(child: child),
      routes: [
        GoRoute(path: '/home', builder: (_, __) => const HomeScreen()),
        GoRoute(path: '/profile', builder: (_, __) => const ProfileScreen()),
      ],
    ),
  ],
);
```

### TaskFlow React Navigation
```typescript
// navigation/RootNavigator.tsx
function RootNavigator() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

// navigation/MainNavigator.tsx
const Tab = createBottomTabNavigator();

function MainNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Tasks" component={TasksScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
```

---

## 4. API LAYER

| Flutter (HubX) | React Native (TaskFlow) |
|----------------|------------------------|
| **Dio** | **Axios** |
| `Interceptor` | `axios.interceptors` |
| `DioException` | `AxiosError` |
| `Options` | `AxiosRequestConfig` |

### HubX Dio Setup
```dart
class DioClient {
  final Dio _client;

  List<Interceptor> getInterceptors() => [
    AuthInterceptor(_tokenStorageService),
    if (AppConfig.netLogs) LogInterceptor(request: true, responseBody: true),
  ];
}
```

### TaskFlow Axios Setup
```typescript
// shared/api/client.ts
import axios from 'axios';
import { storage } from '../utils/storage';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Auth interceptor
client.interceptors.request.use(async (config) => {
  const token = await storage.getString('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error interceptor
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await storage.delete('token');
      // Navigate to login
    }
    return Promise.reject(error);
  }
);

export { client };
```

### Error Handling
```typescript
// shared/api/errorHandler.ts
export function handleApiError(error: AxiosError): ApiError {
  if (!error.response) {
    return { type: 'network', message: 'errors.no_internet_connection' };
  }

  const status = error.response.status;
  switch (status) {
    case 401:
    case 403:
      return { type: 'unauthorized', message: 'auth.session_expired' };
    case 422:
      return { type: 'validation', errors: error.response.data.errors };
    case 429:
      return { type: 'rateLimit', message: 'errors.too_many_requests' };
    case 500:
    case 502:
    case 503:
      return { type: 'server', message: 'errors.server_unavailable' };
    default:
      return { type: 'unknown', message: 'errors.unknown_error' };
  }
}
```

---

## 5. DATA MODELS

| Flutter (HubX) | React Native (TaskFlow) |
|----------------|------------------------|
| **Dart classes** | **TypeScript interfaces** |
| `fromJson()` factory | Direct JSON parsing or Zod |
| `freezed` for immutability | TypeScript readonly + spread |
| `@JsonKey` | Type transformations |

### HubX Model
```dart
class PostModel {
  final int id;
  final String? text;
  final String? createdAt;

  factory PostModel.fromJson(Map<String, dynamic> json) {
    return PostModel(
      id: json['id'] as int,
      text: json['text'] as String?,
      createdAt: json['created_at'] as String?,
    );
  }
}
```

### TaskFlow TypeScript
```typescript
// types/index.ts
export interface Task {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  priority: Priority;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

// With Zod for runtime validation
import { z } from 'zod';

export const TaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  isCompleted: z.boolean(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  dueDate: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Task = z.infer<typeof TaskSchema>;
```

---

## 6. LOCALIZATION

| Flutter (HubX) | React Native (TaskFlow) |
|----------------|------------------------|
| **easy_localization** | **i18next + react-i18next** |
| `'key'.tr()` | `t('key')` |
| `context.locale` | `i18n.language` |
| JSON files in assets | JSON files in src/i18n/locales |

### HubX
```dart
Text('home.welcome'.tr())
EasyLocalization(
  supportedLocales: [Locale('en'), Locale('uk')],
  path: 'assets/translations/',
  fallbackLocale: Locale('en'),
)
```

### TaskFlow
```typescript
// i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import uk from './locales/uk.json';

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, uk: { translation: uk } },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

// Usage in components
const { t } = useTranslation();
<Text>{t('home.welcome')}</Text>
```

---

## 7. THEMES & STYLES

| Flutter (HubX) | React Native (TaskFlow) |
|----------------|------------------------|
| **ThemeData** | **Theme object + StyleSheet** |
| `AppColors.primary` | `Colors.primary.main` |
| `TextStyle` | StyleSheet typography |
| `ScreenUtil (.sp, .w, .h)` | Responsive utilities |

### HubX Colors
```dart
class AppColors {
  static const Color primary = Color(0xFF6C25E6);
  static const Color textPrimary = Color(0xFF0E121B);
  static const Color scaffoldBackground = Color(0xFFF9F9FC);
}
```

### TaskFlow Colors
```typescript
// shared/constants/colors.ts
export const Colors = {
  primary: {
    main: '#3498db',
    light: '#5dade2',
    dark: '#2980b9',
  },
  text: {
    primary: '#0E121B',
    secondary: '#64748B',
  },
  background: {
    default: '#F9F9FC',
    paper: '#FFFFFF',
  },
  semantic: {
    success: '#27ae60',
    warning: '#f39c12',
    error: '#e74c3c',
  },
} as const;
```

### TaskFlow Spacing
```typescript
// shared/constants/spacing.ts
export const SPACING = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;
```

---

## 8. FORMS & VALIDATION

| Flutter (HubX) | React Native (TaskFlow) |
|----------------|------------------------|
| **BLoC form state** | **react-hook-form + Zod** |
| `ValidationPatterns` | Zod schemas |
| `emit(state.copyWith(error: ...))` | `formState.errors` |

### HubX Validation
```dart
class ValidationPatterns {
  static final RegExp email = RegExp(r'^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.[a-zA-Z]+');
  static const int minPasswordLength = 8;
}
```

### TaskFlow Validation
```typescript
// features/auth/types/schemas.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('auth.validation.email_invalid'),
  password: z.string().min(8, 'auth.validation.password_too_short'),
});

// Usage with react-hook-form
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

function LoginScreen() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    await login(data.email, data.password);
  };

  return (
    <Controller
      name="email"
      control={control}
      render={({ field }) => (
        <Input
          {...field}
          error={errors.email?.message}
          placeholder={t('auth.email')}
        />
      )}
    />
  );
}
```

---

## 9. TOKEN STORAGE

| Flutter (HubX) | React Native (TaskFlow) |
|----------------|------------------------|
| **flutter_secure_storage** | **react-native-mmkv** (encrypted mode) |
| In-memory caching | MMKV is already fast |
| `SecureStorage.writeData()` | `storage.set()` |

### HubX
```dart
class AccessTokenStorageService {
  Future<void> saveToken({required String token}) async {
    _inMemorySavedAccessToken = token;
    return secureStorage.writeData(value: token, key: _key);
  }
}
```

### TaskFlow
```typescript
// shared/utils/storage.ts
import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'taskflow-storage',
  encryptionKey: 'your-encryption-key', // For sensitive data
});

// Usage
storage.set('token', accessToken);
const token = storage.getString('token');
storage.delete('token');
```

---

## 10. IMAGE PICKER & CROPPER

| Flutter (HubX) | React Native (TaskFlow) |
|----------------|------------------------|
| **image_picker** | **react-native-image-picker** |
| **image_cropper** | **react-native-image-crop-picker** |
| `ImageSource.camera` | `launchCamera()` |
| `CropAspectRatio` | `cropping: true, width, height` |

### HubX
```dart
final croppedFile = await ImageCropper().cropImage(
  sourcePath: imagePath,
  aspectRatio: CropAspectRatio(ratioX: 1, ratioY: 1),
  uiSettings: [
    AndroidUiSettings(cropStyle: CropStyle.circle),
    IOSUiSettings(aspectRatioLockEnabled: true),
  ],
);
```

### TaskFlow
```typescript
// features/profile/hooks/useAvatarPicker.ts
import ImagePicker from 'react-native-image-crop-picker';

export function useAvatarPicker() {
  const { mutateAsync: uploadAvatar } = useUploadAvatar();

  const pickFromCamera = async () => {
    try {
      const result = await ImagePicker.openCamera({
        width: 400,
        height: 400,
        cropping: true,
        cropperCircleOverlay: true,
        compressImageQuality: 0.8,
      });
      await uploadAvatar(result.path);
    } catch (error) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        Alert.alert(t('common.error'), t('profile.avatarUploadFailed'));
      }
    }
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
      cropperCircleOverlay: true,
    });
    await uploadAvatar(result.path);
  };

  return { pickFromCamera, pickFromGallery };
}
```

---

## 11. DEPENDENCY INJECTION

| Flutter (HubX) | React Native (TaskFlow) |
|----------------|------------------------|
| **GetIt** | **React Context + hooks** |
| `GetIt.instance.registerLazySingleton()` | Singleton modules |
| `injector<T>()` | `useContext()` or direct imports |

### HubX
```dart
GetIt.instance.registerLazySingleton<AuthRepository>(
  () => AuthRepositoryImpl(GetIt.instance()),
);
final authRepo = injector<AuthRepository>();
```

### TaskFlow
```typescript
// In React Native, we typically use:
// 1. Direct module imports (most common)
// 2. React Context for runtime dependencies
// 3. Zustand for global state

// Direct import pattern (preferred)
import { authApi } from '@/features/auth/api/authApi';
import { useAuthStore } from '@/features/auth/stores/authStore';

// Context pattern (when needed)
const ApiClientContext = createContext<AxiosInstance | null>(null);
export const useApiClient = () => useContext(ApiClientContext);
```

---

## 12. SUMMARY: Key Technology Mappings

| Concept | Flutter (HubX) | React Native (TaskFlow) |
|---------|---------------|------------------------|
| Language | Dart | TypeScript |
| UI Framework | Flutter widgets | React Native components |
| State (Client) | BLoC/Cubit | Zustand |
| State (Server) | Manual | TanStack Query |
| Navigation | GoRouter | React Navigation |
| HTTP Client | Dio | Axios |
| Forms | BLoC + manual | react-hook-form + Zod |
| Storage | flutter_secure_storage | react-native-mmkv |
| i18n | easy_localization | i18next |
| Images | image_picker + cropper | react-native-image-crop-picker |
| Lists | ListView/Sliver | FlashList |
| Animations | Implicit/Explicit | Reanimated |
| DI | GetIt | Context/imports |

---

## 13. PATTERNS TO PRESERVE

1. **Feature-first architecture** - Same folder structure philosophy
2. **Clean separation** - API, hooks, stores, components, screens
3. **Centralized error handling** - Interceptors + error mappers
4. **Type safety** - TypeScript strict mode
5. **All text via i18n** - No hardcoded strings
6. **Constants for magic numbers** - Colors, spacing, durations
7. **Logic in hooks, not components** - Thin UI components
8. **Real-time validation** - Form validation as user types
9. **Secure token storage** - Encrypted storage for credentials
10. **Environment configs** - Dev, stage, prod configurations

---

*Document created: January 2025*
*Source: HubX Flutter project analysis*
