/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content rows (each immediate child div is a row)
  const rows = Array.from(element.querySelectorAll(':scope > div'));

  // For each row, get the columns (each immediate child div)
  const dataRows = rows.map(row => Array.from(row.querySelectorAll(':scope > div')));

  // Create the cells array: first row is the header, then each row is a data row with each column in its own cell
  const cells = [
    ['Columns'],
    ...dataRows
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
