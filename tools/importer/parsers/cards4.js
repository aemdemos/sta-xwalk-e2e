/* global WebImporter */
export default function parse(element, { document }) {
  // Find the actual cards list inside the provided element
  const block = element.querySelector('.cards.block');
  if (!block) return;
  const ul = block.querySelector('ul');
  if (!ul) return;

  // Create the header row as specified
  const headerRow = ['Cards'];

  // Prepare rows for each card
  const rows = Array.from(ul.children).map(li => {
    // First cell: image/icon
    let imageCell = null;
    const imgDiv = li.querySelector('.cards-card-image');
    if (imgDiv) {
      // Prefer to use <picture> if present
      const picture = imgDiv.querySelector('picture');
      imageCell = picture || imgDiv;
    }

    // Second cell: text content
    let textCell = null;
    const bodyDiv = li.querySelector('.cards-card-body');
    if (bodyDiv) {
      textCell = bodyDiv;
    }
    return [imageCell, textCell];
  });

  // Compose the table cells
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element in-place
  element.replaceWith(table);
}
