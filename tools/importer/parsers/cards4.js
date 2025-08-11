/* global WebImporter */
export default function parse(element, { document }) {
  // Find the <ul> inside the cards block
  const ul = element.querySelector('ul');
  if (!ul) return;
  const cards = Array.from(ul.children); // <li> elements

  // Prepare the rows for the table
  const rows = [];
  // The header row must be exactly 'Cards' as per requirements
  rows.push(['Cards']);

  // Each card: image or icon in the first cell, rich text in the second
  cards.forEach(card => {
    // Find image: prefer <picture>, fallback to <img>
    let imageEl = null;
    const imageDiv = card.querySelector('.cards-card-image');
    if (imageDiv) {
      const pic = imageDiv.querySelector('picture');
      if (pic) {
        imageEl = pic;
      } else {
        const img = imageDiv.querySelector('img');
        if (img) imageEl = img;
      }
    }

    // Find text content (card body)
    let textEl = null;
    const bodyDiv = card.querySelector('.cards-card-body');
    if (bodyDiv) {
      textEl = bodyDiv;
    }

    // Only add rows where there is text (should always be, but for resilience)
    if (imageEl || textEl) {
      rows.push([
        imageEl,
        textEl
      ]);
    }
  });

  // Create the cards block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
