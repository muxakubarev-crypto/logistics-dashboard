# Что можно улучшить и добавить в дашборд + Промт для дизайн-референсов

---

## 1. Что уже хорошо (не трогать)

- Парсер работает, данные Кубарева из 11 месяцев загружены
- 3 графика (Donut, Stacked Bar, Line Chart) дают объёмную картину
- 4 умных триггера покрывают ключевые риски
- Tailwind + shadcn/ui стиль — чисто, минималистично

---

## 2. Что можно улучшить (приоритетно)

### 🔴 Критичные (влияют на пользу дашборда)

| # | Что | Зачем |
|---|---|---|
| 1 | **Фильтр по категориям** | У Кубарева есть прямое ж/д (основное), морской фрахт, скидки. Сейчас всё смешано. Нужен `Select` с выбором категории |
| 2 | **Фильтр по диапазону месяцев** | 11 месяцев — много. Должна быть возможность смотреть «последние 3 месяца» или выбрать произвольный диапазон |
| 3 | **Экспорт в PDF / печать** | Чтобы показать руководству отчёт за период. Кнопка «Скачать отчёт» |
| 4 | **Валидация вставленных данных** | Сейчас если вставить кривой текст — просто 0 строк. Нужно показывать: «Распарсено X строк, Y ошибок» с подсветкой проблем |

### 🟡 Важные (улучшают опыт)

| # | Что | Зачем |
|---|---|---|
| 5 | **Интерактивная легенда графиков** | Клик по легенде скрывает/показывает серию данных (стандартное поведение Recharts, нужно включить) |
| 6 | **Тултипы с детализацией** | При наведении на столбец/точку — показывать не только цифру, но и % от месяца |
| 7 | **Сравнение с предыдущим периодом** | В KPI-карточках добавить стрелки: «Конверсия: 12% ↓2% к прошлому месяцу» |
| 8 | **Тёмная тема** | Переключатель светлая/тёмная. Tailwind dark: префикс — 10 минут работы |
| 9 | **Сохранение истории анализов** | localStorage: хранить последние 5 вставленных наборов данных с датой |

### 🟢 Приятные (WOW-эффект)

| # | Что | Зачем |
|---|---|---|
| 10 | **Анимированные KPI-счётчики** | Цифры «накручиваются» от 0 до значения при загрузке. Эффект живого дашборда |
| 11 | **Sparklines в KPI-карточках** | Мини-график тренда внутри каждой карточки (последние 6 месяцев) |
| 12 | **Heatmap календарь** | Календарь на 11 месяцев, где цвет ячейки = интенсивность запросов |
| 13 | **Сравнение с «идеальным» менеджером** | Взять топ-менеджера по конверсии и показать бенчмарк-линию на графиках |

---

## 3. Промт для дизайн-референсов (lazywebs minimalistic design)

Скопируй текст ниже и используй в Figma Community, Dribbble, Behance или любом AI-инструменте для поиска дизайн-референсов:

---

```
Design reference search prompt:

"Minimalistic analytics dashboard SPA — logistics, freight transportation KPIs.
Style: lazywebs minimalistic, shadcn/ui, Tailwind CSS, soft shadows, rounded corners (radius 12-16px).
Color palette: Slate 50 background, white cards, blue-600 accent, muted status colors (green/red/yellow/amber).
Components needed:
1. Data import card with monospace textarea + accent button
2. KPI stat cards row (4-5 cards) with lucide-react icons, sparkline trend indicator
3. Charts section: Donut chart (loss reasons), Stacked bar chart (categories), Line chart (monthly trend)
4. Smart insights alert feed: color-coded cards (red=critical, yellow=warning, blue=recommendation) with left border accent and icon

Search terms: logistics dashboard, analytics SPA, minimal data visualization, shadcn ui dashboard, tailwind dashboard, freight analytics UI, KPI cards design, chart cards UI

Platform examples to reference: Vercel Analytics, Stripe Dashboard, Linear.app, Lazywebs minimalistic"
```

---

## 4. Промт для AI-генерации дизайна (Midjourney / DALL-E)

```
Minimalistic logistics analytics dashboard UI design, single page application, 
Slate gray background, white rounded cards with subtle box shadows, 
blue accent color #2563eb, 5 KPI stat cards in a row with small trend sparklines, 
donut chart and bar chart side by side, line chart below showing 11-month trend, 
color-coded alert cards with left border accent (red, yellow, blue), 
monospace textarea input at top, 
clean typography, shadcn/ui style, tailwind CSS aesthetic, 
soft shadows, border-radius 12px, professional data visualization --ar 16:9 --style minimalistic
```

---

## 5. Рекомендуемый порядок реализации улучшений

```
Неделя 1: #1 (фильтр категорий) + #4 (валидация) + #7 (сравнение с прошлым периодом)
Неделя 2: #8 (тёмная тема) + #10 (анимированные счётчики) + #5 (интерактивная легенда)
Неделя 3: #3 (экспорт PDF) + #6 (тултипы с %) + #9 (история анализов)
Когда будет время: #11 (sparklines) + #12 (heatmap) + #13 (бенчмарки)
```
