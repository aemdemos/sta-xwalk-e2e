/* global WebImporter */
export default function parse(element, { document }) {
  // Select the direct child rows of the columns block
  const rows = Array.from(element.querySelectorAll(':scope > div'));
  if (!rows.length) return;

  // Find out how many columns are in the first content row
  const firstCols = rows[0].querySelectorAll(':scope > div');
  const colCount = firstCols.length;
  if (colCount === 0) return;

  // Build the table rows: header first (only one column!), then content rows
  const tableRows = [];
  tableRows.push(['Columns']); // single header cell per requirements

  // For each row, get all its columns (divs)
  rows.forEach((row) => {
    const cols = Array.from(row.querySelectorAll(':scope > div'));
    // If there are fewer cols than colCount, pad with empty strings
    while (cols.length < colCount) cols.push('');
    // Only keep exact number of columns
    tableRows.push(cols.slice(0, colCount));
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
