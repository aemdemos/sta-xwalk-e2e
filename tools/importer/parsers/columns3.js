/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main columns block
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Each immediate child div of columnsBlock is a row
  const rows = Array.from(columnsBlock.children);
  if (!rows.length) return;

  // For each row, make an array of its immediate children (columns)
  const tableRows = rows.map(row => Array.from(row.children));

  // The first data row determines the number of columns
  // The header row must be a single cell (not one for each column), per spec
  const cells = [['Columns'], ...tableRows];

  // Create the block table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
