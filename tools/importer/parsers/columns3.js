/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main .columns.block inside the wrapper
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Get all rows (each row is a direct child of .columns.block)
  const rowDivs = Array.from(columnsBlock.children).filter(
    (child) => child.nodeType === Node.ELEMENT_NODE
  );
  if (rowDivs.length === 0) return;

  // For each row, get its columns (each column is a direct child of the row)
  const tableRows = rowDivs.map(rowDiv => {
    return Array.from(rowDiv.children).filter(child => child.nodeType === Node.ELEMENT_NODE);
  });

  // Header row should be a single cell, matching the example
  const headerRow = ['Columns'];
  const cells = [headerRow, ...tableRows];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
