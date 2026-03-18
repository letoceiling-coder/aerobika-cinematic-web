# 🎨 Design System Documentation
## N2O Delivery Service - Frontend & Admin Panel

---

## 📋 Содержание

1. [Цветовая палитра](#цветовая-палитра)
2. [Типографика](#типографика)
3. [Компоненты UI](#компоненты-ui)
4. [Эффекты и анимации](#эффекты-и-анимации)
5. [Страницы Frontend](#страницы-frontend)
6. [Админ-панель](#админ-панель)
7. [UI/UX принципы](#uiux-принципы)

---

## 🎨 Цветовая палитра

### Основные цвета

#### Фон и текст
- **Background**: `hsl(0 0% 4.3%)` - Темный фон (#0B0B0B)
- **Foreground**: `hsl(0 0% 90%)` - Светлый текст (#E6E6E6)
- **Card**: `hsl(0 0% 7%)` - Фон карточек (#121212)
- **Secondary**: `hsl(0 0% 12%)` - Вторичный фон (#1F1F1F)
- **Muted**: `hsl(0 0% 15%)` - Приглушенный фон (#262626)

#### Золотые акценты (Primary)
- **Gold Start**: `hsl(43 56% 52%)` - #D4AF37
- **Gold End**: `hsl(46 88% 72%)` - #F5D77A
- **Gold Dark**: `#B8962E`
- **Gold Light**: `#F5D77A`

**Градиент**: `linear-gradient(135deg, hsl(43 56% 52%), hsl(46 88% 72%))`

#### Акцентные цвета
- **Accent**: `hsl(142 71% 45%)` - Зеленый (#22C55E) - успех
- **Destructive**: `hsl(0 84.2% 60.2%)` - Красный - ошибки/удаление
- **Border**: `hsl(0 0% 15%)` - Границы (#262626)
- **Ring**: `hsl(43 56% 52%)` - Фокус (золотой)

### Специальные цвета

#### Gold Palette
```css
gold: {
  DEFAULT: "#D4AF37",
  light: "#F5D77A",
  dark: "#B8962E"
}
```

#### Success
```css
success: "#22C55E"
```

---

## 📝 Типографика

### Шрифт
- **Font Family**: `Inter` (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800, 900
- **Style**: Sans-serif, antialiased

### Размеры
- **Base**: 16px (1rem)
- **Small**: 14px (0.875rem)
- **Large**: 18px (1.125rem)
- **XL**: 20px (1.25rem)
- **2XL**: 24px (1.5rem)
- **3XL**: 30px (1.875rem)
- **4XL**: 36px (2.25rem)

### Стили текста
- **Gold Text**: Градиентный золотой текст (`.gold-text`)
- **Gradient**: `linear-gradient(135deg, hsl(43 56% 52%), hsl(46 88% 72%))`
- **Background Clip**: Text (webkit-background-clip)

---

## 🧩 Компоненты UI

### Кнопки (Button)

#### Варианты
1. **default**: Основная кнопка (primary цвет)
2. **gold**: Золотая кнопка с градиентом и свечением
3. **goldOutline**: Обводка золотым, прозрачный фон
4. **outline**: Обводка, прозрачный фон
5. **secondary**: Вторичная кнопка
6. **ghost**: Прозрачная, hover эффект
7. **destructive**: Красная для удаления
8. **link**: Текстовая ссылка

#### Размеры
- **sm**: `h-9` (36px)
- **default**: `h-11` (44px)
- **lg**: `h-14` (56px)
- **xl**: `h-16` (64px)
- **icon**: `h-10 w-10` (40x40px)

#### Эффекты
- **Active**: `scale-[0.97]` - легкое уменьшение при нажатии
- **Hover**: `brightness-110` - увеличение яркости
- **Gold Glow**: Тень с золотым свечением

### Карточки (Card)

#### Glass Card
```css
.glass-card {
  background: hsla(0, 0%, 100%, 0.05);
  backdrop-filter: blur(16px);
  border: 1px solid hsla(0, 0%, 100%, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}
```

**Эффекты**:
- Полупрозрачный фон (5% белого)
- Размытие фона (backdrop-filter: blur(16px))
- Тонкая светлая граница (10% белого)
- Глубокая тень

#### Glass Card Hover
- Увеличение прозрачности фона до 8%
- Золотая граница при hover
- Золотое свечение тени

### Формы (Input)

#### Стили
- **Background**: `bg-secondary` (темный)
- **Border**: `border-border` (тонкая граница)
- **Focus**: `ring-2 ring-primary` (золотое кольцо)
- **Padding**: `px-4 py-3`
- **Radius**: `rounded-lg`

### Badge / Status

#### Цвета статусов
- **New**: `bg-blue-500/20 text-blue-400` - Синий
- **Processing**: `bg-yellow-500/20 text-yellow-400` - Желтый
- **Delivered**: `bg-green-500/20 text-green-400` - Зеленый
- **Error**: `bg-red-500/20 text-red-400` - Красный

---

## ✨ Эффекты и анимации

### Градиенты

#### Gold Gradient
```css
.gold-gradient {
  background: linear-gradient(135deg, hsl(43 56% 52%), hsl(46 88% 72%));
}
```

#### Gold Text
```css
.gold-text {
  background: linear-gradient(135deg, hsl(43 56% 52%), hsl(46 88% 72%));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### Свечение (Glow)

#### Gold Glow
```css
.gold-glow {
  box-shadow: 0 0 20px hsla(43, 56%, 52%, 0.3),
              0 0 60px hsla(43, 56%, 52%, 0.1);
}
```

#### Gold Glow Strong
```css
.gold-glow-strong {
  box-shadow: 0 0 30px hsla(43, 56%, 52%, 0.4),
              0 0 80px hsla(43, 56%, 52%, 0.15);
}
```

### Анимации

#### Fade In
```css
@keyframes fade-in {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}
```

#### Fade In Up
```css
@keyframes fade-in-up {
  0% { opacity: 0; transform: translateY(40px); }
  100% { opacity: 1; transform: translateY(0); }
}
```

#### Scale In
```css
@keyframes scale-in {
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
```

#### Slide Up
```css
@keyframes slide-up {
  0% { transform: translateY(100%); }
  100% { transform: translateY(0); }
}
```

#### Float Gentle
```css
@keyframes float-gentle {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}
```

#### Pulse Glow
```css
@keyframes pulse-glow {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}
```

### Transitions
- **Duration**: 200-300ms для интерактивных элементов
- **Easing**: `ease-out` для плавности
- **Hover**: `transition-all duration-300`

---

## 📱 Страницы Frontend

### Главная страница (Index)

#### Структура
1. **Header** - Навигация, логотип, корзина
2. **HeroSection** - Главный баннер с CTA
3. **ProductSection** - Каталог товаров с параметрами
4. **HowItWorks** - Как это работает (3 шага)
5. **DeliveryInfo** - Информация о доставке
6. **ContactSection** - Контакты
7. **SiteFooter** - Футер
8. **CartPanel** - Панель корзины (slide-in)
9. **MobileNav** - Мобильная навигация (bottom)

#### Особенности
- **ParticlesBackground** - Анимированный фон с частицами
- **Responsive**: Mobile-first подход
- **Animations**: Framer Motion для плавных переходов

### Страница профиля (Profile)

#### Блоки
1. **User Info** - Аватар, имя, телефон
2. **Addresses** - Сохраненные адреса (CRUD)
3. **Order History** - История заказов с статусами
4. **Contact/Support** - Телефон, email, Telegram

#### Статусы заказов
- **New**: Желтый badge
- **Processing**: Синий badge
- **Delivered**: Зеленый badge

### Страница 404 (NotFound)
- Простое сообщение об ошибке
- Кнопка возврата на главную

---

## 🛠️ Админ-панель

### Дизайн-система

#### Цветовая схема
- **Background**: Темный (`hsl(0 0% 4.3%)`)
- **Card**: `hsl(0 0% 7%)`
- **Sidebar**: `hsl(0 0% 5%)` - еще темнее
- **Primary**: Золотой градиент
- **Accent**: Зеленый для успеха

#### Layout

##### Структура
```
┌─────────────────────────────────────┐
│  Sidebar (256px) │  Main Content   │
│                   │                  │
│  - Logo           │  - Page Header  │
│  - Navigation     │  - Content      │
│  - Logout         │                  │
└─────────────────────────────────────┘
```

##### Sidebar
- **Width**: `w-64` (256px)
- **Background**: `bg-card`
- **Border**: `border-r border-border`
- **Navigation**: Вертикальный список с иконками

##### Main Content
- **Padding**: `p-8`
- **Overflow**: `overflow-auto`
- **Flex**: `flex-1`

### Страницы

#### 1. Login (`/admin/login`)
- **Layout**: Центрированная форма
- **Card**: Glass card эффект
- **Fields**: Email, Password
- **Button**: Gold gradient
- **Error Handling**: Детальные сообщения об ошибках

#### 2. Dashboard (`/admin/dashboard`)
- **Stats Cards**: 4 карточки с метриками
  - Пользователи (синий)
  - Заказы (зеленый)
  - Выручка (желтый)
  - Товары (фиолетовый)
- **Recent Orders**: Список последних заказов
- **Grid**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`

#### 3. Orders (`/admin/orders`)
- **List**: Список всех заказов
- **Status Badge**: Цветной индикатор
- **Status Select**: Dropdown для изменения статуса
- **Info**: ID, пользователь, адрес, цена

#### 4. Products (`/admin/products`)
- **Grid**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Card**: Изображение, название, описание, цены (5л/10л)
- **Actions**: Редактировать, Удалить
- **Modal**: Форма создания/редактирования

#### 5. Users (`/admin/users`)
- **List**: Список пользователей Telegram
- **Info**: Имя, username, ID, телефон, дата регистрации
- **Pagination**: Навигация по страницам

#### 6. Broadcast (`/admin/broadcast`)
- **Form**: Создание рассылки (textarea)
- **History**: Список всех рассылок
- **Status**: Отправлено / Не отправлено
- **Action**: Кнопка отправки

### Компоненты админ-панели

#### AdminLayout
- **Sidebar Navigation**: 
  - Dashboard
  - Заказы
  - Товары
  - Пользователи
  - Рассылка
- **Active State**: Gold gradient на активной ссылке
- **Logout**: Кнопка выхода внизу sidebar

#### ProtectedRoute
- Проверка JWT токена
- Редирект на `/admin/login` если не авторизован

---

## 🎯 UI/UX принципы

### Общие принципы

#### 1. Темная тема
- Глубокий черный фон (#0B0B0B)
- Высокий контраст для читаемости
- Мягкие переходы между элементами

#### 2. Золотые акценты
- Используются для:
  - Primary actions (кнопки)
  - Активные элементы
  - Важные заголовки
  - Hover состояния
- Градиент создает премиум ощущение

#### 3. Glassmorphism
- Полупрозрачные карточки
- Размытие фона (backdrop-filter)
- Создает глубину и слоистость

#### 4. Плавные анимации
- **Duration**: 200-300ms
- **Easing**: ease-out
- **Scale**: 0.97 при нажатии
- **Fade**: Появление элементов

### Responsive Design

#### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

#### Mobile-first
- Базовая версия для мобильных
- Адаптация для больших экранов
- Touch-friendly размеры (min 44x44px)

### Accessibility

#### Контрастность
- Текст: 90% белого на 4.3% черном
- Минимальный контраст: WCAG AA

#### Focus States
- Золотое кольцо при фокусе
- Видимые индикаторы навигации

#### Keyboard Navigation
- Tab порядок логичен
- Все интерактивные элементы доступны

### Интерактивность

#### Hover States
- Увеличение яркости (brightness-110)
- Изменение цвета границы
- Плавные переходы

#### Active States
- Scale down (0.97)
- Визуальная обратная связь

#### Loading States
- Disabled состояние
- Skeleton loaders
- Spinner для длительных операций

---

## 📐 Spacing & Layout

### Отступы
- **xs**: 4px (0.25rem)
- **sm**: 8px (0.5rem)
- **md**: 16px (1rem)
- **lg**: 24px (1.5rem)
- **xl**: 32px (2rem)
- **2xl**: 48px (3rem)

### Border Radius
- **sm**: `calc(var(--radius) - 8px)`
- **md**: `calc(var(--radius) - 4px)`
- **lg**: `var(--radius)` (1.25rem = 20px)
- **xl**: 1.75rem (28px)

### Shadows
- **Default**: `0 8px 32px 0 rgba(0, 0, 0, 0.37)`
- **Gold Glow**: `0 0 20px hsla(43, 56%, 52%, 0.3)`
- **Strong Glow**: `0 0 30px hsla(43, 56%, 52%, 0.4)`

---

## 🎬 Анимации Framer Motion

### Используемые эффекты
- **AnimatePresence**: Для появления/исчезновения
- **motion.div**: Для плавных переходов
- **whileTap**: Scale при нажатии
- **whileHover**: Эффекты при наведении
- **initial/animate**: Контроль анимаций

### Примеры
```tsx
<motion.button
  whileTap={{ scale: 0.97 }}
  className="gold-gradient"
>
  Click me
</motion.button>
```

---

## 🔧 Технические детали

### CSS Variables
Все цвета определены через CSS переменные для легкой кастомизации:
```css
--background: 0 0% 4.3%;
--foreground: 0 0% 90%;
--primary: 43 56% 52%;
```

### Tailwind Config
- Кастомные цвета
- Кастомные анимации
- Расширенные утилиты

### Компоненты библиотеки
- **Shadcn/ui**: Базовая библиотека компонентов
- **Radix UI**: Доступные примитивы
- **Lucide Icons**: Иконки

---

## 📱 Мобильная навигация

### MobileNav (Bottom Navigation)
- **Position**: Fixed bottom
- **Height**: `h-16` (64px)
- **Tabs**: Главная, Корзина, Профиль
- **Badge**: Счетчик товаров в корзине
- **Active State**: Золотая подсветка

### CartPanel (Slide-in)
- **Position**: Fixed right
- **Width**: `w-full md:w-96`
- **Animation**: Slide-in-right
- **Backdrop**: Полупрозрачный overlay

---

## 🎨 Специальные эффекты

### Particles Background
- Анимированные частицы на фоне
- Плавающее движение
- Создает динамику

### Scrollbar
- Кастомный скроллбар
- Золотой цвет при hover
- Тонкий дизайн (6px)

### Safe Area
- Поддержка safe-area-inset для iOS
- Корректные отступы на устройствах с вырезом

---

## ✅ Чеклист дизайна

### Обязательные элементы
- ✅ Темная тема
- ✅ Золотые акценты
- ✅ Glass card эффекты
- ✅ Плавные анимации
- ✅ Responsive дизайн
- ✅ Доступность (accessibility)
- ✅ Консистентность стилей

### Премиум ощущение
- ✅ Градиенты
- ✅ Свечение (glow)
- ✅ Размытие (blur)
- ✅ Плавные переходы
- ✅ Качественная типографика

---

## 📚 Дополнительные ресурсы

### Шрифты
- Google Fonts: Inter

### Иконки
- Lucide React

### Анимации
- Framer Motion
- CSS Animations

### UI библиотека
- Shadcn/ui
- Radix UI

---

**Версия документа**: 1.0  
**Последнее обновление**: 2024  
**Проект**: N2O Delivery Service
