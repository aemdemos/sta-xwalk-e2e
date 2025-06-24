/* global WebImporter */
export default function parse(element, { document }) {
  // Get each column row
  const columnRows = Array.from(element.querySelectorAll(':scope > div'));
  if (!columnRows.length) return;

  // Each row maps to a table row after the header
  // For each column row, collect its direct children (columns)
  const dataRows = columnRows.map(row => Array.from(row.children));

  // The header row must be a single cell with just 'Columns'
  const cells = [['Columns']];
  // Now add each data row (each is an array of column elements)
  dataRows.forEach(row => {
    cells.push(row);
  });

  // Only continue if we have at least a header and one content row
  if (cells.length < 2) return;

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
