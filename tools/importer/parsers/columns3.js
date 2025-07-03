/* global WebImporter */
export default function parse(element, { document }) {
  // Get the columns block (should be direct child of the wrapper)
  let columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) columnsBlock = element;
  // Each direct child of columnsBlock is a row (the block supports multiple rows)
  const rowDivs = Array.from(columnsBlock.children);
  // Find the number of columns in the first row
  let maxCols = 0;
  if (rowDivs.length > 0) {
    const firstRowCols = rowDivs[0].children;
    maxCols = firstRowCols.length;
  }
  // Start with the header row as required: exactly one cell 'Columns'
  const cells = [['Columns']];
  // Each row in the block (these are the actual content rows)
  rowDivs.forEach(rowDiv => {
    // Each column is a direct child
    const colDivs = Array.from(rowDiv.children);
    // Build content for each cell from existing elements
    const rowCells = colDivs.map(col => {
      // If column is empty, return empty string
      if (!col || !col.childNodes.length) return '';
      // Use all children so that we get all structure (text, list, images, etc.)
      return Array.from(col.childNodes);
    });
    // If this row has fewer columns than the max, pad with empty strings
    while (rowCells.length < maxCols) {
      rowCells.push('');
    }
    cells.push(rowCells);
  });
  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the new block
  element.replaceWith(table);
}
