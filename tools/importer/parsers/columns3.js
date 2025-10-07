/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Columns (columns3)'];

  // Find the two main rows in the columns block
  const rows = Array.from(element.querySelectorAll(':scope > div'));
  const tableRows = [headerRow];

  // For each row (should be two for this block)
  rows.slice(0, 2).forEach((rowDiv) => {
    // Each row should have two columns
    const cols = Array.from(rowDiv.children).filter((col) => col && col.childNodes.length > 0);
    // If only one column, pad with empty
    if (cols.length === 1) {
      cols.push(document.createElement('div'));
    }
    // If more than two, just take first two
    const rowCells = cols.slice(0, 2);
    tableRows.push(rowCells);
  });

  // Defensive: If there are more than 2 rows, only use the first two
  // (already handled by slice above)

  // Ensure tableRows has 3 rows: header + 2 data rows
  // If not, pad with empty rows
  while (tableRows.length < 3) {
    tableRows.push([document.createElement('div'), document.createElement('div')]);
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
