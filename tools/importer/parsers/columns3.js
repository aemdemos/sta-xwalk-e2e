/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main columns block within the wrapper
  const block = element.querySelector('[data-block-name="columns"]');
  if (!block) return;

  // Get all immediate rows in the block (each row is a <div>)
  const rows = Array.from(block.children);
  if (rows.length === 0) return;

  // Prepare the content rows (each row is an array of columns)
  const contentRows = rows.map(row => Array.from(row.children));
  // Calculate the maximum number of columns in any row
  const maxCols = Math.max(...contentRows.map(cols => cols.length));

  // Header: exactly one <th> with the exact text from the example
  const tableRows = [['Columns']];

  // For each row, fill to maxCols columns, so the table is rectangular
  contentRows.forEach(cols => {
    const padded = cols.slice();
    while (padded.length < maxCols) {
      padded.push('');
    }
    tableRows.push(padded);
  });

  // Create the table using the helper
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  // Replace the original element with the new table
  element.replaceWith(table);
}
