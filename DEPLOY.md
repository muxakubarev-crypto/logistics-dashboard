# Как разместить дашборд в интернете (Vercel) + обновление

Твой сайт: **https://logistics-dashboard-rho-sand.vercel.app**

---

## Как обновить сайт (3 команды)

Открой `Win+R → cmd`:
```
cd C:\Users\Mike\Desktop\WorkDASHBOARD
git add .
git commit -m "Обновление"
git push
```
Сайт обновится за 30-60 секунд.

---

## Как обновить данные (добавить новый месяц)

### Способ 1: Через дашборд (рекомендуемый)

1. На сайте войди как админ (логин `muxakub`, пароль `08250825`)
2. Кнопка «Управление месяцами» → «Добавить месяц»
3. Загрузи Excel или вставь Markdown
4. Нажми «Внести данные»

**Данные сохраняются в Upstash Redis (облако) — ВСЕ гости сразу видят изменения.**
Больше не нужно делать `git push` для обновления данных!

---

## Как поднять сайт с нуля

### Один раз установить

1. **Git**: скачай с https://git-scm.com/download/win → установи (везде Next)
2. **GitHub**: зарегистрируйся на https://github.com
3. **Vercel CLI**: в `Win+R → cmd` введи `npm install -g vercel`

### Первый деплой + настройка Redis

```
cd C:\Users\Mike\Desktop\WorkDASHBOARD
git init
git add .
git commit -m "Первая версия"
```
Создай репозиторий на https://github.com/new (название `logistics-dashboard`, без галочек)
```
git remote add origin https://github.com/ТВОЙ_ЛОГИН/logistics-dashboard.git
git branch -M main
git push -u origin main
vercel
```
На все вопросы Enter. Сайт в интернете через 30 секунд.

### ⚡ Настройка Upstash Redis (обязательно!)

Без этого данные НЕ будут сохраняться между сессиями:

1. Зайди в Vercel Dashboard → твой проект → **Storage**
2. Нажми **Create Database** → выбери **Upstash Redis**
3. Выбери бесплатный план (256 MB) → **Create**
4. После создания Vercel автоматически добавит переменные:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
5. Сделай повторный деплой: `vercel --prod` (или `git push`)

---

## FAQ

**Гости видят пустой дашборд?**
Нет. При первом запуске система заполнит Redis начальными данными (11 месяцев из кода). Дальше все видят одно и то же.

**Админ добавил месяц — гость видит?**
Да, мгновенно. Данные хранятся в облачном Redis, не в браузере.

**Сколько стоит?**
0 рублей. Vercel бесплатный, Upstash Redis бесплатный (до 256 МБ).

**Что если Redis недоступен?**
Система использует встроенные данные (`initialData.js`) как fallback.
