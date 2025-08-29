/* global WebImporter */
export default function parse(element, { document }) {
  // Block header must match example exactly
  const headerRow = ['Cards (cards4)'];

  // Find card items
  const ul = element.querySelector('ul');
  if (!ul) return;
  const liCards = Array.from(ul.children);

  // For each <li>, extract the image (first cell) and text (second cell)
  const rows = liCards.map((li) => {
    // Image or Icon cell
    let imageCell = null;
    const imgWrap = li.querySelector('.cards-card-image');
    if (imgWrap) {
      // Prefer to use <picture> element if present
      const picture = imgWrap.querySelector('picture');
      imageCell = picture ? picture : imgWrap;
    }
    // Text Content cell
    let textCell = null;
    const bodyWrap = li.querySelector('.cards-card-body');
    if (bodyWrap) {
      textCell = bodyWrap;
    }
    return [imageCell, textCell];
  });

  // Create 2-column table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
