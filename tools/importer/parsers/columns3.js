/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the correct header row
  const headerRow = ['Columns (columns3)'];
  const rows = [];

  // Find all direct child divs (each is a row visually)
  const mainRows = Array.from(element.querySelectorAll(':scope > div'));
  if (!mainRows.length) {
    // Defensive: still replace with header
    const table = WebImporter.DOMUtils.createTable([headerRow], document);
    element.replaceWith(table);
    return;
  }

  // For each main row, extract its columns
  mainRows.forEach((rowDiv) => {
    const cols = Array.from(rowDiv.querySelectorAll(':scope > div'));
    if (cols.length === 2) {
      // Each col may contain text, images, buttons, etc.
      const cells = cols.map((col) => {
        // If the column only contains a picture, use just the picture
        const pic = col.querySelector('picture');
        if (pic && col.childNodes.length === 1) {
          return pic.cloneNode(true);
        }
        // Otherwise, clone all content (preserves text, lists, buttons, etc.)
        const cellDiv = document.createElement('div');
        Array.from(col.childNodes).forEach((node) => {
          cellDiv.appendChild(node.cloneNode(true));
        });
        return cellDiv;
      });
      rows.push(cells);
    }
  });

  // Build and replace
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
