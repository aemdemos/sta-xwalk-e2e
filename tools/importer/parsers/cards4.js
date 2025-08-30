/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the <ul> containing the cards
  const ul = element.querySelector('ul');
  if (!ul) return;
  // Each card is an <li>
  const lis = Array.from(ul.children);
  
  // Table header row exactly matching the block name
  const headerRow = ['Cards (cards4)'];

  // Construct table rows: [image, text]
  const rows = lis.map(li => {
    // Find image container
    const imageDiv = li.querySelector('.cards-card-image');
    // Extract the picture element (prefer picture for responsive images)
    let imgElem = null;
    if (imageDiv) {
      imgElem = imageDiv.querySelector('picture') || imageDiv.querySelector('img');
    }
    // Find the body text container
    const bodyDiv = li.querySelector('.cards-card-body');
    // Reference the full bodyDiv (preserves all text/formatting)
    return [imgElem, bodyDiv];
  });
  
  // Compose final table data
  const tableData = [headerRow, ...rows];
  const blockTable = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace original element with the block table
  element.replaceWith(blockTable);
}
