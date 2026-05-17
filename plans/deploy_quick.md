# Инструкция по деплою (быстрая)

## Сейчас у тебя в терминале (Win+R → cmd)

```
cd C:\Users\Mike\Desktop\WorkDASHBOARD
```

### Шаг 1: Убрать node_modules из Git + добавить .gitignore

```
git rm -r --cached node_modules
git add .gitignore
git commit -m "Добавлен .gitignore"
```

### Шаг 2: Создать репозиторий на GitHub (если ещё нет)

1. Зайди на https://github.com/new
2. Repository name: `logistics-dashboard`
3. **НЕ ставь галочки** (ни README, ни .gitignore, ни license)
4. Нажми «Create repository»

### Шаг 3: Привязать GitHub и отправить код

```
git remote add origin https://github.com/muxakubarev-crypto/logistics-dashboard.git
git branch -M main
git push -u origin main
```

### Шаг 4: Деплой на Vercel

```
vercel
```

На все вопросы жми Enter. Через 30 секунд сайт в интернете!

---

## Как обновлять сайт после изменений

```
cd C:\Users\Mike\Desktop\WorkDASHBOARD
git add .
git commit -m "Обновление"
git push
vercel --prod
```

Vercel автоматически задеплоит новую версию за 30 секунд.
