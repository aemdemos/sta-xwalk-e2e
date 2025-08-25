/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .columns.block regardless of input element
  let columnsBlock = element;
  if (!columnsBlock.classList.contains('columns')) {
    const maybeBlock = columnsBlock.querySelector(':scope > .columns.block');
    if (maybeBlock) {
      columnsBlock = maybeBlock;
    }
  }

  // Get all immediate child divs of the columns block (each is a row of columns)
  const rowDivs = Array.from(columnsBlock.querySelectorAll(':scope > div'));

  // For each row, get all immediate child divs (which are columns)
  const contentRows = rowDivs.map((rowDiv) => {
    const cols = Array.from(rowDiv.querySelectorAll(':scope > div'));
    // Defensive: If rowDiv itself contains content (no extra divs), treat as single column
    return cols.length ? cols : [rowDiv];
  });

  // Figure out maximum number of columns in any content row
  const maxCols = contentRows.reduce((max, row) => Math.max(max, row.length), 0);

  // Compose table: header row with a single cell, then all columns row-by-row
  const cells = [
    ['Columns'],
    ...contentRows
  ];

  // Build the table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Make the header cell span all columns, if more than 1 col
  if (maxCols > 1) {
    const headerCell = table.querySelector('tr th');
    if (headerCell) {
      headerCell.setAttribute('colspan', maxCols);
    }
  }

  // Replace original element
  element.replaceWith(table);
}
