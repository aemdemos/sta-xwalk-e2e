/* global WebImporter */
export default function parse(element, { document }) {
  // Find the <ul> that contains the cards
  const cardsBlock = element.querySelector('.cards.block') || element;
  const ul = cardsBlock.querySelector('ul');
  if (!ul) return;
  const lis = Array.from(ul.children);
  // Prepare rows: first row is header
  const rows = [['Cards (cards4)']];
  for (const li of lis) {
    // Get image or picture (first cell)
    let imageEl = '';
    const imgDiv = li.querySelector('.cards-card-image');
    if (imgDiv) {
      const picture = imgDiv.querySelector('picture');
      if (picture) imageEl = picture;
      else {
        // fallback to img directly, rare
        const img = imgDiv.querySelector('img');
        if (img) imageEl = img;
      }
    }
    // Get body (second cell)
    let bodyEl = '';
    const bodyDiv = li.querySelector('.cards-card-body');
    if (bodyDiv) bodyEl = bodyDiv;
    rows.push([imageEl, bodyEl]);
  }
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
