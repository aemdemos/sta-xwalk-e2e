/* global WebImporter */
export default function parse(element, { document }) {
  if (!element) return;

  // Find the columns block (should be .columns.block)
  const block = element.querySelector('.columns.block');
  if (!block) return;

  // Find the two rows (each row is a direct child <div> of the columns block)
  const rows = Array.from(block.children);
  if (rows.length < 2) return;

  // Each row has two columns (each column is a direct child <div> of the row)
  const firstRowCols = Array.from(rows[0].children);
  const secondRowCols = Array.from(rows[1].children);
  if (firstRowCols.length !== 2 || secondRowCols.length !== 2) return;

  // Table header must match the block name exactly
  const headerRow = ['Columns (columns3)'];

  // Compose the table rows, referencing the actual DOM elements (not clones)
  const tableRows = [
    headerRow,
    [firstRowCols[0], firstRowCols[1]],
    [secondRowCols[0], secondRowCols[1]],
  ];

  // Create the table using the DOMUtils helper
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the columns-wrapper with the table
  element.replaceWith(table);
}
