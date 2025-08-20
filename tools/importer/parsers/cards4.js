/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cards block within the wrapper
  const cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;
  const ul = cardsBlock.querySelector('ul');
  if (!ul) return;

  // Header row as specified in block documentation
  const rows = [['Cards']];

  // Process each card <li>
  ul.querySelectorAll('li').forEach(li => {
    // Extract image/icon (first cell)
    let imageCell = null;
    const imgContainer = li.querySelector('.cards-card-image');
    if (imgContainer) {
      // Prefer <picture> if present, otherwise <img>
      const picture = imgContainer.querySelector('picture');
      if (picture) {
        imageCell = picture;
      } else {
        const img = imgContainer.querySelector('img');
        if (img) imageCell = img;
      }
    }

    // Extract text content (second cell)
    let textCell = null;
    const bodyContainer = li.querySelector('.cards-card-body');
    if (bodyContainer) {
      textCell = bodyContainer;
    }

    // Always push both cells; if missing, cell will be null
    rows.push([imageCell, textCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
