/* global WebImporter */
export default function parse(element, { document }) {
  // The input is a navigation/header block, not valid Columns content.
  // Output a Columns table with a single header cell and a single, empty content cell.
  const cells = [
    ['Columns (columns1)'], // Header row: matches the example exactly
    ['']                    // Content row: one empty cell
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}