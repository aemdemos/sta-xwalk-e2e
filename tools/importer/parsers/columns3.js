/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct column rows
  const rowDivs = Array.from(element.querySelectorAll(':scope > div'));
  if (!rowDivs.length) return;

  // Build header row: exactly one column, as required
  const tableRows = [['Columns']];

  // The first row contains the actual columns as cells
  // For Columns block, each column is a direct child of the first rowDiv
  const firstRowColumns = Array.from(rowDivs[0].querySelectorAll(':scope > div'));
  if (firstRowColumns.length) {
    tableRows.push(firstRowColumns);
  }

  // If there is a second row (for multiple rows in the block), add additional table rows
  if (rowDivs.length > 1) {
    // For each additional rowDiv, collect its column divs
    for (let i = 1; i < rowDivs.length; i++) {
      const cols = Array.from(rowDivs[i].querySelectorAll(':scope > div'));
      if (cols.length) {
        tableRows.push(cols);
      }
    }
  }

  // Only proceed if there is at least the header and one content row
  if (tableRows.length < 2) return;

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
