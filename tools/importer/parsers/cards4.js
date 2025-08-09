/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the cards list
  const ul = element.querySelector('ul');
  if (!ul) return;
  const lis = Array.from(ul.children).filter(li => li.tagName === 'LI');

  const rows = [['Cards']]; // Block header matches the example

  lis.forEach(li => {
    // Find the image/icon div (first child)
    const imgDiv = li.querySelector('.cards-card-image');
    // Find the text content/body div (second child)
    const bodyDiv = li.querySelector('.cards-card-body');

    // Fallback: if either element is missing, use empty string for that cell
    rows.push([
      imgDiv || '',
      bodyDiv || ''
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
