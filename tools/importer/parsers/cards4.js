/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cards block and its <ul>
  const cardsBlock = element.querySelector('.cards');
  if (!cardsBlock) return;
  const ul = cardsBlock.querySelector('ul');
  if (!ul) return;
  const lis = Array.from(ul.children).filter(li => li.tagName.toLowerCase() === 'li');
  const rows = [['Cards']];
  lis.forEach((li) => {
    // Get the image/icon cell
    const imgDiv = li.querySelector('.cards-card-image');
    // Get the text content cell
    const bodyDiv = li.querySelector('.cards-card-body');
    if (imgDiv && bodyDiv) {
      rows.push([imgDiv, bodyDiv]);
    } else if (imgDiv) {
      rows.push([imgDiv, '']);
    } else if (bodyDiv) {
      rows.push(['', bodyDiv]);
    }
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
