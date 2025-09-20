/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main columns block structure
  const columnsBlock = element.querySelector(':scope > .columns.block');
  if (!columnsBlock) return;

  // Get the two visual rows (each is a direct child div of columnsBlock)
  const rowGroups = Array.from(columnsBlock.children);
  if (rowGroups.length < 2) return;

  // Prepare header row
  const headerRow = ['Columns (columns3)'];

  // --- First visual row ---
  // First row has two columns: left (text), right (image)
  const firstRowDivs = Array.from(rowGroups[0].children);
  if (firstRowDivs.length < 2) return;
  const firstLeft = firstRowDivs[0];
  const firstRight = firstRowDivs[1];

  // Left cell: all content (paragraphs, ul, button)
  const leftCell1 = document.createElement('div');
  Array.from(firstLeft.childNodes).forEach((node) => {
    leftCell1.appendChild(node.cloneNode(true));
  });

  // Right cell: image (picture)
  const rightCell1 = document.createElement('div');
  Array.from(firstRight.childNodes).forEach((node) => {
    rightCell1.appendChild(node.cloneNode(true));
  });

  // --- Second visual row ---
  // Second row: left (image), right (text + button)
  const secondRowDivs = Array.from(rowGroups[1].children);
  if (secondRowDivs.length < 2) return;
  const secondLeft = secondRowDivs[0];
  const secondRight = secondRowDivs[1];

  // Left cell: image (picture)
  const leftCell2 = document.createElement('div');
  Array.from(secondLeft.childNodes).forEach((node) => {
    leftCell2.appendChild(node.cloneNode(true));
  });

  // Right cell: text + button
  const rightCell2 = document.createElement('div');
  Array.from(secondRight.childNodes).forEach((node) => {
    rightCell2.appendChild(node.cloneNode(true));
  });

  // Compose table rows
  const row1 = [leftCell1, rightCell1];
  const row2 = [leftCell2, rightCell2];

  const cells = [headerRow, row1, row2];

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
