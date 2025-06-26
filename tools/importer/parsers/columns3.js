/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns block (the real content)
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Each direct child of .columns.block is a content row (each row contains N columns)
  const rowDivs = Array.from(columnsBlock.children);
  if (rowDivs.length === 0) return;

  // Prepare table rows
  // Header: exactly one cell, block name
  const tableRows = [['Columns']];

  // Each content row: as many columns as in the layout
  rowDivs.forEach(rowDiv => {
    const colDivs = Array.from(rowDiv.children);
    // Each column is a cell in this row
    tableRows.push(colDivs);
  });

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
