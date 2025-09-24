/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the .cards block (could be the element itself or a child)
  let cardsBlock = element;
  if (!cardsBlock.classList.contains('cards')) {
    cardsBlock = element.querySelector('.cards');
  }
  if (!cardsBlock) return;

  // Find all card items (li elements)
  const cardItems = cardsBlock.querySelectorAll('ul > li');
  if (!cardItems.length) return;

  // Header row as per requirements
  const rows = [
    ['Cards (cards4)']
  ];

  // For each card, extract image and text content
  cardItems.forEach((li) => {
    // Image/Icon cell (mandatory)
    const imgWrapper = li.querySelector('.cards-card-image');
    let imageEl = null;
    if (imgWrapper) {
      // Use the <picture> or <img> directly
      const picture = imgWrapper.querySelector('picture');
      if (picture) {
        imageEl = picture;
      } else {
        const img = imgWrapper.querySelector('img');
        if (img) imageEl = img;
      }
    }

    // Text content cell (mandatory)
    const bodyWrapper = li.querySelector('.cards-card-body');
    let textContent = [];
    if (bodyWrapper) {
      // Title: first <p><strong>...</strong></p>
      const paragraphs = bodyWrapper.querySelectorAll('p');
      if (paragraphs.length > 0) {
        const firstP = paragraphs[0];
        const strong = firstP.querySelector('strong');
        if (strong) {
          // Use <strong> as heading (h3)
          const h = document.createElement('h3');
          h.textContent = strong.textContent;
          textContent.push(h);
        }
      }
      // Description: second <p> (if exists)
      if (paragraphs.length > 1) {
        // Clone to preserve links, formatting, etc.
        const desc = paragraphs[1].cloneNode(true);
        textContent.push(desc);
      }
    }
    // Defensive: always provide both cells
    rows.push([
      imageEl || '',
      textContent.length ? textContent : ''
    ]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original block
  element.replaceWith(table);
}
