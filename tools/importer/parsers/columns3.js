/* global WebImporter */
export default function parse(element, { document }) {
  // Find the block within the columns-wrapper (in case element is the wrapper)
  let block = element;
  if (!block.classList.contains('block')) {
    const maybeBlock = element.querySelector('.block');
    if (maybeBlock) {
      block = maybeBlock;
    }
  }

  // Get each row (these are direct children of the columns block)
  const rows = Array.from(block.querySelectorAll(':scope > div'));

  // The first row of the table is always the block name
  const headerRow = ['Columns (columns3)'];

  // Each row in the block is a set of columns (usually two per row)
  // For each row, the direct child <div>s are the cells
  const tableRows = rows.map(row => {
    const cols = Array.from(row.querySelectorAll(':scope > div'));
    // Defensive fallback: if not subdivided, treat the row itself as a single column
    if (cols.length === 0) {
      return [row];
    }
    return cols;
  });

  // Compose the full table data
  const tableData = [headerRow, ...tableRows];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
