/* global WebImporter */
export default function parse(element, { document }) {
  // Set up header row (must be a single cell)
  const headerRow = ['Columns'];

  // Find all top-level column group rows (immediate children of .columns.block)
  const rowDivs = Array.from(element.querySelectorAll(':scope > div'));
  // Each rowDiv contains columns (its direct children)
  // For each row, collect its direct children (columns)
  const rows = rowDivs.map(rowDiv => Array.from(rowDiv.children));

  // The final table should have:
  // - The first row (header) is a single cell: ['Columns']
  // - The second row is a single row with all column elements for all rows concatenated
  //   (since the markdown shows one content row with two columns)
  //   For multi-row columns blocks, you would flatten/merge columns into a single row after the header
  const allColumns = rows.flat();
  const cells = [headerRow, allColumns];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
