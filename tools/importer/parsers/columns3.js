/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get immediate children divs of columns block
  const blockDiv = element.querySelector('.columns.block');
  if (!blockDiv) return;

  // Each child div of blockDiv is a row
  const rowDivs = Array.from(blockDiv.children);

  // Prepare table rows
  const rows = [];
  // Header row: must match block name exactly
  rows.push(['Columns (columns3)']);

  // For each rowDiv, extract its two columns
  rowDivs.forEach(rowDiv => {
    // Each rowDiv has two children (left/right)
    const colDivs = Array.from(rowDiv.children);
    if (colDivs.length === 2) {
      rows.push([
        colDivs[0],
        colDivs[1]
      ]);
    } else if (colDivs.length === 1) {
      rows.push([
        colDivs[0]]);
    } else if (colDivs.length > 2) {
      // Defensive: more than 2 columns
      rows.push(colDivs);
    }
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
