/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns block (may be the element itself or its child)
  let columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) columnsBlock = element;

  // Get all immediate child divs that represent column rows
  const rowDivs = Array.from(columnsBlock.querySelectorAll(':scope > div'));
  if (rowDivs.length === 0) return;

  // For each row, get its direct children divs (the columns)
  const getColumns = (row) => Array.from(row.querySelectorAll(':scope > div'));
  const contentRows = rowDivs.map(getColumns).filter(row => row.length > 0);

  // Determine the maximum number of columns in any row
  const numCols = Math.max(...contentRows.map(row => row.length));

  // Header row: same number of columns as content rows, only first cell has 'Columns'
  const headerRow = Array(numCols).fill('');
  headerRow[0] = 'Columns';

  // Make sure every content row has the right number of columns (pad with empty if needed)
  const normalizedContentRows = contentRows.map(row => {
    if (row.length < numCols) {
      return row.concat(Array(numCols - row.length).fill(''));
    }
    return row;
  });

  // Compose the table rows
  const cells = [
    headerRow,
    ...normalizedContentRows
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
