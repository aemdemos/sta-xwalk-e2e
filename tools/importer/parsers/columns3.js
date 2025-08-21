/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must be a single cell, matching the example
  const headerRow = ['Columns'];

  // Gather all rows of columns
  const blockRows = Array.from(element.querySelectorAll(':scope > div'));

  // For the columns block, content is presented side by side in columns from the first row only
  // According to the screenshots and description, only the FIRST row of child <div>s should form the columns row
  if (blockRows.length === 0) {
    // No content rows, just header
    const cells = [headerRow];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
    return;
  }

  // Only use the direct children <div> of the first row for the columns
  const firstRow = blockRows[0];
  const columnDivs = Array.from(firstRow.querySelectorAll(':scope > div'));

  // Each cell is the full content of each column <div>
  const columnsRow = columnDivs;

  // Only one content row (columns), below the header
  const cells = [headerRow, columnsRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}
