/* global WebImporter */
export default function parse(element, { document }) {
  // Find the direct child with '.cards.block'
  const cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;

  // Get all card <li> elements
  const cards = cardsBlock.querySelectorAll('ul > li');
  if (!cards.length) return;

  // Header row matches block name exactly
  const rows = [ ['Cards'] ];

  // Process each card
  cards.forEach(card => {
    // Column 1: Image or icon
    let imageDiv = card.querySelector('.cards-card-image');
    let imageCell = null;
    if (imageDiv) {
      // Prefer picture, else img
      imageCell = imageDiv.querySelector('picture') || imageDiv.querySelector('img');
    }

    // Column 2: Text content
    // Use all children of the body div to catch all paragraphs, headings, and links
    let bodyDiv = card.querySelector('.cards-card-body');
    let textCell;
    if (bodyDiv) {
      // Use an array of child elements, so multiple paragraphs/headings inside body
      textCell = Array.from(bodyDiv.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
      if (textCell.length === 1) textCell = textCell[0];
      if (!textCell.length && typeof textCell !== 'object') textCell = bodyDiv; // fallback, should not happen
    } else {
      textCell = '';
    }

    rows.push([imageCell, textCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the table
  element.replaceWith(table);
}
