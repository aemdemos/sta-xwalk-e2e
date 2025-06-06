/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the <ul> containing the cards, fallback to children if not found
  const ul = element.querySelector('ul');
  if (!ul) return;

  const rows = [];
  rows.push(['Cards (cards4)']); // Header row exactly as in the example

  // Iterate over each card <li>
  ul.querySelectorAll(':scope > li').forEach((li) => {
    // Image/Icon cell
    let imageCell = '';
    const imageDiv = li.querySelector(':scope > .cards-card-image');
    if (imageDiv) {
      imageCell = imageDiv;
    }
    // Text content cell
    let textCell = '';
    const bodyDiv = li.querySelector(':scope > .cards-card-body');
    if (bodyDiv) {
      textCell = bodyDiv;
    }
    rows.push([imageCell, textCell]);
  });

  // Create the table block and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
