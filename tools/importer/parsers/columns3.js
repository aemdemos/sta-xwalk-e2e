/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches the block name
  const headerRow = ['Columns'];
  // Get all immediate child divs (column groups)
  const columnGroups = Array.from(element.querySelectorAll(':scope > div'));

  // Each group contains two columns, so we want to extract their content
  const rows = [];
  columnGroups.forEach(group => {
    const cols = Array.from(group.querySelectorAll(':scope > div'));
    // Defensive: If a group only has one div, treat that as a column
    if (cols.length === 0) {
      rows.push([group]);
    } else {
      rows.push(cols);
    }
  });

  // Compose the table structure: header row, then each row as an array of cells
  const cells = [headerRow, ...rows];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(table);
}
