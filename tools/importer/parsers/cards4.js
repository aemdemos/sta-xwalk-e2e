/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cards block (could be the element itself or a child)
  let cardsBlock = element;
  if (!cardsBlock.classList.contains('cards')) {
    cardsBlock = element.querySelector('.cards.block');
  }
  if (!cardsBlock) return;

  // Find all card <li> elements
  const list = cardsBlock.querySelector('ul');
  if (!list) return;
  const items = Array.from(list.children);

  // Table header row: must match block name exactly
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // For each card, extract image and text content
  items.forEach((li) => {
    // Find image container and body container
    const imgDiv = li.querySelector('.cards-card-image');
    const bodyDiv = li.querySelector('.cards-card-body');

    // Get the <picture> element (reference, not clone)
    let imageEl = null;
    if (imgDiv) {
      const picture = imgDiv.querySelector('picture');
      if (picture) {
        imageEl = picture;
      }
    }

    // Get the text content (title and description)
    let textContent = '';
    if (bodyDiv) {
      // Collect all <p> elements (usually first is title <strong>, second is description)
      const paragraphs = Array.from(bodyDiv.querySelectorAll('p'));
      if (paragraphs.length > 0) {
        // Wrap the first <p> (title) in <strong> if not already
        const frag = document.createDocumentFragment();
        paragraphs.forEach((p, idx) => {
          // Use the existing <p> elements (do not clone)
          frag.appendChild(p);
        });
        textContent = frag;
      }
    }

    // Defensive: If no image or text, skip this card
    if (!imageEl && !textContent) return;

    // Add row: [image, text]
    rows.push([
      imageEl || '',
      textContent || '',
    ]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
