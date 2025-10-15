/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a cell with a field comment and content
  function fieldCell(fieldName, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    if (content) frag.appendChild(content);
    return frag;
  }

  // Find the UL containing the cards
  const cardsList = element.querySelector('ul');
  if (!cardsList) return;

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Cards (cards4)']);

  // For each card (LI)
  Array.from(cardsList.children).forEach((li) => {
    // Image cell
    const imgDiv = li.querySelector('.cards-card-image');
    let imageContent = null;
    if (imgDiv) {
      // Use the existing <picture> element directly
      const picture = imgDiv.querySelector('picture');
      if (picture) {
        imageContent = fieldCell('image', picture);
      }
    }
    // Text cell
    const bodyDiv = li.querySelector('.cards-card-body');
    let textContent = null;
    if (bodyDiv) {
      // Use the entire bodyDiv (contains <p><strong>Title</strong></p> and description)
      textContent = fieldCell('text', bodyDiv);
    }
    rows.push([imageContent, textContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
