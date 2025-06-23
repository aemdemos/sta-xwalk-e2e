/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const tableRows = [['Columns (columns3)']];

  // For each direct child <div> (row) of the block
  const rowDivs = Array.from(element.querySelectorAll(':scope > div'));
  rowDivs.forEach(rowDiv => {
    // For each row, get its immediate children as columns
    const colDivs = Array.from(rowDiv.querySelectorAll(':scope > div'));
    // If there are no colDivs, treat the rowDiv itself as a single cell (defensive, edge case)
    const rowCells = colDivs.length > 0 ? colDivs : [rowDiv];
    tableRows.push(rowCells);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  // Replace the original element
  element.replaceWith(block);
}
