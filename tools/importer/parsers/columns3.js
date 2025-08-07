/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main columns block wrapper
  // Get the first child (the columns content rows)
  const block = element.querySelector(':scope > .columns.block');
  // If for some reason that doesn't exist, fallback to the provided element
  const columnsBlock = block || element;

  // All the 'rows' are immediate children of .columns.block
  const rowDivs = Array.from(columnsBlock.querySelectorAll(':scope > div'));
  if (!rowDivs.length) return;

  // We want to produce a table:
  // Header row: ['Columns']
  // Second row: [col1Content, col2Content, ...], where each cell is a DOM element for a column

  // The first row in the block contains the actual columns
  const firstRow = rowDivs[0];
  // The columns are its direct children
  const columns = Array.from(firstRow.querySelectorAll(':scope > div'));
  // If there are more rows, treat them as additional horizontal bands
  const table = [['Columns']];

  // Collect all rows. Each row is an array of the column divs in that band.
  for (let i = 0; i < rowDivs.length; i++) {
    const row = rowDivs[i];
    const cols = Array.from(row.querySelectorAll(':scope > div'));
    // Only add if there is at least one column (prevents empty rows)
    if (cols.length > 0) {
      table.push(cols);
    }
  }

  // Create and replace with the block table
  const blockTable = WebImporter.DOMUtils.createTable(table, document);
  element.replaceWith(blockTable);
}
