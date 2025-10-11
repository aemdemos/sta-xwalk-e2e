/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: always use block name
  const headerRow = ['Columns (columns3)'];

  // Find the two main rows (each is a flex row with two columns)
  const block = element.querySelector(':scope > .columns.block');
  const rows = Array.from(block.querySelectorAll(':scope > div'));
  const tableRows = [headerRow];

  // Defensive: ensure 2x2 grid (after header)
  // First row: left cell (text+list+button), right cell (image)
  if (rows[0]) {
    const firstRowCols = Array.from(rows[0].querySelectorAll(':scope > div'));
    tableRows.push([
      firstRowCols[0] || '',
      firstRowCols[1] || ''
    ]);
  }
  // Second row: left cell (image), right cell (text+button)
  if (rows[1]) {
    const secondRowCols = Array.from(rows[1].querySelectorAll(':scope > div'));
    tableRows.push([
      secondRowCols[0] || '',
      secondRowCols[1] || ''
    ]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
