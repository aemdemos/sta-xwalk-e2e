/* global WebImporter */
export default function parse(element, { document }) {
  // Find the inner columns block (should only be one)
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Each direct child <div> of .columns.block is a row
  const rowDivs = Array.from(columnsBlock.children);
  if (rowDivs.length === 0) return;

  // For each row, get the columns (children)
  const rowsContent = rowDivs.map(rowDiv => Array.from(rowDiv.children));
  // Determine the max number of columns in any row
  let maxColumns = 0;
  rowsContent.forEach(cols => { if (cols.length > maxColumns) maxColumns = cols.length; });

  // Build the header: a single cell containing the block name 'Columns'
  const cells = [['Columns']];

  // For each row, add its columns, padding with '' to ensure all rows have maxColumns columns
  rowsContent.forEach(cols => {
    const row = cols.slice();
    while (row.length < maxColumns) row.push('');
    cells.push(row);
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(table);
}
