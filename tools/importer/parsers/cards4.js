/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure we are pointing to the cards block
  let cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) {
    // If not found, see if the element itself is the cards block
    if (element.classList.contains('cards') && element.classList.contains('block')) {
      cardsBlock = element;
    } else {
      // If nothing matches, do nothing
      return;
    }
  }

  // Get all card items
  const cardItems = cardsBlock.querySelectorAll('ul > li');
  const tableRows = [['Cards']]; // Header EXACTLY as in example

  cardItems.forEach((li) => {
    // Get image/icon for the first column
    let imageEl = null;
    const imageDiv = li.querySelector('.cards-card-image');
    if (imageDiv) {
      // Use the <picture> tag if present, otherwise fallback to <img>
      const picture = imageDiv.querySelector('picture');
      if (picture) {
        imageEl = picture;
      } else {
        const img = imageDiv.querySelector('img');
        if (img) imageEl = img;
      }
    }

    // Get text content for the second column
    let bodyEl = null;
    const bodyDiv = li.querySelector('.cards-card-body');
    if (bodyDiv) {
      // Reference the bodyDiv directly to retain formatting/semantics
      bodyEl = bodyDiv;
    }

    // Always add a row, even if one column is missing
    tableRows.push([imageEl, bodyEl]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  // Replace the original element with the new block
  element.replaceWith(block);
}
