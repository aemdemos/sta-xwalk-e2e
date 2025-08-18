/* global WebImporter */
export default function parse(element, { document }) {
  // Find the block root (.cards or .cards-wrapper)
  let blockRoot = element;
  if (blockRoot.classList.contains('cards-wrapper')) {
    blockRoot = blockRoot.querySelector('.cards');
  }
  if (!blockRoot) return;

  const cardsList = blockRoot.querySelector('ul');
  if (!cardsList) return;
  const cardItems = Array.from(cardsList.children);

  // Build table rows (header + one for each card)
  const rows = [['Cards']];

  cardItems.forEach((li) => {
    // Get image (mandatory)
    const imgDiv = li.querySelector('.cards-card-image');
    let imgElement = null;
    if (imgDiv) {
      const picture = imgDiv.querySelector('picture');
      if (picture) {
        imgElement = picture;
      } else {
        const img = imgDiv.querySelector('img');
        if (img) imgElement = img;
      }
    }
    // Get text content (mandatory)
    const bodyDiv = li.querySelector('.cards-card-body');
    let textElement = null;
    if (bodyDiv) {
      // Use all children paragraphs as they are
      textElement = bodyDiv;
    }
    // Only add the card if both image and text content are present
    if (imgElement && textElement) {
      rows.push([imgElement, textElement]);
    }
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
