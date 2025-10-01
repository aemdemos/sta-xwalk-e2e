/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the .cards block inside the wrapper
  const cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;

  // Find all card <li> elements
  const cardItems = cardsBlock.querySelectorAll('ul > li');
  if (!cardItems.length) return;

  // Table header as required
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // For each card, extract image and text content
  cardItems.forEach((li) => {
    // Image/Icon cell (mandatory)
    const imageDiv = li.querySelector('.cards-card-image');
    let imageEl = null;
    if (imageDiv) {
      // Use the <picture> or <img> directly
      const picture = imageDiv.querySelector('picture');
      if (picture) {
        imageEl = picture;
      } else {
        const img = imageDiv.querySelector('img');
        if (img) imageEl = img;
      }
    }

    // Text content cell (mandatory)
    const bodyDiv = li.querySelector('.cards-card-body');
    let textContent = null;
    if (bodyDiv) {
      // Use all children (usually <p><strong>Title</strong></p> + <p>Description</p>)
      // We'll create a fragment to hold them
      const frag = document.createDocumentFragment();
      Array.from(bodyDiv.childNodes).forEach((node) => {
        frag.appendChild(node.cloneNode(true));
      });
      textContent = frag;
    }

    // Only add row if both image and text content exist
    if (imageEl && textContent) {
      rows.push([imageEl, textContent]);
    }
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the table
  element.replaceWith(table);
}
