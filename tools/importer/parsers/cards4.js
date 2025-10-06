/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cards block (defensive: could be the element itself or a child)
  let cardsBlock = element;
  if (!cardsBlock.classList.contains('cards')) {
    cardsBlock = element.querySelector('.cards');
  }
  if (!cardsBlock) return;

  // Find all <li> elements (each is a card)
  const cards = cardsBlock.querySelectorAll('ul > li');
  if (!cards.length) return;

  // Prepare the table rows
  const rows = [];
  // Header row as per spec
  rows.push(['Cards (cards4)']);

  // For each card, extract image and text content
  cards.forEach((card) => {
    // Defensive: find image container and body
    const imgDiv = card.querySelector('.cards-card-image');
    const bodyDiv = card.querySelector('.cards-card-body');
    let imgEl = null;
    if (imgDiv) {
      // Use the <picture> or <img> directly
      const picture = imgDiv.querySelector('picture');
      if (picture) {
        imgEl = picture;
      } else {
        // fallback: find img
        const img = imgDiv.querySelector('img');
        if (img) imgEl = img;
      }
    }
    // Defensive: if no image, leave cell blank
    const imageCell = imgEl ? imgEl : '';
    // For text: use the bodyDiv's children (usually <p><strong>...</strong></p> and <p>desc</p>)
    let textCell = '';
    if (bodyDiv) {
      // Use the bodyDiv as-is for resilience (preserves structure, strong, etc)
      textCell = bodyDiv;
    }
    rows.push([imageCell, textCell]);
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
