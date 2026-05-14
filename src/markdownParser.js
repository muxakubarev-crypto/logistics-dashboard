/**
 * Парсер Markdown-таблиц в формате дашборда.
 * Принимает Markdown-строку → возвращает массив объектов строк.
 *
 * Поддерживаемый формат Markdown:
 *   ## Месяц Год
 *   | Исполнитель | Категория | Заказ | ... | Всего |
 *   |---|---|---|...|---|
 *   | Имя | Категория | 20 | 0 | ... | 60 |
 *
 * Правила:
 * - Заголовок ## задаёт текущий месяц
 * - Первая |...| строка после ## или разделителя — заголовок таблицы (пропускается)
 * - |---|...|---| — разделитель (пропускается)
 * - Остальные |...| строки — данные
 * - Пустые ячейки → 0
 * - Имя менеджера наследуется из строки выше, если пустое
 */

/**
 * @param {string} markdownText - сырой Markdown-текст
 * @param {string} [filterManager] - если задан, вернуть только строки этого менеджера
 * @returns {Array<{month, manager, category, order, dealFell, priceFail, slowCalc, clientSilent, formal, noFeedback, total}>}
 */
export function parseMarkdownTable(markdownText, filterManager = null) {
  const lines = markdownText.split('\n');
  const rows = [];

  let currentMonth = '';
  let lastManager = '';
  let skipNextRow = false; // true = следующая НЕ-разделительная |...| строка — заголовок, пропускаем

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      // Пустая строка — следующий |...| будет заголовком новой таблицы
      skipNextRow = true;
      continue;
    }

    // Маркер месяца: ## июнь 2025
    if (line.startsWith('## ')) {
      currentMonth = line.replace(/^##\s+/, '').trim();
      lastManager = '';
      skipNextRow = true; // первый |...| после ## — заголовок таблицы
      continue;
    }

    // Пропускаем строки, не похожие на строки таблицы
    if (!line.startsWith('|') || !line.endsWith('|')) continue;

    // Пропускаем разделитель: |---|...|---|
    if (/^\|[\s\-:]+\|/.test(line)) {
      continue;
    }

    // Заголовок таблицы (первая |...| строка после ##, пустой строки или разделителя)
    if (skipNextRow) {
      skipNextRow = false;
      continue;
    }

    // Разбор ячеек: split('|') даёт пустые строки в начале и конце (т.к. строка начинается и заканчивается на |).
    // slice(1, -1) убирает их, оставляя ровно 10 колонок данных.
    const cells = line
      .split('|')
      .slice(1, -1)
      .map(c => c.trim());

    // Ожидаем минимум 10 колонок
    if (cells.length < 10) continue;

    const managerRaw = cells[0];
    const manager = managerRaw || lastManager;
    if (managerRaw) lastManager = managerRaw;

    const category = cells[1];
    if (!category) continue;

    // Фильтр по менеджеру
    if (filterManager && manager !== filterManager) continue;

    const toNum = (idx) => {
      const v = cells[idx] || '';
      return v === '' ? 0 : parseInt(v, 10) || 0;
    };

    rows.push({
      month:        currentMonth || 'Без месяца',
      manager,
      category,
      order:        toNum(2),  // Заказ
      dealFell:     toNum(3),  // Сделка сорвалась
      priceFail:    toNum(4),  // Не прошли по цене
      slowCalc:     toNum(5),  // Долго считали
      clientSilent: toNum(6),  // Клиент не отвечает
      formal:       toNum(7),  // Формальный запрос
      noFeedback:   toNum(8),  // Нет обратной связи
      total:        toNum(9),  // Всего
    });
  }

  return rows;
}
