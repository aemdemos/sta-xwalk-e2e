/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main columns block (div with class 'columns' directly under the wrapper)
  const columnsBlock = element.querySelector(':scope > .columns');
  if (!columnsBlock) return;

  // Find each row in the columns block (each direct child div of .columns)
  const rowDivs = Array.from(columnsBlock.querySelectorAll(':scope > div'));

  // We'll build up the block rows. First row is always the header.
  const blockRows = [ ['Columns (columns3)'] ];

  // For each row in the columns block
  rowDivs.forEach(rowDiv => {
    // For each row, find direct children (the columns for the row)
    const cols = Array.from(rowDiv.children);
    // Reference the actual elements directly
    blockRows.push(cols);
  });

  // Create the columns block table
  const blockTable = WebImporter.DOMUtils.createTable(blockRows, document);

  // Replace the original wrapper with the new block table
  element.replaceWith(blockTable);
}
