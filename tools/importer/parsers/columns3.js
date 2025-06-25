/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main columns block inside the wrapper
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Get the rows (direct children of .columns.block)
  const visualRows = Array.from(columnsBlock.children);
  if (visualRows.length === 0) return;

  // For each row, collect the direct children (columns)
  const contentRows = visualRows.map(row => Array.from(row.children));

  // The number of columns is determined by the first visual row
  const columnCount = contentRows[0].length;

  const tableRows = [];
  // Header row: only one column with 'Columns' as content
  tableRows.push(['Columns']);

  // Add each visual row as a table row, containing its columns as cells
  for (let i = 0; i < contentRows.length; i++) {
    tableRows.push(contentRows[i]);
  }

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
