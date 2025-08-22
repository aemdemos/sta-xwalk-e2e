/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single column with 'Columns'
  const headerRow = ['Columns'];
  
  // Get all immediate child divs (rows of columns)
  const rows = Array.from(element.querySelectorAll(':scope > div'));
  
  // The maximum number of columns in any row (to create the correct number of columns in content rows)
  let maxCols = 0;
  const contentRows = rows.map(row => {
    const cols = Array.from(row.querySelectorAll(':scope > div'));
    if (cols.length > maxCols) maxCols = cols.length;
    // Each cell contains all of its children (as an array, so multiple elements are included)
    return cols.map(col => {
      if (col.children.length === 0) return '';
      return Array.from(col.children);
    });
  });

  // Ensure every content row has maxCols columns (pad with empty strings if necessary)
  contentRows.forEach(row => {
    while (row.length < maxCols) {
      row.push('');
    }
  });

  // Build the cells array
  // FIRST row: headerRow (single column)
  // SUBSEQUENT rows: arrays of maxCols columns
  const cells = [headerRow, ...contentRows];
  
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
