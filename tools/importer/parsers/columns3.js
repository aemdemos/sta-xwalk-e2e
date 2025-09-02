/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main content rows (each is a flex row for the block)
  const blockRows = Array.from(element.querySelectorAll(':scope > div'));
  if (blockRows.length !== 2) return; // Expecting exactly 2 rows for this block

  // For each row, get its two columns (div children)
  const firstRowCols = Array.from(blockRows[0].querySelectorAll(':scope > div'));
  const secondRowCols = Array.from(blockRows[1].querySelectorAll(':scope > div'));

  // Defensive: Ensure there are two columns per row
  if (firstRowCols.length !== 2 || secondRowCols.length !== 2) return;

  // Block table header as a single cell (must match the example exactly)
  const headerRow = ['Columns (columns3)'];

  // Build the content row arrays, referencing actual DOM elements
  const row1 = [firstRowCols[0], firstRowCols[1]];
  const row2 = [secondRowCols[0], secondRowCols[1]];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    row1,
    row2
  ], document);

  // Replace original element with the table
  element.replaceWith(table);
}
