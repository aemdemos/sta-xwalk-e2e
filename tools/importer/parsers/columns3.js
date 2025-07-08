/* global WebImporter */
export default function parse(element, { document }) {
  // Find all immediate row divs (children of the columns block)
  const rowDivs = Array.from(element.querySelectorAll(':scope > div'));
  // Defensive: skip if there's nothing to process
  if (rowDivs.length === 0) return;

  // The actual columns are the children of the FIRST row
  const columnDivs = Array.from(rowDivs[0].querySelectorAll(':scope > div'));

  // Likewise, if there's a second row (for 2-row columns blocks), collect its columns too
  let secondRowColumns = [];
  if (rowDivs.length > 1) {
    secondRowColumns = Array.from(rowDivs[1].querySelectorAll(':scope > div'));
  }

  const cells = [];
  // Header row: exactly one cell with block name
  cells.push(['Columns']);
  // Content row: one row with as many columns as detected
  if (columnDivs.length > 0) {
    cells.push(columnDivs);
  }
  // If there's a second row, add it as another row
  if (secondRowColumns.length > 0) {
    cells.push(secondRowColumns);
  }
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
