/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate children (rows) of the columns block
  const rows = Array.from(element.querySelectorAll(':scope > div'));

  // Table header: exactly one column, as required by the example
  const tableRows = [['Columns']];

  // For columns, we want a single row (after the header) with N columns (cells)
  // Each top-level child is a column to go in the second row
  if (rows.length > 0) {
    const firstRowColumns = rows.map(row => row);
    tableRows.push(firstRowColumns);
  }

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
