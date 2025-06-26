/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct children of the .columns block (should be 2: the two rows)
  const rowGroups = Array.from(element.querySelectorAll(':scope > div'));

  // Find the maximum number of columns in any row
  let maxCols = 0;
  const rowsContent = rowGroups.map(rowGroup => {
    // Each rowGroup contains the columns for this row
    const cols = Array.from(rowGroup.querySelectorAll(':scope > div'));
    if (cols.length > maxCols) maxCols = cols.length;
    return cols;
  });

  // Prepare the cells array
  const cells = [];
  // Header row (one column)
  cells.push(['Columns']);

  // Each row matches a row in the table, each col a cell in that row
  rowsContent.forEach(cols => {
    // If this row doesn't have all columns, pad with empty string
    const row = cols.slice();
    while (row.length < maxCols) {
      row.push('');
    }
    cells.push(row);
  });

  // Create and replace with the table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
