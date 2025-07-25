/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cards block
  const cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;
  const ul = cardsBlock.querySelector('ul');
  if (!ul) return;
  const lis = Array.from(ul.children).filter(li => li.tagName === 'LI');

  // Build rows: header then one row per card with [image, text]
  const rows = [['Cards']];
  lis.forEach(li => {
    // Image cell: prefer <picture> if available
    let imgCell = '';
    const imgDiv = li.querySelector('.cards-card-image');
    if (imgDiv) {
      const picture = imgDiv.querySelector('picture');
      if (picture) {
        imgCell = picture;
      } else {
        const img = imgDiv.querySelector('img');
        if (img) imgCell = img;
      }
    }

    // Text cell: use the .cards-card-body div
    let textCell = '';
    const bodyDiv = li.querySelector('.cards-card-body');
    if (bodyDiv) textCell = bodyDiv;

    rows.push([imgCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
