# Финальный план: функционал + дизайн (разделение труда)

## Стратегия разделения

```
┌─────────────────────────────────────────────────┐
│            ЧТО ДЕЛАЕМ МЫ (Code Mode)            │
│  Вся логика, парсинг, фильтры, экспорт, данные │
│  → Дашборд полностью функционален              │
└────────────────────────┬────────────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  ГОТОВЫЙ JSON-СПЕК   │
              │  (описание каждого   │
              │   компонента)        │
              └──────────┬───────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────┐
│          ЧТО ДЕЛАЕТ НЕЙРОСЕТЬ (Дизайн)          │
│  Только визуал: анимации, sparklines, heatmap,  │
│  тёмная тема, микро-взаимодействия              │
│  → Картинки, CSS-сниппеты, дизайн-референсы     │
└─────────────────────────────────────────────────┘
```

---

## Этап 1: Функционал (Code Mode — делаем мы)

### 🔴 Критичные

| # | Задача | Файлы | Результат |
|---|--------|-------|-----------|
| 1.1 | **Фильтр по категориям** | `Dashboard.jsx` | `<Select>` с категориями: «Все», «Прямое ж/д», «Морской фрахт», «Скидки». Графики + KPI пересчитываются |
| 1.2 | **Фильтр по диапазону месяцев** | `Dashboard.jsx` | Кнопки: «3 мес», «6 мес», «Все». Или два `<input type="month">` |
| 1.3 | **Валидация ввода** | `Dashboard.jsx`, `markdownParser.js` | После парсинга показывать: «✅ 18 строк, ⚠️ 2 ошибки» + подсветка проблемных строк в textarea |
| 1.4 | **Экспорт в PDF / печать** | `Dashboard.jsx` | Кнопка «Скачать отчёт». Использовать `window.print()` с `@media print` CSS или `html2canvas` + `jspdf` |

### 🟡 Важные

| # | Задача | Файлы | Результат |
|---|--------|-------|-----------|
| 1.5 | **Стрелки сравнения KPI** | `Dashboard.jsx` | «Конверсия: 12% ↓2% к пред. месяцу» — зелёная ↑ / красная ↓ |
| 1.6 | **Сохранение истории** | `Dashboard.jsx` | localStorage: последние 5 анализов (дата + название + кол-во запросов). Список над textarea |

---

## Этап 2: Подготовка спека для нейросети-дизайнера

После завершения Этапа 1 дашборд **полностью функционален**. У него есть:
- Все фильтры
- Все графики с реальными данными
- Экспорт в PDF
- Валидация
- История

**Нейросети остаётся ТОЛЬКО визуал.** Ниже — точный спек, который мы ей передадим.

---

### Спек для нейросети-дизайнера (JSON + описания)

```json
{
  "project": "Логистический дашборд Кубарева Михаила",
  "stack": "React 18 + Tailwind CSS 4 + Recharts + Lucide Icons",
  "current_state": "Полностью функционален. Все фильтры, парсеры, экспорт работают.",
  "design_system": {
    "background": "bg-slate-50",
    "cards": "bg-white rounded-xl shadow-sm border border-slate-200",
    "accent": "blue-600 (#2563eb)",
    "status_colors": {
      "success": "green (#22c55e)",
      "danger": "red (#ef4444)",
      "warning": "yellow (#eab308)",
      "info": "blue (#3b82f6)"
    },
    "border_radius": "12-16px",
    "fonts": "font-sans (Inter/system), textarea: font-mono"
  },
  "tasks_for_designer": [
    {
      "id": "dark_theme",
      "priority": "high",
      "description": "Добавить переключатель светлая/тёмная тема. Использовать Tailwind dark: префикс.",
      "colors_dark": {
        "background": "dark:bg-slate-900",
        "cards": "dark:bg-slate-800 dark:border-slate-700",
        "text": "dark:text-slate-100",
        "subtext": "dark:text-slate-400"
      },
      "deliverable": "CSS-классы для всех компонентов + компонент ThemeToggle"
    },
    {
      "id": "animated_kpi_counters",
      "priority": "medium",
      "description": "KPI-цифры анимированно накручиваются от 0 до значения при первом рендере (и при смене данных).",
      "current_kpi_cards": "5 карточек: Всего запросов, Конверсия, Мусорные, Среднее в месяц, Месяцев данных",
      "animation_spec": "ease-out, duration 1.5s, только при изменении данных",
      "deliverable": "React-компонент AnimatedNumber или CSS-анимация count-up"
    },
    {
      "id": "sparklines_in_kpi",
      "priority": "medium",
      "description": "В каждую KPI-карточку добавить мини-график тренда (sparkline) за последние 6 месяцев. Без осей, только линия.",
      "data_available": "Помесячные данные в monthData (Заказы, Сделка сорвалась, Не прошли по цене, Прочие потери)",
      "deliverable": "Компонент Sparkline (SVG или Recharts мини-график)"
    },
    {
      "id": "heatmap_calendar",
      "priority": "low",
      "description": "Календарь на 11 месяцев (июнь25–апрель26). Цвет ячейки = интенсивность запросов. Как GitHub contribution graph.",
      "data_available": "monthData: { month, Заказы, ... } — есть общее кол-во за каждый месяц",
      "color_scale": "slate-100 (0) → blue-200 → blue-400 → blue-600 (max)",
      "deliverable": "React-компонент HeatmapCalendar"
    },
    {
      "id": "interactive_chart_legend",
      "priority": "medium",
      "description": "Клик по элементу легенды скрывает/показывает соответствующую серию на всех трёх графиках.",
      "current_charts": "Donut (причины потерь), Stacked Bar (категории), Line (динамика по месяцам)",
      "deliverable": "Обёртка для Recharts с toggleLegend"
    },
    {
      "id": "micro_interactions",
      "priority": "medium",
      "description": "Добавить микро-анимации: hover на карточках (подъём + тень), pulse на кнопке загрузки, skeleton-loader при загрузке Excel.",
      "deliverable": "Tailwind-классы для hover/pulse/skeleton"
    },
    {
      "id": "print_styles",
      "priority": "high",
      "description": "Стили для @media print: скрыть textarea и кнопки, показать только KPI + графики + инсайты. Белый фон, чёрный текст.",
      "deliverable": "CSS-правила в index.css"
    }
  ],
  "do_not_touch": [
    "Парсер данных (markdownParser.js)",
    "Загрузчик Excel (excelLoader.js)",
    "Логика фильтров и агрегаций",
    "Умные подсказки (generateInsights)",
    "CLI-скрипт (xlsx_to_md.cjs)"
  ]
}
```

---

## Этап 3: Порядок выполнения (общий)

```
Неделя 1 (Code Mode):
  ├── 1.1 Фильтр по категориям (Select)
  ├── 1.2 Фильтр по диапазону месяцев
  ├── 1.3 Валидация ввода
  └── 1.4 Экспорт в PDF

Неделя 2 (Code Mode):
  ├── 1.5 Стрелки сравнения KPI
  └── 1.6 Сохранение истории (localStorage)

─── ПЕРЕДАЧА НЕЙРОСЕТИ-ДИЗАЙНЕРУ ───

Неделя 3 (Дизайн-нейросеть):
  ├── Тёмная тема (dark: классы)
  ├── Анимированные KPI-счётчики
  ├── Sparklines в карточках
  ├── Heatmap-календарь
  ├── Интерактивная легенда графиков
  ├── Микро-взаимодействия (hover, pulse, skeleton)
  └── Print-стили
```

---

## Итоговая карта файлов после завершения

```
src/
├── Dashboard.jsx          ← весь UI + логика (единый файл)
├── markdownParser.js      ← парсер Markdown-таблиц
├── excelLoader.js         ← браузерный загрузчик .xlsx
├── defaultData.js         ← дефолтные данные (Markdown)
├── index.css              ← Tailwind + print-стили
└── main.jsx               ← точка входа
scripts/
└── xlsx_to_md.cjs         ← CLI-конвертер
data/
└── kubarev_all_months.md  ← эталонный Markdown
plans/
├── final_plan.md          ← этот план
├── design_spec.md         ← спек для нейросети (отдельно)
└── ...                    ← предыдущие планы
```

---

## Что передать нейросети

Готовый JSON-спек выше + скриншоты текущего дашборда + команда:

> «Возьми этот JSON-спек и примени все задачи из `tasks_for_designer`. Не трогай логику: парсеры, фильтры, инсайты. Только CSS-классы Tailwind, анимации и визуальные компоненты. Выдай финальный `Dashboard.jsx` и `index.css`.»
