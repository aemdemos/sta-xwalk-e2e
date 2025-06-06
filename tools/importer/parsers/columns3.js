/* global WebImporter */
export default function parse(element, { document }) {
  // Find the inner columns block
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Get all direct child divs of the columnsBlock (these are the column rows)
  const rowDivs = Array.from(columnsBlock.querySelectorAll(':scope > div'));
  if (!rowDivs.length) return;

  // The header row should always be a single column (per the example)
  const headerRow = ['Columns (columns3)'];
  const tableRows = [headerRow];

  // Each rowDiv corresponds to a row, each direct child div of rowDiv is a cell
  rowDivs.forEach((rowDiv) => {
    const cellDivs = Array.from(rowDiv.querySelectorAll(':scope > div'));
    if (cellDivs.length) {
      tableRows.push(cellDivs);
    }
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
