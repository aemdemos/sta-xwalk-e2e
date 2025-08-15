/* global WebImporter */
export default function parse(element, { document }) {
  // Find the actual cards block inside possible wrappers
  let cardsBlock = element;
  if (!cardsBlock.classList.contains('cards')) {
    cardsBlock = element.querySelector('.cards');
  }
  // Safeguard: if no cards block found, exit
  if (!cardsBlock) return;

  // Get all <li> for each card
  const cardEls = Array.from(cardsBlock.querySelectorAll('ul > li'));

  // Table header matches exactly: "Cards"
  const headerRow = ['Cards'];
  const rows = [headerRow];

  cardEls.forEach(cardEl => {
    // Image or Icon: .cards-card-image (should contain <picture> or <img>)
    const imageContainer = cardEl.querySelector('.cards-card-image');
    let imageElem = null;
    if (imageContainer) {
      // Prefer <picture> if present
      const picture = imageContainer.querySelector('picture');
      if (picture) {
        imageElem = picture;
      } else {
        // fallback to <img> if no picture
        imageElem = imageContainer.querySelector('img');
      }
    }

    // Text content: .cards-card-body (contains title/desc/call-to-action)
    const bodyContainer = cardEl.querySelector('.cards-card-body');
    let textElem = null;
    if (bodyContainer) {
      textElem = bodyContainer;
    }

    // Only add row if at least one cell is present
    if (imageElem || textElem) {
      rows.push([imageElem || '', textElem || '']);
    }
  });

  // Create the Cards table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
