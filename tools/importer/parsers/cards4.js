/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the actual cards block (could be nested)
  let cardsBlock = element;
  if (!cardsBlock.classList.contains('cards')) {
    cardsBlock = element.querySelector('.cards.block');
    if (!cardsBlock) return;
  }

  // Find all card <li> elements
  const cardItems = cardsBlock.querySelectorAll('ul > li');
  if (!cardItems.length) return;

  // Header row per block spec
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  cardItems.forEach((li) => {
    // Defensive: find image and body containers
    const imageDiv = li.querySelector('.cards-card-image');
    const bodyDiv = li.querySelector('.cards-card-body');

    // Find the image (always use the <img> inside <picture>)
    let imgEl = null;
    if (imageDiv) {
      const picture = imageDiv.querySelector('picture');
      if (picture) {
        imgEl = picture.querySelector('img');
      }
    }

    // Compose text content: title (strong), description (next <p>), possibly more
    let textContent = [];
    if (bodyDiv) {
      // Find all <p> elements
      const paragraphs = Array.from(bodyDiv.querySelectorAll('p'));
      if (paragraphs.length) {
        // Title is first <p> with <strong>
        const titleP = paragraphs[0];
        const strong = titleP.querySelector('strong');
        if (strong) {
          // Use <strong> as heading (keep as is)
          textContent.push(strong);
        }
        // Description: next <p> (if exists)
        if (paragraphs.length > 1) {
          textContent.push(paragraphs[1]);
        }
      }
    }

    // Build the row: [image, text]
    const row = [imgEl, textContent];
    rows.push(row);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
