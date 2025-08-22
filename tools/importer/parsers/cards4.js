/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main .cards.block element
  const cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;

  // Get all direct card items
  const cardItems = Array.from(cardsBlock.querySelectorAll('ul > li'));

  // Table header matches block name per instructions and example
  const cells = [['Cards']];

  cardItems.forEach((li) => {
    // Reference the image/icon (mandatory)
    let imageEl = null;
    const imageDiv = li.querySelector('.cards-card-image');
    if (imageDiv) {
      const picture = imageDiv.querySelector('picture');
      if (picture) imageEl = picture;
    }

    // Reference the text content (mandatory)
    let textDiv = li.querySelector('.cards-card-body');
    let textContent = [];
    if (textDiv) {
      // Collect children, preserve structure (e.g., <p>, <strong>, etc.)
      textContent = Array.from(textDiv.children);
      // Defensive: fallback in case no children
      if (textContent.length === 0 && textDiv.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = textDiv.textContent;
        textContent = [p];
      }
    } else {
      // Defensive: fallback if textDiv missing
      textContent = [];
    }

    // Each row: [image, text]
    // If no image, still provide null so table structure is correct
    // If no text, provide empty string
    cells.push([
      imageEl,
      textContent.length === 1 ? textContent[0] : textContent
    ]);
  });

  // Create the cards block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
