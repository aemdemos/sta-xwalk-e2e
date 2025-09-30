/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns block
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;
  const topRows = Array.from(columnsBlock.children);

  // Prepare header row exactly as required
  const headerRow = ['Columns (columns3)'];

  // Defensive extraction for each cell
  // First visual row: left (text+list+button), right (image)
  const firstRowLeft = topRows[0]?.children[0] || document.createElement('div');
  const firstRowRight = topRows[0]?.children[1] || document.createElement('div');

  // Second visual row: left (image), right (text+button)
  const secondRowLeft = topRows[1]?.children[0] || document.createElement('div');
  const secondRowRight = topRows[1]?.children[1] || document.createElement('div');

  // Compose table rows
  const tableRows = [
    headerRow,
    [firstRowLeft, firstRowRight],
    [secondRowLeft, secondRowRight],
  ];

  // Create the columns block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(block);
}
