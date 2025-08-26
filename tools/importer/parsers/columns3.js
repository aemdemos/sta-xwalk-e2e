/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .columns.block inside the wrapper
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Get all rows of the block
  const rowDivs = Array.from(columnsBlock.children).filter(row => row.tagName === 'DIV');
  if (rowDivs.length === 0) return;

  // Prepare the table with a single-cell header row
  const tableRows = [];
  tableRows.push(['Columns']); // Header row: one column only

  // For each row, extract the columns as cells
  rowDivs.forEach(row => {
    const cols = Array.from(row.children).map(col => col);
    tableRows.push(cols);
  });

  // Create table and replace element
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(blockTable);
}
