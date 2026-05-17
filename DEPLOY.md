# Как разместить дашборд в интернете (Vercel) — с общими данными

Vercel — бесплатный хостинг. Твой дашборд: **https://logistics-dashboard-rho-sand.vercel.app**

---

## Часть 1: Как обновлять сайт

3 команды в `Win+R → cmd`:
```
cd C:\Users\Mike\Desktop\WorkDASHBOARD
git add .
git commit -m "Обновление"
git push
```
Сайт обновится за 30-60 секунд.

---

## Часть 2: Настройка общих данных (Vercel KV — Redis)

Чтобы данные были видны всем гостям, а не только тебе.

### Что нужно сделать в личном кабинете Vercel

#### Шаг 1: Зайди в проект
- Открой https://vercel.com/dashboard
- Нажми на проект `logistics-dashboard`

#### Шаг 2: Открой вкладку Storage
- В левом меню найди и нажми **Storage**
- Нажми кнопку **Create Database**

#### Шаг 3: Выбери тип базы данных
- В списке найди **Upstash Redis**
- Нажми **Continue**

#### Шаг 4: Выбери бесплатный план
- Выбери план **Free** (бесплатно, до 256 МБ)
- Нажми **Create**

#### Шаг 5: Подключи базу к проекту
- Появится окно «Connect to project»
- Убедись, что выбран проект `logistics-dashboard`
- Поле «Custom Environment Variable Prefix» оставь **пустым**
- Нажми **Connect**

#### Шаг 6: Передеплой сайта (важно!)
- В левом меню нажми **Deployments**
- Нажми на три точки `...` справа от последнего деплоя
- Выбери **Redeploy**
- В появившемся окне нажми **Redeploy** ещё раз

Жди 30-60 секунд. Когда статус станет «Ready» — база подключена!

#### Шаг 7: Проверь
Открой эту ссылку в браузере:
```
https://logistics-dashboard-rho-sand.vercel.app/api/data
```

Должен показаться JSON с данными за все 11 месяцев. Если показался — всё работает!

#### Шаг 8: Открой сайт в другом браузере (проверка)
- Открой https://logistics-dashboard-rho-sand.vercel.app в режиме инкогнито или другом браузере
- Данные должны быть те же, что и у тебя
- Если нет — напиши мне

---

## Часть 3: Как поднять сайт с нуля

### Один раз установить

#### 1. Git
Скачай: https://git-scm.com/download/win → установи (везде Next)

#### 2. GitHub
Зарегистрируйся: https://github.com → Sign up

#### 3. Vercel CLI
В `Win+R → cmd`:
```
npm install -g vercel
```

### Первый деплой

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
На все вопросы Enter. Затем настрой KV по инструкции из Части 2.

---

## Часто задаваемые вопросы

**Сколько стоит?**
0 рублей. Vercel и Upstash Redis бесплатны.

**Данные видны всем?**
Да. Админ добавляет → сохраняются в облаке → гости видят.

**Что делать если не работает?**
Проверь `/api/data` — должен быть JSON с данными. Если ошибка — сделай Redeploy (шаг 6).
