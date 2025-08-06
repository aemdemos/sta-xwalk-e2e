/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .columns.block child (content block); fallback to 'element' itself
  let columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) columnsBlock = element;

  // Get all direct child divs of columnsBlock (representing 'rows' of columns)
  const rows = Array.from(columnsBlock.children).filter(child => child.tagName === 'DIV');
  if (!rows.length) return;

  // For each row, get its immediate children divs (each is a column cell)
  // Find the maximum number of columns per row
  let maxCols = 0;
  const rowCells = rows.map(row => {
    const cols = Array.from(row.children).filter(child => child.tagName === 'DIV');
    if (cols.length > maxCols) maxCols = cols.length;
    return cols;
  });

  // Pad rows with fewer columns with empty strings, so each row has maxCols entries
  const tableRows = rowCells.map(cols => {
    const cells = [...cols];
    while (cells.length < maxCols) cells.push('');
    return cells;
  });

  // Build the table array: header + rows -- header is always exactly one column
  const table = [ ['Columns'], ...tableRows ];

  const block = WebImporter.DOMUtils.createTable(table, document);
  element.replaceWith(block);
}
