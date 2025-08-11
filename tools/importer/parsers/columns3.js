/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: single cell with block name
  const headerRow = ['Columns'];

  // Gather all columns (should be 4 for this HTML)
  // The structure: two top-level rows, each containing two columns
  // We need to flatten all direct child <div> of each row
  const rows = Array.from(element.querySelectorAll(':scope > div'));
  const columnDivs = [];
  rows.forEach(row => {
    columnDivs.push(...row.querySelectorAll(':scope > div'));
  });

  // Defensive: only add non-empty columns
  const contentRow = columnDivs.filter(col => col && col.textContent.trim() !== '' || col.querySelector('img,picture,a,ul'));

  // Build the cells array: header + content row (each column is a separate cell)
  const cells = [headerRow, contentRow];

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
