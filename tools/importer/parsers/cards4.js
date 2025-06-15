/* global WebImporter */
export default function parse(element, { document }) {
  // Find the UL containing the cards
  const ul = element.querySelector('ul');
  if (!ul) return;
  const cards = Array.from(ul.children); // li elements

  // Header row as required by the block spec
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  cards.forEach(card => {
    // Card image: first column
    const imageDiv = card.querySelector('.cards-card-image');
    let imageContent = null;
    if (imageDiv) {
      // Use the <picture> element if present, fall back to <img>
      imageContent = imageDiv.querySelector('picture') || imageDiv.querySelector('img');
    }

    // Card body: second column
    const bodyDiv = card.querySelector('.cards-card-body');
    let bodyContent = null;
    if (bodyDiv) {
      // Reference the existing element (may contain <p>, <strong>, etc.)
      bodyContent = bodyDiv;
    }

    rows.push([imageContent, bodyContent]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
