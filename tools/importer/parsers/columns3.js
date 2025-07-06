/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns block inside the wrapper
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Get all rows (direct children of the columns block)
  const rows = Array.from(columnsBlock.querySelectorAll(':scope > div'));

  // Determine max number of columns in any row (should be consistent, but be robust)
  let maxCols = 0;
  const rowCols = rows.map(row => {
    const cols = Array.from(row.querySelectorAll(':scope > div'));
    if (cols.length > maxCols) maxCols = cols.length;
    return cols.length ? cols : [row];
  });

  // Header row: a single cell with 'Columns'
  const table = [ ['Columns'] ];
  // Add all rows as parsed above
  rowCols.forEach(cols => table.push(cols));

  const block = WebImporter.DOMUtils.createTable(table, document);
  element.replaceWith(block);
}
