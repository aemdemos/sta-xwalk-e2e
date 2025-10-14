/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns block (the actual block with columns)
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Get the visual rows (each direct child of columnsBlock)
  const visualRows = Array.from(columnsBlock.children);
  if (visualRows.length < 2) return;

  // Header row (must be exactly one column)
  const headerRow = ['Columns (columns3)'];

  // Content rows
  const contentRows = [];

  // First visual row: left (text+button), right (image)
  const firstRowCols = Array.from(visualRows[0].children);
  if (firstRowCols.length === 2) {
    contentRows.push([
      firstRowCols[0].cloneNode(true), // left: text, list, button
      firstRowCols[1].cloneNode(true)  // right: image
    ]);
  }

  // Second visual row: left (image), right (text+button)
  const secondRowCols = Array.from(visualRows[1].children);
  if (secondRowCols.length === 2) {
    contentRows.push([
      secondRowCols[0].cloneNode(true), // left: image
      secondRowCols[1].cloneNode(true)  // right: text, button
    ]);
  }

  // Compose table cells
  const cells = [headerRow, ...contentRows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the wrapper element with the block table
  element.replaceWith(block);
}
