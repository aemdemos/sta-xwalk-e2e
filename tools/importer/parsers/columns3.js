/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns block
  const block = element.querySelector('.columns.block');
  if (!block) return;

  // Each immediate child of the block is a 'row' in the columns layout
  const rowDivs = Array.from(block.children);
  if (rowDivs.length === 0) return;

  // Table header: ALWAYS a single cell, regardless of column count
  const cells = [['Columns']];

  // For each row in the columns block, collect the direct children (columns) into an array
  rowDivs.forEach((rowDiv) => {
    const columns = Array.from(rowDiv.children);
    // Push array of columns (each cell is a reference to the original element)
    cells.push(columns);
  });

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
