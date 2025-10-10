/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as header row
  const headerRow = ['Columns (columns3)'];

  // Find the main columns block (the actual content block, not the wrapper)
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Get the two main rows (each row is a direct child of .columns.block)
  const rows = Array.from(columnsBlock.children);
  if (rows.length < 2) return;

  // --- First row ---
  // Left cell: text block ("Columns block", list, button)
  const firstRowLeftCol = rows[0].children[0].cloneNode(true);
  // Right cell: image (green helix)
  const firstRowRightCol = rows[0].children[1].querySelector('picture').cloneNode(true);

  // --- Second row ---
  // Left cell: image (yellow helix)
  const secondRowLeftCol = rows[1].children[0].querySelector('picture').cloneNode(true);
  // Right cell: text block ("Or you can just view the preview", button)
  const secondRowRightCol = rows[1].children[1].cloneNode(true);

  // Build the table cells array (NO field comments for Columns/Table blocks)
  const cells = [
    headerRow,
    [firstRowLeftCol, firstRowRightCol],
    [secondRowLeftCol, secondRowRightCol],
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
