/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns block main row: should be the direct child div of .columns.block
  // Most columns blocks have a single row, which itself contains N columns as direct children
  // (But in this HTML, there are two main direct children: each is a row, each row has two columns)

  const rows = Array.from(element.querySelectorAll(':scope > div'));
  // To match the screenshot and prompt, we need to flatten all columns at the same index from every row
  // I.e., collect columns by index: columns[0] = [row1col1, row2col1], columns[1] = [row1col2, row2col2]

  // First, determine the maximum columns per row
  let maxCols = 0;
  rows.forEach(row => {
    maxCols = Math.max(maxCols, row.children.length);
  });

  // Now, for each column index, collect the content from each row at that column position
  const columns = Array.from({ length: maxCols }, () => []);
  rows.forEach(row => {
    const cells = Array.from(row.children);
    for (let i = 0; i < maxCols; i++) {
      if (cells[i]) columns[i].push(cells[i]);
    }
  });

  // The header row
  const tableRows = [['Columns']];
  // The main content row: one array with N columns, each cell is all the content for that column
  const contentRow = columns.map(colCells => {
    // If only one element, return it directly. Otherwise, return array of elements.
    if(colCells.length === 1) return colCells[0];
    return colCells;
  });
  tableRows.push(contentRow);

  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
