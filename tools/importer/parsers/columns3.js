/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main columns block
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  const rows = Array.from(columnsBlock.children);
  if (rows.length === 0) return;

  // Determine number of columns in the first content row
  let numCols = 0;
  for (let row of rows) {
    const childCount = Array.from(row.children).filter(child => child.nodeType === 1).length;
    if (childCount > numCols) numCols = childCount;
  }

  // Header row: single cell, block name
  const cells = [[ 'Columns' ]];

  // Each subsequent row: array of cells, each cell is the DOM node from the original HTML
  rows.forEach(row => {
    // Only keep element children (not text nodes)
    const cols = Array.from(row.children).filter(child => child.nodeType === 1);
    // If row has less columns than expected, pad with empty string
    while (cols.length < numCols) {
      cols.push('');
    }
    cells.push(cols);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Ensure the header cell spans all columns
  const headerRow = table.querySelector('tr');
  if (headerRow && numCols > 1) {
    const th = headerRow.querySelector('th');
    if (th) {
      th.setAttribute('colspan', numCols);
    }
  }
  element.replaceWith(table);
}
