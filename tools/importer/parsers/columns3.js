/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row, per block name
  const headerRow = ['Columns'];

  // Find the main columns block inside the wrapper
  const columnsBlock = element.querySelector(':scope > .columns.block');
  if (!columnsBlock) return;

  // Find each row inside the columns block (each is a direct child div)
  const rowDivs = Array.from(columnsBlock.querySelectorAll(':scope > div'));

  const tableRows = [];

  // For each row, extract its columns (each is a direct child div)
  rowDivs.forEach(rowDiv => {
    const colDivs = Array.from(rowDiv.querySelectorAll(':scope > div'));
    // If no columns found, skip
    if (colDivs.length === 0) return;
    tableRows.push(colDivs);
  });

  // Only add rows with at least one column
  if (tableRows.length === 0) return;

  // Build the table data array: headerRow + tableRows
  const tableData = [headerRow, ...tableRows];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the element with the new block table
  element.replaceWith(blockTable);
}
