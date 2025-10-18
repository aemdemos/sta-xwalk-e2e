/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards4) block: 2 columns, multiple rows, header row is block name
  // Model fields: image, text (only these two; no hints for alt/title/text)

  // Helper to add field comment before content
  function fieldCell(fieldName, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    frag.appendChild(content);
    return frag;
  }

  // Find the cards container
  const cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;
  const ul = cardsBlock.querySelector('ul');
  if (!ul) return;
  const items = Array.from(ul.children);

  // Header row
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // Each card: image (first cell), text (second cell)
  items.forEach((li) => {
    // Image cell
    const imgDiv = li.querySelector('.cards-card-image');
    let imgCell = '';
    if (imgDiv) {
      // Use the picture element directly
      const picture = imgDiv.querySelector('picture');
      if (picture) {
        imgCell = fieldCell('image', picture);
      }
    }

    // Text cell
    const bodyDiv = li.querySelector('.cards-card-body');
    let textCell = '';
    if (bodyDiv) {
      // Use the bodyDiv directly (contains <p><strong>Title</strong></p> and <p>Description</p>)
      textCell = fieldCell('text', bodyDiv);
    }

    rows.push([imgCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
