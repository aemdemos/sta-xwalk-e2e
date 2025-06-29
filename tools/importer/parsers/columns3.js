/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main columns block or fallback
  let block = element.querySelector('.columns.block');
  if (!block) block = element;
  const rows = Array.from(block.children);
  // Find maximum columns per row for correct colspan
  let maxColumns = 0;
  const contentRows = rows.map(row => {
    const columns = Array.from(row.children);
    if (columns.length > maxColumns) maxColumns = columns.length;
    return columns.length > 0 ? columns : [''];
  });
  if (maxColumns === 0) maxColumns = 1;
  // Build cells array: header, then content
  const cells = [];
  cells.push(['Columns']); // header row
  contentRows.forEach(row => {
    // Pad with empty strings to reach maxColumns
    while (row.length < maxColumns) row.push('');
    cells.push(row);
  });
  // Create table
  const tableEl = WebImporter.DOMUtils.createTable(cells, document);
  // Set colspan on the header cell so it spans all columns
  const headerRow = tableEl.querySelector('tr');
  if (headerRow && headerRow.firstElementChild) {
    headerRow.firstElementChild.setAttribute('colspan', maxColumns);
  }
  element.replaceWith(tableEl);
}
