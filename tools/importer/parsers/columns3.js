/* global WebImporter */
export default function parse(element, { document }) {
  // Columns block: Do NOT add field comments for Columns blocks
  // Table structure: header row (block name), then two rows, each with two columns

  // Find the main block container (with columns block class)
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Get all direct child divs of the columns block (these are visual rows)
  const visualRows = Array.from(columnsBlock.children);

  // Header row: block name only, single column
  const headerRow = ['Columns (columns3)'];

  // Build two content rows, each with two columns
  const tableRows = [headerRow];
  for (let i = 0; i < 2; i++) {
    const row = visualRows[i];
    if (row) {
      const cols = Array.from(row.children);
      // Always two columns per row
      tableRows.push([
        cols[0] || '',
        cols[1] || ''
      ]);
    }
  }

  // Create the table with the correct rows and columns
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
