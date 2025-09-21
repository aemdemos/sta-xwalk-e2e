/* global WebImporter */
export default function parse(element, { document }) {
  // Get the top-level columns block
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Helper to get direct child divs (each row)
  const rows = Array.from(columnsBlock.children);
  if (rows.length < 2) return;

  // Table header row
  const headerRow = ['Columns (columns3)'];

  // ---
  // First visual row (top):
  // Left: text, list, button
  // Right: image
  const firstRowCols = Array.from(rows[0].children);
  // Defensive: expect two columns
  const topLeft = firstRowCols[0];
  const topRight = firstRowCols[1];

  // For image columns, reference the <picture> or <img> element directly
  const topRightImg = topRight.querySelector('picture') || topRight.querySelector('img');

  // ---
  // Second visual row (bottom):
  // Left: image
  // Right: text, button
  const secondRowCols = Array.from(rows[1].children);
  const bottomLeft = secondRowCols[0];
  const bottomRight = secondRowCols[1];

  const bottomLeftImg = bottomLeft.querySelector('picture') || bottomLeft.querySelector('img');

  // Compose table rows
  // Each cell is a reference to the original element (not cloned)
  const tableRows = [
    headerRow,
    [topLeft, topRightImg],
    [bottomLeftImg, bottomRight]
  ];

  // Create the table using WebImporter.DOMUtils.createTable
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
