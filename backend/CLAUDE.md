# TaskFlow Backend

NestJS + Prisma + PostgreSQL

## Быстрый старт

```bash
# 1. Установить зависимости
npm install

# 2. Запустить PostgreSQL (Docker)
docker-compose up db -d

# 3. Создать .env
cp .env.example .env

# 4. Применить миграции + сгенерировать Prisma Client
npx prisma migrate dev

# 5. Запустить сервер
npm run start:dev
```

Сервер: <http://localhost:3000>
Swagger: <http://localhost:3000/api/docs>

## Команды

### Разработка

```bash
npm run start:dev      # Dev с hot reload
npm run start:debug    # С дебаггером
npm run build          # Сборка
npm run start:prod     # Запуск билда
```

### Prisma

```bash
npx prisma migrate dev      # Создать/применить миграцию
npx prisma migrate deploy   # Применить на проде
npx prisma generate         # Сгенерировать клиент
npx prisma studio           # GUI для БД (localhost:5555)
npx prisma db push          # Синхронизировать схему без миграции
```

### Docker

```bash
docker-compose up db -d     # Только PostgreSQL
docker-compose up -d        # PostgreSQL + API (прод)
docker-compose down         # Остановить
docker-compose logs -f api  # Логи API
```

### Проверки

```bash
npm run lint           # ESLint
npx tsc --noEmit       # TypeScript проверка
npm test               # Тесты (пока нет)
```

## Структура

```
src/
├── auth/          # JWT авторизация (register, login, refresh, logout)
├── users/         # Профиль + аватар
├── tasks/         # CRUD задач
├── prisma/        # Prisma сервис
└── main.ts        # Точка входа

prisma/
└── schema.prisma  # Модели User, Task
```

## API Endpoints

| Метод  | Путь                | Описание                    | Auth |
| ------ | ------------------- | --------------------------- | ---- |
| POST   | /auth/register      | Регистрация                 | -    |
| POST   | /auth/login         | Логин → tokens              | -    |
| POST   | /auth/refresh       | Обновить токены             | -    |
| POST   | /auth/logout        | Выход                       | JWT  |
| GET    | /users/me           | Профиль                     | JWT  |
| PATCH  | /users/me           | Обновить профиль            | JWT  |
| POST   | /users/me/avatar    | Загрузить аватар            | JWT  |
| DELETE | /users/me/avatar    | Удалить аватар              | JWT  |
| GET    | /tasks              | Список (пагинация, фильтры) | JWT  |
| GET    | /tasks/:id          | Одна задача                 | JWT  |
| POST   | /tasks              | Создать                     | JWT  |
| PATCH  | /tasks/:id          | Обновить                    | JWT  |
| DELETE | /tasks/:id          | Удалить                     | JWT  |
| PATCH  | /tasks/:id/complete | Завершить                   | JWT  |

## ENV переменные

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskflow
JWT_ACCESS_SECRET=change-me
JWT_REFRESH_SECRET=change-me
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
PORT=3000
```

## Конфигурационные файлы

| Файл                    | Аналог Flutter           | Зачем                               |
|-------------------------|--------------------------|-------------------------------------|
| `package.json`          | `pubspec.yaml`           | Зависимости + npm скрипты           |
| `package-lock.json`     | `pubspec.lock`           | Версии зафиксированы (автоген)      |
| `tsconfig.json`         | `analysis_options.yaml`  | Настройки TypeScript                |
| `nest-cli.json`         | —                        | Настройки NestJS CLI                |
| `docker-compose.yml`    | —                        | Docker контейнеры (PostgreSQL + API)|
| `Dockerfile`            | —                        | Сборка Docker образа                |
| `.env` / `.env.example` | —                        | Переменные окружения                |
| `prisma/schema.prisma`  | —                        | Схема БД (модели, связи)            |

## Не используется (можно удалить)

- `src/common/` — пустые папки (decorators, filters, interceptors, pipes)
- `src/config/` — пустая папка
- `test/` — папка не существует, тестов нет
- `prisma/seed.ts` — указан в package.json, но файла нет
