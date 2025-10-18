/* global WebImporter */
export default function parse(element, { document }) {
  // Columns block: No field comments required in cells (per rules)

  // Header row
  const headerRow = ['Columns (columns3)'];

  // Find the two main rows (each is a direct child of the block)
  const rows = Array.from(element.children);
  const contentRows = [];

  // Only process if there are at least two rows
  if (rows.length >= 2) {
    // For each row, extract the HTML for each column, not the actual DOM node
    rows.forEach(row => {
      const cols = Array.from(row.children);
      const rowCells = [
        cols[0] ? cols[0].outerHTML : '',
        cols[1] ? cols[1].outerHTML : ''
      ];
      contentRows.push(rowCells);
    });
  } else {
    // Fallback: treat the whole element as a single cell
    contentRows.push([element.innerHTML]);
  }

  // Compose the table cells array
  const cells = [headerRow, ...contentRows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
