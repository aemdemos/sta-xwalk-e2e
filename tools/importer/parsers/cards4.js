/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to wrap content with field comment
  function wrapWithFieldComment(field, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${field} `));
    frag.appendChild(content);
    return frag;
  }

  // Find the cards block (the direct child with class 'cards block')
  const cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;

  // Find all card items (li's inside ul)
  const cardItems = cardsBlock.querySelectorAll('ul > li');

  // Table header row
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  cardItems.forEach((li) => {
    // Image cell
    const imgDiv = li.querySelector('.cards-card-image');
    let imageCell = '';
    if (imgDiv) {
      // Use the picture element directly if present
      const picture = imgDiv.querySelector('picture');
      if (picture) {
        imageCell = wrapWithFieldComment('image', picture);
      }
    }

    // Text cell
    const bodyDiv = li.querySelector('.cards-card-body');
    let textCell = '';
    if (bodyDiv) {
      // Use the bodyDiv directly (contains <p><strong>...</strong></p> and <p>desc</p>)
      textCell = wrapWithFieldComment('text', bodyDiv);
    }

    rows.push([imageCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
