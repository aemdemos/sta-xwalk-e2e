/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a cell with a field comment and content
  function fieldCell(fieldName, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    if (content) frag.appendChild(content);
    return frag;
  }

  // Find the cards block (the UL inside .cards.block)
  const cardsBlock = element.querySelector('.cards.block ul');
  if (!cardsBlock) return;

  // Header row as required
  const headerRow = ['Cards (cards4)'];

  // Collect card rows
  const rows = [];
  cardsBlock.querySelectorAll('li').forEach((li) => {
    // Image cell
    const imgContainer = li.querySelector('.cards-card-image picture');
    let imgCell = null;
    if (imgContainer) {
      imgCell = fieldCell('image', imgContainer);
    }

    // Text cell
    const textContainer = li.querySelector('.cards-card-body');
    let textCell = null;
    if (textContainer) {
      textCell = fieldCell('text', textContainer);
    }

    rows.push([imgCell, textCell]);
  });

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
