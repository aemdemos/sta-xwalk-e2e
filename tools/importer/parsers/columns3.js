/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns block
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Table header: must match target block name exactly
  const headerRow = ['Columns (columns3)'];
  const tableRows = [headerRow];

  // Each child of columnsBlock is a row (each with two columns)
  const rows = Array.from(columnsBlock.children);
  for (const row of rows) {
    const cols = Array.from(row.children);
    // Defensive: always create two columns per row
    const rowCells = [];
    for (let i = 0; i < 2; i++) {
      // If column exists, push its reference; else push empty string
      if (cols[i]) {
        rowCells.push(cols[i]);
      } else {
        rowCells.push('');
      }
    }
    tableRows.push(rowCells);
  }

  // Create and replace block table
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(blockTable);
}
