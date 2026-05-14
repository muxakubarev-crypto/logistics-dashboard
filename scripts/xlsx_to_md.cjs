/**
 * CLI-скрипт: конвертирует все месячные вкладки Excel в Markdown-таблицу.
 * Использование:
 *   node scripts/xlsx_to_md.js [путь_к_xlsx]
 *   node scripts/xlsx_to_md.js                               (ищет *xlsx в корне)
 *   node scripts/xlsx_to_md.js --only-kubarev                 (только строки Кубарева)
 *   npm run convert
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// ─── Аргументы ───
const args = process.argv.slice(2);
const onlyKubarev = args.includes('--only-kubarev');

// Поиск .xlsx файла
let xlsxPath = args.find(a => a.endsWith('.xlsx'));
if (!xlsxPath) {
  const rootFiles = fs.readdirSync(path.join(__dirname, '..')).filter(f => f.endsWith('.xlsx'));
  if (rootFiles.length === 0) {
    console.error('❌ Не найден .xlsx файл. Укажите путь: node scripts/xlsx_to_md.js файл.xlsx');
    process.exit(1);
  }
  xlsxPath = path.join(__dirname, '..', rootFiles[0]);
  console.log(`📄 Найден файл: ${rootFiles[0]}`);
}

// ─── Чтение Excel ───
const wb = XLSX.readFile(xlsxPath);

// Месячные вкладки (исключаем «Аналитика», «Лист2», etc.)
const monthSheets = [
  'июнь 2025', 'июль 2025', 'август 2025', 'сентябрь 2025',
  'октябрь 2025', 'ноябрь 2025', 'декабрь 2025',
  'январь 2026', 'февраль 2026', 'март 2026', 'апрель 2026',
];

// Проверяем, какие вкладки реально есть
const availableSheets = monthSheets.filter(s => wb.SheetNames.includes(s));
console.log(`📋 Найдено вкладок: ${availableSheets.length} из 11`);

// ─── Заголовки колонок ───
const HEADERS = [
  'Исполнитель', 'Категория',
  'Заказ', 'Сделка сорвалась', 'Не прошли по цене', 'Долго считали',
  'Клиент не отвечает', 'Формальный запрос', 'Нет обратной связи', 'Всего',
];

// ─── Обработка каждой вкладки ───
let output = `# Данные запросов: ${path.basename(xlsxPath, '.xlsx')}\n\n`;
output += `> Автосгенерировано: ${new Date().toISOString().split('T')[0]}\n`;
output += `> Вкладок: ${availableSheets.length}\n`;
output += `> Режим: ${onlyKubarev ? 'Только Кубарев Михаил' : 'Все исполнители'}\n\n`;

let totalRows = 0;
let grandTotal = 0;

for (const sheetName of availableSheets) {
  const ws = wb.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
  if (data.length < 3) continue;

  let lastManager = '';
  const rows = [];

  // Пропускаем первые 2 строки (заголовок Excel)
  for (let i = 2; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0 || row.every(c => c === '' || c === null)) continue;

    // Имя менеджера (col 0), если пусто — наследуем сверху
    const managerRaw = String(row[0] || '').trim();
    const manager = managerRaw || lastManager;
    if (managerRaw) lastManager = managerRaw;

    // Категория (col 1)
    const category = String(row[1] || '').trim();
    if (!category) continue;

    // Фильтр: только Кубарев
    if (onlyKubarev && manager !== 'Кубарев Михаил') continue;

    // Цифры: col 2–9
    const nums = [];
    for (let j = 2; j <= 9; j++) {
      const v = String(row[j] || '').trim();
      nums.push(v === '' ? '' : Number(v) || 0);
    }

    rows.push([manager, category, ...nums]);
    totalRows++;
    grandTotal += nums[7] || 0; // колонка «Всего» (8-й элемент, индекс 7)
  }

  if (rows.length === 0) continue;

  // Формируем Markdown для вкладки
  output += `## ${sheetName}\n\n`;
  output += '| ' + HEADERS.join(' | ') + ' |\n';
  output += '| ' + HEADERS.map(() => '---').join(' | ') + ' |\n';

  for (const row of rows) {
    // Пустые имена менеджеров заменяем на '' (так красивее в таблице)
    const displayRow = [...row];
    // Форматируем строку таблицы
    output += '| ' + displayRow.map(c => String(c)).join(' | ') + ' |\n';
  }
  output += '\n';
}

// ─── Сводка ───
output += `---\n\n`;
output += `## Сводка\n\n`;
output += `- **Всего строк:** ${totalRows}\n`;
output += `- **Общее кол-во запросов:** ${grandTotal}\n`;
output += `- **Период:** ${availableSheets[0]} – ${availableSheets[availableSheets.length - 1]}\n`;

// ─── Сохранение ───
const outDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const outPath = path.join(outDir, 'kubarev_all_months.md');
fs.writeFileSync(outPath, output, 'utf-8');

console.log(`\n✅ Готово: ${outPath}`);
console.log(`   Строк: ${totalRows}, Запросов всего: ${grandTotal}`);
