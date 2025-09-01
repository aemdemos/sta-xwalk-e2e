/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main columns block
  const block = element.querySelector('.columns.block');
  if (!block) return;

  // The columns block contains row divs (each row contains column divs)
  // Each row (div) inside .columns.block represents a row of columns
  // Each child div of this row is a column cell
  const rowDivs = Array.from(block.children);

  // Prepare the block table array
  const table = [];
  // Header row
  table.push(['Columns (columns3)']);

  // For each row in the block
  for (const rowDiv of rowDivs) {
    // Each column is a direct child of this rowDiv
    const columns = Array.from(rowDiv.children);
    // Each cell is either a content div or an image div
    // We include the column as-is (reference), per guidelines
    table.push(columns);
  }

  // Create the table block
  const blockTable = WebImporter.DOMUtils.createTable(table, document);
  // Replace the original element
  element.replaceWith(blockTable);
}
