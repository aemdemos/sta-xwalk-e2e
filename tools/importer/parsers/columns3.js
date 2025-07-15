/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main block containing the columns
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Find all rows (direct child divs of .columns.block)
  const rowDivs = Array.from(columnsBlock.children);

  // We'll build a 2D array for the table cells
  // Header row: must be a single cell (block name)
  const cells = [ ['Columns'] ];

  // All following rows must have the same number of columns as the first row of content
  rowDivs.forEach((rowDiv) => {
    // Each column is a direct child of the rowDiv
    const colDivs = Array.from(rowDiv.children);
    cells.push(colDivs);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
