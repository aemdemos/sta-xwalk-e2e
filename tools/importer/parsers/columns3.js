/* global WebImporter */
export default function parse(element, { document }) {
  // Get all the top-level rows (should be two in the example HTML)
  const rows = Array.from(element.querySelectorAll(':scope > div'));
  // Calculate max number of columns among rows
  let maxCols = 0;
  const columnsByRow = rows.map(row => {
    const cols = Array.from(row.querySelectorAll(':scope > div'));
    if (cols.length > maxCols) maxCols = cols.length;
    return cols;
  });
  // Pad rows with empty divs if needed to ensure equal columns
  columnsByRow.forEach((cols, idx) => {
    while (cols.length < maxCols) {
      cols.push(document.createElement('div'));
    }
  });
  // Assemble the cells array for the table
  const cells = [];
  // Header row: single column
  cells.push(['Columns']);
  // Each subsequent row: one cell per column
  columnsByRow.forEach(cols => {
    cells.push(cols);
  });
  // Create and replace with the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
