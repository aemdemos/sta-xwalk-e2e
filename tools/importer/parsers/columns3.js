/* global WebImporter */
export default function parse(element, { document }) {
  // Only process columns block
  if (!element || !element.classList.contains('columns')) return;

  // Block header row as per guidelines
  const headerRow = ['Columns (columns3)'];

  // The columns block structure: .columns > div > div (column)
  // So first, get all direct children of the columns block
  const rowDivs = Array.from(element.children);
  if (rowDivs.length === 0) return;

  // For each rowDiv, collect its direct children (columns)
  const tableRows = rowDivs.map(rowDiv => {
    const colDivs = Array.from(rowDiv.children);
    // Each cell: clone the node to avoid moving it from DOM
    return colDivs.map(cell => cell.cloneNode(true));
  });

  // Compose table: header, then all content rows
  const cells = [headerRow, ...tableRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original block
  element.replaceWith(block);
}
