/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns block itself (should contain all the content for the block)
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Find all rows (immediate children of columnsBlock)
  const rows = Array.from(columnsBlock.children);

  // Prepare the table rows
  const cells = [];
  // Header row - must match the Component/Block name exactly
  cells.push(['Columns (columns3)']);

  // Each row in the block is a table row, each cell in row is a column
  rows.forEach(row => {
    // Get all direct children of the row (these are columns)
    const cols = Array.from(row.children);
    // If there are no columns, preserve empty
    const colsContent = cols.length ? cols : [''];
    // Reference existing elements directly
    cells.push(colsContent);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace original element
  element.replaceWith(block);
}
