/* global WebImporter */
export default function parse(element, { document }) {
  // The block structure is: header row (1 cell), then N rows, each with M columns (as per source HTML)
  // Get all top-level rows (each immediate child div of element)
  const rowDivs = element.querySelectorAll(':scope > div');
  
  // Determine the max number of columns in any row
  let maxCols = 0;
  const rows = Array.from(rowDivs).map(rowDiv => {
    const columns = Array.from(rowDiv.querySelectorAll(':scope > div'));
    if (columns.length > maxCols) maxCols = columns.length;
    return columns;
  });
  // Pad rows with fewer columns
  const normalizedRows = rows.map(row => {
    if (row.length < maxCols) {
      const emptyCells = Array(maxCols - row.length).fill(document.createElement('div'));
      return [...row, ...emptyCells];
    }
    return row;
  });
  
  // Compose the header
  const headerRow = ['Columns (columns3)'];

  // Compose the cells array: header, then each actual row
  const cells = [headerRow, ...normalizedRows];
  
  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
