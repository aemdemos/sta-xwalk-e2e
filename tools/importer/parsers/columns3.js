/* global WebImporter */
export default function parse(element, { document }) {
  // Find the actual columns block inside the wrapper
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Get the two top-level rows
  const rows = Array.from(columnsBlock.children);
  if (rows.length < 2) return;

  // First visual row: two columns
  const firstRowDivs = Array.from(rows[0].children);
  if (firstRowDivs.length < 2) return;
  const firstRowCol1 = firstRowDivs[0];
  const firstRowCol2 = firstRowDivs[1];

  // Second visual row: two columns
  const secondRowDivs = Array.from(rows[1].children);
  if (secondRowDivs.length < 2) return;
  const secondRowCol1 = secondRowDivs[0];
  const secondRowCol2 = secondRowDivs[1];

  // Compose table rows
  const headerRow = ['Columns (columns3)'];
  const row1 = [firstRowCol1, firstRowCol2];
  const row2 = [secondRowCol1, secondRowCol2];

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    row1,
    row2,
  ], document);

  // Replace the original wrapper element
  element.replaceWith(table);
}
