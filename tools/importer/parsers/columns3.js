/* global WebImporter */
export default function parse(element, { document }) {
  if (!element) return;

  // Header row must match the target block name exactly
  const headerRow = ['Columns (columns3)'];

  // Each direct child <div> of the columns block is a row
  const rowDivs = Array.from(element.querySelectorAll(':scope > div'));
  const tableRows = [headerRow];

  rowDivs.forEach((rowDiv) => {
    // Each rowDiv contains two columns (each a <div>)
    const colDivs = Array.from(rowDiv.querySelectorAll(':scope > div'));
    // Defensive: if no columns found, skip
    if (colDivs.length === 0) return;
    // Each cell is the full column content, referenced directly
    tableRows.push(colDivs);
  });

  // Create the table block with referenced elements
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
