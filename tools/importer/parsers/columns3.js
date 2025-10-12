/* global WebImporter */
export default function parse(element, { document }) {
  // Columns block: No field comments required in cells per rules
  const headerRow = ['Columns (columns3)'];
  const tableRows = [headerRow];

  // Find all content rows in the columns block
  const rows = Array.from(element.querySelectorAll(':scope > div'));

  // Each row in the columns block should become a table row with two columns
  rows.forEach(row => {
    const cols = Array.from(row.querySelectorAll(':scope > div'));
    if (cols.length === 2) {
      tableRows.push([cols[0], cols[1]]);
    }
  });

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
