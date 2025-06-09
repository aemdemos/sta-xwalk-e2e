/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns block inside the wrapper
  const columnsBlock = element.querySelector(':scope > .columns.block');
  if (!columnsBlock) return;

  // Get all rows (each row is a div containing two columns)
  const rows = Array.from(columnsBlock.querySelectorAll(':scope > div'));
  if (rows.length === 0) return;

  // Prepare the table rows array
  const tableRows = [];
  // The header row must match the example exactly
  tableRows.push(['Columns (columns3)']);

  // For each content row
  rows.forEach((row) => {
    // Each column is an immediate child <div>
    const cols = Array.from(row.querySelectorAll(':scope > div'));
    // Always include the correct number of columns (here, 2 per row)
    if (cols.length === 2) {
      tableRows.push([cols[0], cols[1]]);
    } else if (cols.length === 1) {
      // Edge case, rare: only one column/div in the row
      tableRows.push([cols[0], '']);
    }
    // If no columns, skip row
  });

  // Build the block table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  // Replace the original element (wrapper) with the new table
  element.replaceWith(table);
}
