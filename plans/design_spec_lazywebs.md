# Design Spec для нейросети-дизайнера

## Как использовать этот документ

1. Скопируй **Блок 1** (промт) в любую нейросеть для генерации дизайн-референсов (Midjourney, DALL-E, Recraft)
2. Скопируй **Блок 2** (JSON-спек) в нейросеть-кодер (Claude, GPT, Cursor) — она напишет код
3. Референсы из lazywebs используй как визуальный ориентир

---

## Блок 1: Промт для поиска дизайн-референсов (Lazywebs)

### Для Figma Community / Dribbble / Behance

```
search: "lazywebs minimal dashboard analytics logistics SPA shadcn ui tailwind"

Style keywords:
- lazywebs minimalistic design system
- shadcn/ui dashboard blocks
- Tailwind CSS data cards
- soft shadows, border-radius: 12-16px
- Slate 50 background, white elevated cards
- blue-600 (#2563eb) primary accent
- Inter font, monospace for data input
- color-coded alert banners: red left-border critical, yellow warning, blue recommendation
- KPI stat cards with lucide-react icons + trend sparklines
- Recharts: donut chart, stacked bar, line chart
- dark mode toggle (Tailwind dark: prefix)
```

### Для AI-генерации картинок (Midjourney / DALL-E / Recraft)

```
Minimalistic logistics analytics dashboard UI, single page application,
lazywebs design style, shadcn/ui aesthetic, Tailwind CSS,
Slate gray background (#f8fafc), white rounded cards with subtle box-shadow,
blue accent #2563eb, clean typography Inter font,
5 KPI stat cards in a row with small green/red trend arrows and sparkline mini-charts,
donut chart (loss reasons) and stacked bar chart (categories) side by side,
line chart below showing 11-month trend with 4 colored lines,
3 color-coded alert cards with left border accent: red critical, yellow warning, blue recommendation,
monospace textarea with file upload button at top,
dark mode variant on the right half: slate-900 background, slate-800 cards,
professional data visualization, border-radius 12-16px, soft shadows --ar 16:9 --style minimalistic
```

### Референс-проекты (на что ориентироваться)

| Проект | Ссылка | Что смотреть |
|--------|--------|-------------|
| Lazywebs Dashboard Blocks | [lazywebs](https://lazywebs.com) | Карточки KPI, цветовая палитра, тени |
| Vercel Analytics | vercel.com/analytics | Минимализм, спарклайны, сетка |
| Stripe Dashboard | dashboard.stripe.com | Карточки метрик, статус-индикаторы |
| Linear.app | linear.app | Тёмная тема, микро-взаимодействия |
| shadcn/ui Blocks | ui.shadcn.com/blocks | Готовые блоки дашборда |

---

## Блок 2: JSON-спек для нейросети-кодера

```json
{
  "project": "Логистический дашборд Кубарева Михаила",
  "design_system": "Lazywebs Minimalistic",
  "current_state": "Функционал завершён. Все фильтры, парсеры, экспорт работают. Нужен только визуал.",

  "lazywebs_references": {
    "style": "Minimalistic, clean, airy, professional",
    "card_style": "bg-white rounded-xl shadow-sm border border-slate-200, padding: 24px, gap: 16px",
    "dark_card_style": "dark:bg-slate-800 dark:border-slate-700",
    "background": "bg-slate-50 → dark:bg-slate-900",
    "accent": "blue-600 (#2563eb)",
    "typography": "font-sans (Inter), headings: font-semibold, data: font-mono text-xs",
    "radius": "rounded-xl (12px), buttons: rounded-lg (8px), KPI icon bg: rounded-full",
    "shadows": "shadow-sm (cards), hover:shadow-md (interactive cards)",
    "spacing": "section gap: 24px, card padding: 24px, KPI grid gap: 12px"
  },

  "files_to_modify": {
    "src/Dashboard.jsx": "Добавить dark: классы, анимации, sparklines, heatmap, интерактивную легенду",
    "src/index.css": "Добавить @keyframes для count-up анимации, скелетон-лоадеры, print-стили",
    "src/Dashboard.jsx": "Добавить компонент ThemeToggle (☀️/🌙)",
    "src/Dashboard.jsx": "Добавить компонент AnimatedNumber для KPI",
    "src/Dashboard.jsx": "Добавить компонент Sparkline в KPI-карточки"
  },

  "do_not_modify": {
    "src/markdownParser.js": "Парсер Markdown-таблиц",
    "src/excelLoader.js": "Загрузчик Excel → Markdown",
    "src/defaultData.js": "Дефолтные данные",
    "scripts/xlsx_to_md.cjs": "CLI-конвертер",
    "Любую логику": "parseData, applyFilters, generateInsights, aggregateByCategory, aggregateByMonth, aggregateLossReasons, хендлеры загрузки/печати/истории, фильтры (категория + месяцы), useMemo цепочки"
  },

  "tasks": [
    {
      "id": "theme_toggle",
      "title": "Переключатель тёмной темы",
      "priority": "P0",
      "lazywebs_ref": "Linear.app dark mode toggle — иконка солнца/луны в header",
      "implementation": [
        "Добавить useState('light') в Dashboard",
        "Обернуть корневой div в dark: класс (через Tailwind darkMode: 'class')",
        "Кнопка ThemeToggle в header справа: Sun/Moon иконки из lucide-react",
        "Применить dark: префикс ко ВСЕМ элементам:",
        "  - bg-slate-50 → dark:bg-slate-900",
        "  - bg-white → dark:bg-slate-800",
        "  - text-slate-900 → dark:text-slate-100",
        "  - text-slate-500 → dark:text-slate-400",
        "  - border-slate-200 → dark:border-slate-700",
        "  - bg-slate-100 → dark:bg-slate-700",
        "  - textarea bg-white → dark:bg-slate-800 dark:text-slate-100",
        "  - select bg-white → dark:bg-slate-800",
        "  - кнопки-фильтры: dark:hover:bg-slate-700",
        "Сохранять выбор в localStorage ('theme': 'light'|'dark')"
      ]
    },
    {
      "id": "animated_kpi",
      "title": "Анимированные KPI-счётчики",
      "priority": "P1",
      "lazywebs_ref": "Stripe Dashboard — числа плавно накручиваются при переходе между периодами",
      "implementation": [
        "Создать компонент AnimatedNumber: принимает target (число) и duration (мс)",
        "Использовать requestAnimationFrame для плавного изменения от 0 до target",
        "Сбрасывать анимацию при изменении target (смена фильтра / данных)",
        "Easing: ease-out (cubic-bezier)",
        "Длительность: 1200ms",
        "Применить к каждому KPI-значению: totalRequests, conversion, junkPct, avgPerMonth",
        "Формат: целые числа без анимации запятой, проценты с 1 знаком"
      ]
    },
    {
      "id": "kpi_trend_arrows",
      "title": "Стрелки тренда в KPI (уже есть, доработать визуал)",
      "priority": "P1",
      "lazywebs_ref": "Vercel Analytics — стрелки зелёные ↑ / красные ↓ рядом с метрикой, с % изменения",
      "implementation": [
        "Компонент TrendArrow уже существует. Доработать:",
        "  - Анимировать появление стрелки (fade-in + slide-up)",
        "  - Добавить tooltip при наведении: «Предыдущий период: X»",
        "  - Размер: text-xs, gap: 4px"
      ]
    },
    {
      "id": "sparklines",
      "title": "Sparklines в KPI-карточках",
      "priority": "P1",
      "lazywebs_ref": "Vercel Analytics — мини-график тренда внутри карточки метрики, без осей, только линия",
      "implementation": [
        "В каждую KPI-карточку добавить мини-Sparkline (40×20px)",
        "Данные: последние 6 месяцев из monthData",
        "Для «Всего запросов» — линия общего кол-ва",
        "Для «Конверсия» — линия конверсии",
        "Для «Мусорные» — линия % мусора (инвертированная)",
        "Реализация: встроенный SVG <path> (без Recharts, для лёгкости)",
        "Цвет линии = цвет иконки KPI",
        "Без осей, без сетки, только кривая"
      ]
    },
    {
      "id": "heatmap",
      "title": "Heatmap-календарь нагрузки",
      "priority": "P2",
      "lazywebs_ref": "GitHub contribution graph — сетка ячеек, цвет от интенсивности",
      "implementation": [
        "Добавить секцию «Тепловая карта нагрузки» между Line Chart и Умными подсказками",
        "Сетка: 11 колонок (месяцы) × 1 строка",
        "Цвет ячейки: slate-100 (0) → blue-200 → blue-400 → blue-600 (max запросов)",
        "В ячейке число запросов за месяц",
        "Подпись месяца под ячейкой (коротко: июнь25, июль25...)",
        "При наведении: tooltip «Месяц: X запросов»"
      ]
    },
    {
      "id": "interactive_legend",
      "title": "Интерактивная легенда графиков",
      "priority": "P1",
      "lazywebs_ref": "Recharts official examples — клик по легенде скрывает/показывает серию",
      "implementation": [
        "Обернуть Legend в кастомный обработчик клика",
        "При клике на элемент легенды — скрыть/показать соответствующую серию на графике",
        "Скрытая серия: opacity-30 на легенде",
        "Применить ко всем 3 графикам: Donut, Stacked Bar, Line Chart",
        "Использовать state: hiddenSeries (Set) в Dashboard"
      ]
    },
    {
      "id": "micro_interactions",
      "title": "Микро-взаимодействия",
      "priority": "P2",
      "lazywebs_ref": "Linear.app — hover: карточка приподнимается, кнопка сжимается, скелетон при загрузке",
      "implementation": [
        "KPI-карточки: hover:shadow-md hover:-translate-y-0.5 transition-all duration-200",
        "График-карточки: hover:shadow-md transition-shadow duration-200",
        "Кнопки: active:scale-95 transition-transform",
        "Скелетон-лоадер при загрузке Excel:",
        "  - Показывать placeholder-карточки (animate-pulse bg-slate-200 rounded-xl)",
        "  - 5 скелетон-KPI + 2 скелетон-графика",
        "  - Длительность: пока isLoading === true",
        "Insight-карточки: hover:translate-x-1 transition-transform (лёгкий сдвиг вправо)"
      ]
    },
    {
      "id": "print_styles",
      "title": "Стили для печати (уже частично есть, доработать)",
      "priority": "P2",
      "implementation": [
        "В index.css добавить @media print { ... }",
        "Скрыть: .no-print (textarea, кнопки, фильтры, header-история)",
        "Фон: белый, текст: чёрный",
        "Графики: уменьшить высоту (h-64 → h-48), убрать тени",
        "KPI: grid-cols-5, без теней",
        "Insight-карточки: цветной border-left оставить (печатается), фон убрать",
        "Добавить колонтитул: «Логистический дашборд • Кубарев Михаил • {дата}»"
      ]
    }
  ],

  "delivery_format": {
    "description": "Выдай ПОЛНЫЙ код файлов src/Dashboard.jsx и src/index.css с ВСЕМИ изменениями. Не используй placeholder'ы и '// ... остальное без изменений'. Каждый файл должен быть полным и готовым к запуску.",
    "files": [
      "src/Dashboard.jsx — полный файл (все 400+ строк)",
      "src/index.css — полный файл с @keyframes, @media print, скелетонами"
    ]
  }
}
```

---

## Блок 3: Готовый промт «одним сообщением»

Скопируй текст ниже и отправь нейросети-кодеру (Claude, GPT, Cursor) одним сообщением:

---

```
Ты — Senior UI/UX Designer и Frontend-разработчик.
Стиль: lazywebs minimalistic (референсы: Linear.app, Vercel Analytics, Stripe Dashboard).

Возьми JSON-спек ниже и реализуй ВСЕ задачи.
ВАЖНО: не трогай логику парсинга, фильтров, загрузки Excel, инсайтов.
Только визуал: Tailwind-классы, анимации, тёмная тема, sparklines, heatmap, микро-взаимодействия.

[ВСТАВИТЬ JSON ИЗ БЛОКА 2]

Выдай два файла полностью:
1. src/Dashboard.jsx
2. src/index.css
```

---

## Блок 4: Промт «одним сообщением» (облегчённый)

Если нейросеть не тянет весь объём, можно разбить на 2 прохода:

### Проход 1: Тёмная тема + анимации

```
Ты — Tailwind CSS эксперт. Стиль: lazywebs minimalistic.

Задача: добавить тёмную тему (dark:) и анимированные KPI-счётчики (AnimatedNumber) в React-дашборд.

[ВСТАВИТЬ КОД src/Dashboard.jsx и src/index.css]

Выдай оба файла полностью.
```

### Проход 2: Sparklines + Heatmap + Микро-взаимодействия

```
Ты — React + Recharts эксперт. Стиль: lazywebs minimalistic.

Задача: добавить sparklines в KPI-карточки, heatmap-календарь и микро-взаимодействия (hover, skeleton-loader, клик по легенде).

[ВСТАВИТЬ КОД ПОСЛЕ ПРОХОДА 1]

Выдай оба файла полностью.
```
