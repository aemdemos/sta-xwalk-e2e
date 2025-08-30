/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Columns (columns3)'];

  // Get all direct child rows in block
  const rows = Array.from(element.querySelectorAll(':scope > div'));
  if (!rows.length) return;

  // For each row, get all direct child column divs
  const dataRows = rows.map(row => {
    // Only direct children, each one is a column
    const columns = Array.from(row.children);
    // Each cell is the column itself (content block)
    return columns.map(col => col);
  });

  // Compose the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...dataRows
  ], document);
  element.replaceWith(table);
}
