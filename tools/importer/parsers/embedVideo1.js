/* global WebImporter */
export default function parse(element, { document }) {
  // Construct the header row (exact match to spec)
  const headerRow = ['Embed (embedVideo1)'];

  // For this source HTML, the requirement is to preserve all text content and semantic structure from the element.
  // We reference all (immediate) children of the element so as not to miss any text or structure.
  // If the element is empty (shouldn't be here), fallback to empty string.
  const contentNodes = Array.from(element.childNodes);
  let contentCell;
  if (contentNodes.length > 0) {
    // Reference all children directly (text, elements, etc)
    contentCell = contentNodes;
  } else {
    // fallback (should not usually be needed)
    contentCell = [''];
  }

  const cells = [
    headerRow,
    [contentCell]
  ];

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
