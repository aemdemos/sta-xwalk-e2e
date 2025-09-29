/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the target block name as the header row
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // Find the cards block (defensive: sometimes element is wrapper)
  let cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) {
    // fallback: maybe the element itself is the block
    if (element.classList.contains('cards') && element.classList.contains('block')) {
      cardsBlock = element;
    } else {
      // fallback: search children
      cardsBlock = element.querySelector('[data-block-name="cards"]');
    }
  }
  if (!cardsBlock) return;

  // Get all card <li> elements
  const cardItems = cardsBlock.querySelectorAll('ul > li');
  cardItems.forEach((li) => {
    // Image/Icon cell: find the first image in the card
    let imageCell = '';
    const imageDiv = li.querySelector('.cards-card-image');
    if (imageDiv) {
      // Use the <picture> or <img> directly
      const picture = imageDiv.querySelector('picture');
      if (picture) {
        imageCell = picture;
      } else {
        const img = imageDiv.querySelector('img');
        if (img) imageCell = img;
      }
    }

    // Text content cell: get the body div
    let textCell = '';
    const bodyDiv = li.querySelector('.cards-card-body');
    if (bodyDiv) {
      // Defensive: if bodyDiv has only <p>s, combine them into a fragment
      const ps = bodyDiv.querySelectorAll('p');
      if (ps.length > 0) {
        // If first <p> contains <strong>, treat as heading
        const frag = document.createDocumentFragment();
        ps.forEach((p, idx) => {
          frag.appendChild(p);
        });
        textCell = frag;
      } else {
        textCell = bodyDiv;
      }
    }

    rows.push([imageCell, textCell]);
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
