/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a field-commented fragment for a given field name and content
  function fieldFragment(fieldName, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    frag.appendChild(content);
    return frag;
  }

  // Find the cards block container (the one with <ul><li> structure)
  const cardsBlock = element.querySelector('.cards.block ul');
  if (!cardsBlock) return;

  // Header row as required
  const headerRow = ['Cards (cards4)'];

  // Parse each card (li)
  const cardRows = Array.from(cardsBlock.children).map((li) => {
    // Image cell (field: image)
    const imageDiv = li.querySelector('.cards-card-image');
    let imageContent = null;
    if (imageDiv) {
      // Use the <picture> element directly
      const picture = imageDiv.querySelector('picture');
      if (picture) {
        imageContent = fieldFragment('image', picture);
      }
    }

    // Text cell (field: text)
    const bodyDiv = li.querySelector('.cards-card-body');
    let textContent = null;
    if (bodyDiv) {
      // Use the body div as-is for all text content
      textContent = fieldFragment('text', bodyDiv);
    }

    return [imageContent, textContent];
  });

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...cardRows
  ], document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}
