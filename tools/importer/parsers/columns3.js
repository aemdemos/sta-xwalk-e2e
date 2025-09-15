/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: ensure element exists
  if (!element) return;

  // Header row as required
  const headerRow = ['Columns (columns3)'];

  // Get all immediate children of the columns block (should be 2 rows)
  const rows = Array.from(element.querySelectorAll(':scope > div'));
  if (rows.length < 1) return;

  // For each row, collect its immediate children (columns)
  const tableRows = [];

  rows.forEach((row) => {
    // Each row has 2 columns (divs)
    const cols = Array.from(row.querySelectorAll(':scope > div'));
    // Defensive: skip empty rows
    if (cols.length === 0) return;
    // For each column, collect the entire column div (preserves all content/structure)
    tableRows.push(cols);
  });

  // Compose the table data
  const tableData = [headerRow, ...tableRows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
