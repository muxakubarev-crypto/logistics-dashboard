/**
 * Браузерный загрузчик Excel (.xlsx) → Markdown-строка.
 * Использует пакет xlsx (SheetJS) для чтения ArrayBuffer.
 *
 * Использование:
 *   import { loadExcelAsMarkdown } from './excelLoader.js';
 *   const md = await loadExcelAsMarkdown(file); // File из <input type="file">
 */

import * as XLSX from 'xlsx';

const MONTH_SHEETS = [
  'июнь 2025', 'июль 2025', 'август 2025', 'сентябрь 2025',
  'октябрь 2025', 'ноябрь 2025', 'декабрь 2025',
  'январь 2026', 'февраль 2026', 'март 2026', 'апрель 2026',
];

const HEADERS = [
  'Исполнитель', 'Категория',
  'Заказ', 'Сделка сорвалась', 'Не прошли по цене', 'Долго считали',
  'Клиент не отвечает', 'Формальный запрос', 'Нет обратной связи', 'Всего',
];

/**
 * Читает .xlsx файл, ищет месячные вкладки, возвращает Markdown-строку.
 * @param {File} file - файл из <input type="file">
 * @param {Object} [opts]
 * @param {boolean} [opts.onlyKubarev=true] - фильтровать только Кубарева Михаила
 * @returns {Promise<string>} Markdown-строка
 */
export async function loadExcelAsMarkdown(file, opts = {}) {
  const { onlyKubarev = true } = opts;

  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: 'array' });

  let sheets = MONTH_SHEETS.filter(s => wb.SheetNames.includes(s));
  // Если месячные вкладки не найдены — берём первую вкладку Excel
  if (sheets.length === 0 && wb.SheetNames.length > 0) {
    sheets = [wb.SheetNames[0]];
    console.warn('Месячные вкладки не найдены, используется первая:', sheets[0]);
  }

  let output = `# Данные запросов: ${file.name}\n\n`;
  output += `> Загружено: ${new Date().toLocaleString('ru-RU')}\n`;
  output += `> Вкладок: ${sheets.length}\n`;
  output += `> Режим: ${onlyKubarev ? 'Только Кубарев Михаил' : 'Все исполнители'}\n\n`;

  for (const sheetName of sheets) {
    const ws = wb.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
    if (data.length < 3) continue;

    let lastManager = '';
    const rows = [];

    for (let i = 2; i < data.length; i++) {
      const row = data[i];
      if (!row || row.length === 0 || row.every(c => c === '' || c === null)) continue;

      const managerRaw = String(row[0] || '').trim();
      const manager = managerRaw || lastManager;
      if (managerRaw) lastManager = managerRaw;

      const category = String(row[1] || '').trim();
      if (!category) continue;

      if (onlyKubarev && manager !== 'Кубарев Михаил') continue;

      const nums = [];
      for (let j = 2; j <= 9; j++) {
        const v = String(row[j] || '').trim();
        nums.push(v === '' ? '' : Number(v) || 0);
      }

      rows.push([manager, category, ...nums]);
    }

    if (rows.length === 0) continue;

    output += `## ${sheetName}\n\n`;
    output += '| ' + HEADERS.join(' | ') + ' |\n';
    output += '| ' + HEADERS.map(() => '---').join(' | ') + ' |\n';

    for (const row of rows) {
      output += '| ' + row.map(c => String(c)).join(' | ') + ' |\n';
    }
    output += '\n';
  }

  return output;
}
