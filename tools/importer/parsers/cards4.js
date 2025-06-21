/* global WebImporter */
export default function parse(element, { document }) {
  // Find the <ul> containing all cards
  const ul = element.querySelector('ul');
  if (!ul) return;
  const lis = ul.querySelectorAll(':scope > li');

  // Prepare the table rows
  const rows = [];
  // Header row with block name and variant exactly as required
  rows.push(['Cards (cards4)']);

  lis.forEach((li) => {
    // 1st cell: Image or icon
    let imageCell = null;
    const imageDiv = li.querySelector('.cards-card-image');
    if (imageDiv) {
      const picture = imageDiv.querySelector('picture');
      if (picture) imageCell = picture;
    }
    // 2nd cell: Text content (title, description, etc.)
    let textCell = null;
    const bodyDiv = li.querySelector('.cards-card-body');
    if (bodyDiv) {
      textCell = bodyDiv;
    }
    rows.push([imageCell, textCell]);
  });

  // Create the table using the helper
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the new table
  element.replaceWith(table);
}
