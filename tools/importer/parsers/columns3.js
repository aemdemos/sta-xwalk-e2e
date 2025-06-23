/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main columns block
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Get all direct children of the columns block (each is a row of 2 columns)
  const rowDivs = Array.from(columnsBlock.children);
  // Gather the actual columns (should be 4 for columns3)
  const columnCells = [];
  rowDivs.forEach((rowDiv) => {
    const colDivs = Array.from(rowDiv.children);
    colDivs.forEach((col) => {
      const wrapper = document.createElement('div');
      while (col.childNodes.length > 0) {
        wrapper.appendChild(col.childNodes[0]);
      }
      columnCells.push(wrapper);
    });
  });

  // The header row should be ONE cell
  const headerRow = ['Columns (columns3)'];
  // The content row should have as many columns as collected
  const cells = [
    headerRow,
    columnCells
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
