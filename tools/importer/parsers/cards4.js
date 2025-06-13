/* global WebImporter */
export default function parse(element, { document }) {
  // Find the <ul> containing the cards
  const ul = element.querySelector('ul');
  if (!ul) return;

  const cards = Array.from(ul.children); // <li> elements

  // Header row matches the example
  const rows = [['Cards (cards4)']];

  cards.forEach((li) => {
    // Each card has image and body
    const imgDiv = li.querySelector('.cards-card-image');
    const bodyDiv = li.querySelector('.cards-card-body');

    // First cell: image (use <picture> if present else <img>)
    let imageCell = null;
    if (imgDiv) {
      const pic = imgDiv.querySelector('picture');
      if (pic) {
        imageCell = pic;
      } else {
        const img = imgDiv.querySelector('img');
        if (img) imageCell = img;
      }
    }

    // Second cell: the card body (preserves all formatting and structure)
    let textCell = null;
    if (bodyDiv) {
      textCell = bodyDiv;
    }

    rows.push([imageCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
