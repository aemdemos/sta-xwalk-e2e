/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children
  const getChildren = (el) => Array.from(el.children);

  // Find the main columns block inside the wrapper
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Get all top-level columns (these are divs inside .columns.block)
  const columnDivs = getChildren(columnsBlock);

  // Defensive: Only proceed if we have columns
  if (columnDivs.length === 0) return;

  // Table header row
  const headerRow = ['Columns (columns3)'];

  // We'll build two rows, each with two columns, matching the visual layout
  // First row: left (text+list+button), right (image)
  // Second row: left (image), right (text+button)

  // --- First row ---
  // Left cell: The first column's content except the image
  const firstColChildren = getChildren(columnDivs[0]);
  // The left cell is the firstColChildren[0] (text/list/button)
  const leftCellRow1 = firstColChildren[0];
  // The right cell is the image (firstColChildren[1])
  const rightCellRow1 = firstColChildren[1];

  // --- Second row ---
  // Left cell: The image from the second column
  const secondColChildren = getChildren(columnDivs[1]);
  const leftCellRow2 = secondColChildren[0];
  // Right cell: The text/button from the second column
  const rightCellRow2 = secondColChildren[1];

  // Compose table rows
  const tableRows = [
    headerRow,
    [leftCellRow1, rightCellRow1],
    [leftCellRow2, rightCellRow2],
  ];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(blockTable);
}
