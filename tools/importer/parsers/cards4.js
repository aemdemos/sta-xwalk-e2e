/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to wrap content with field comment
  function fieldWrap(field, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${field} `));
    frag.appendChild(content);
    return frag;
  }

  // Find the cards block
  const cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;

  // Get all card items
  const cardItems = Array.from(cardsBlock.querySelectorAll('ul > li'));

  // Table header
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // For each card, extract image and text
  cardItems.forEach((li) => {
    // Image cell
    const imageDiv = li.querySelector('.cards-card-image');
    let imageCell = '';
    if (imageDiv) {
      // Use the <picture> directly
      const picture = imageDiv.querySelector('picture');
      if (picture) {
        imageCell = fieldWrap('image', picture);
      }
    }

    // Text cell
    const bodyDiv = li.querySelector('.cards-card-body');
    let textCell = '';
    if (bodyDiv) {
      // Use the whole bodyDiv (contains <p><strong>...</strong></p> and description)
      textCell = fieldWrap('text', bodyDiv);
    }

    rows.push([imageCell, textCell]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
