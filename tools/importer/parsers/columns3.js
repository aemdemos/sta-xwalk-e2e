/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns block inside the wrapper
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Each direct child of .columns.block is a row
  const rowDivs = Array.from(columnsBlock.children);
  if (rowDivs.length === 0) return;

  // Determine the maximum number of columns in any row for normalization
  let maxCols = 0;
  rowDivs.forEach(row => {
    maxCols = Math.max(maxCols, row.children.length);
  });

  // Compose the output table
  const table = [];
  // Header row exactly as per requirement: ONLY one column
  table.push(['Columns']);

  // For each row, collect its immediate children as cell content
  rowDivs.forEach(row => {
    const cells = Array.from(row.children);
    // Normalize number of columns by filling with '' if needed
    while (cells.length < maxCols) {
      cells.push('');
    }
    table.push(cells);
  });

  // Create the output block table
  const block = WebImporter.DOMUtils.createTable(table, document);
  // Replace the original element with the new table
  element.replaceWith(block);
}
