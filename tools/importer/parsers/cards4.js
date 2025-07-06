/* global WebImporter */
export default function parse(element, { document }) {
  // Try to find the inner block with .cards.block
  let cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) cardsBlock = element;
  // Find the <ul> containing cards
  const ul = cardsBlock.querySelector('ul');
  if (!ul) return;
  const lis = Array.from(ul.children).filter(li => li.nodeName === 'LI');
  // Prepare block rows, first header
  const rows = [['Cards']];
  lis.forEach((li) => {
    // Extract image/icon (mandatory)
    let imageCell = '';
    const imgDiv = li.querySelector('.cards-card-image');
    if (imgDiv) {
      const pic = imgDiv.querySelector('picture');
      if (pic) {
        imageCell = pic;
      } else {
        const img = imgDiv.querySelector('img');
        if (img) imageCell = img;
      }
    }
    // Extract text content (mandatory)
    let textCell = '';
    const bodyDiv = li.querySelector('.cards-card-body');
    if (bodyDiv) {
      textCell = bodyDiv;
    }
    rows.push([imageCell, textCell]);
  });
  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
