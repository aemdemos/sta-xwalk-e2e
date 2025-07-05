/* global WebImporter */
export default function parse(element, { document }) {
  // Find all direct child divs of the columns wrapper; these are rows
  const rows = Array.from(element.querySelectorAll(':scope > div'));
  if (!rows.length) return;

  // For each row, extract its columns (direct children divs)
  let maxCols = 0;
  const rowColumns = rows.map(row => {
    const cols = Array.from(row.querySelectorAll(':scope > div'));
    if (cols.length > maxCols) maxCols = cols.length;
    return cols;
  });

  // Only one content row in this specific block structure
  // The correct structure: header is a single cell, then one row with all columns as cells
  const tableRows = [];
  tableRows.push(['Columns']); // header: one column

  // Merge all rowColumns into a single flat array of columns (one content row)
  const contentCells = rowColumns.flat().map(col => col);
  tableRows.push(contentCells);

  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
