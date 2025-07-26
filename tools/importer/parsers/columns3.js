/* global WebImporter */
export default function parse(element, { document }) {
  // The header row as exactly specified in the example
  const headerRow = ['Columns'];

  // Find all rows: each direct child <div> of the columns block
  const rowDivs = Array.from(element.querySelectorAll(':scope > div'));

  // For each row, extract its immediate children (the column divs for that row)
  // Each row becomes an array, each column is referenced as-is
  const contentRows = rowDivs.map(rowDiv => {
    // Each column is a single child div
    return Array.from(rowDiv.children);
  });

  // Table is: header, then each row in order
  const cells = [headerRow, ...contentRows];

  // Create block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
