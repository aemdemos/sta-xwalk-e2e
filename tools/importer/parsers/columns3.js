/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns block (the actual content block)
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Get the two main row divs (each row is a flex row with two columns)
  const rowDivs = Array.from(columnsBlock.children);
  if (rowDivs.length < 2) return;

  // First row: left (text), right (image)
  const firstRowCols = Array.from(rowDivs[0].children);
  if (firstRowCols.length !== 2) return;
  const topLeft = firstRowCols[0];
  const topRight = firstRowCols[1];

  // Second row: left (image), right (text)
  const secondRowCols = Array.from(rowDivs[1].children);
  if (secondRowCols.length !== 2) return;
  const bottomLeft = secondRowCols[0];
  const bottomRight = secondRowCols[1];

  // Always use the required header
  const headerRow = ['Columns (columns3)'];

  // Build the table rows, referencing existing elements
  const tableRows = [
    headerRow,
    [topLeft, topRight],
    [bottomLeft, bottomRight],
  ];

  // Create the table using the DOMUtils helper
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  columnsBlock.replaceWith(table);
}
