/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per spec
  const headerRow = ['Columns (columns3)'];

  // Find the .columns block inside the wrapper
  const block = element.querySelector('.columns.block');
  if (!block) return;

  // Get the two main rows (each is a <div> direct child of .columns block)
  const mainRows = Array.from(block.children);
  if (mainRows.length < 2) return;

  // First row: two columns
  const firstRowCols = Array.from(mainRows[0].children);
  const firstRow = [
    firstRowCols[0], // left: text, list, button
    firstRowCols[1], // right: image
  ];

  // Second row: two columns
  const secondRowCols = Array.from(mainRows[1].children);
  const secondRow = [
    secondRowCols[0], // left: image
    secondRowCols[1], // right: text, button
  ];

  // Compose table
  const tableCells = [
    headerRow,
    firstRow,
    secondRow,
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace the wrapper element with the new table
  element.replaceWith(table);
}
