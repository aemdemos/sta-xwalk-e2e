/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns block inside the wrapper
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;
  // Get the immediate child divs of the .columns.block (each represents a visual row of columns)
  const rowGroups = Array.from(columnsBlock.children);

  // Determine the maximum number of columns from the children
  let maxCols = 0;
  rowGroups.forEach(group => {
    const cols = Array.from(group.children);
    if (cols.length > maxCols) maxCols = cols.length;
  });

  // Build the cells array for the table
  const cells = [];
  // Header must be a single column, always
  cells.push(['Columns (columns3)']);

  // All other rows must have the same number of columns as the widest row
  rowGroups.forEach(group => {
    const cols = Array.from(group.children);
    // Pad with empty divs if less than maxCols
    const row = [];
    for (let i = 0; i < maxCols; i++) {
      row.push(cols[i] || document.createElement('div'));
    }
    cells.push(row);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(table);
}
