/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the target block name as header
  const headerRow = ['Columns (columns3)'];

  // Each direct child <div> of .columns.block is a row
  const rows = Array.from(element.querySelectorAll(':scope > div'));
  const tableRows = [headerRow];

  // For each row, extract its columns (each <div> inside the row)
  rows.forEach((row) => {
    const cols = Array.from(row.querySelectorAll(':scope > div'));
    // If a column is empty, insert an empty string
    const cells = cols.map((col) => col.childNodes.length ? col : '');
    // Only add rows with at least one non-empty cell
    if (cells.some(cell => cell !== '')) {
      tableRows.push(cells);
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
