import INITIAL_DATA from './initialData.js';

const DEFAULT_TEXT = (() => {
  const months = ['январь','февраль','март','апрель','май','июнь','июль','август','сентябрь','октябрь','ноябрь','декабрь'];
  const sorted = Object.keys(INITIAL_DATA).sort((a,b)=>{
    const [ma,ya]=a.split(' '); const [mb,yb]=b.split(' ');
    return (parseInt(ya)*100+months.indexOf(ma.toLowerCase())) - (parseInt(yb)*100+months.indexOf(mb.toLowerCase()));
  });
  let md = `# Данные запросов: Кубарев Михаил\n\n> Источник: JSON\n\n`;
  for(const m of sorted){
    const d=INITIAL_DATA[m]; if(!d||!d.categories) continue;
    md += `## ${m}\n\n| Исполнитель | Категория | Заказ | Сделка сорвалась | Не прошли по цене | Долго считали | Клиент не отвечает | Формальный запрос | Нет обратной связи | Всего |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n`;
    for(const c of d.categories){
      const t=v=>v===0?'':v;
      md += `| Кубарев Михаил | ${c.category} | ${t(c.order)} | ${t(c.dealFell)} | ${t(c.priceFail)} | ${t(c.slowCalc)} | ${t(c.clientSilent)} | ${t(c.formal)} | ${t(c.noFeedback)} | ${c.total} |\n`;
    }
    md+='\n';
  }
  return md;
})();

export { INITIAL_DATA };
export default DEFAULT_TEXT;
