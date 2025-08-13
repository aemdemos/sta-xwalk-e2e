/* global WebImporter */
export default function parse(element, { document }) {
  // The header row is always the block name in a single cell
  const headerRow = ['Columns'];

  // Find all top-level visual rows (direct children of the columns block)
  const rowDivs = Array.from(element.querySelectorAll(':scope > div'));
  if (rowDivs.length === 0) return;

  // Determine the number of columns by looking at the max number of cells in a row
  let columnCount = 0;
  const columnsPerRow = rowDivs.map(rowDiv => {
    const colDivs = Array.from(rowDiv.querySelectorAll(':scope > div'));
    columnCount = Math.max(columnCount, colDivs.length);
    return colDivs;
  });

  // Group content by column rather than by row
  // For each column index, collect that column's content from each row
  const columnCells = [];
  for (let col = 0; col < columnCount; col++) {
    // Gather all blocks for this column (from each row)
    const colContent = [];
    for (let row = 0; row < columnsPerRow.length; row++) {
      const colDivs = columnsPerRow[row];
      if (colDivs[col]) {
        colContent.push(colDivs[col]);
      }
    }
    // If there is more than one content block per column, add them as an array
    columnCells.push(colContent.length === 1 ? colContent[0] : colContent);
  }

  const cells = [headerRow, columnCells];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}