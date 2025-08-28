/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards4)'];
  const ul = element.querySelector('ul');
  if (!ul) return;
  const rows = [headerRow];
  ul.querySelectorAll(':scope > li').forEach((li) => {
    const imgDiv = li.querySelector('.cards-card-image');
    const textDiv = li.querySelector('.cards-card-body');
    if (imgDiv && textDiv) {
      rows.push([imgDiv, textDiv]);
    } else if (imgDiv) {
      rows.push([imgDiv, '']);
    } else if (textDiv) {
      rows.push(['', textDiv]);
    }
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
