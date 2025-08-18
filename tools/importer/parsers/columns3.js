/* global WebImporter */
export default function parse(element, { document }) {
  // Find rows: direct children divs of the columns-wrapper
  const rows = Array.from(element.querySelectorAll(':scope > div'));
  if (!rows.length) return;

  // Header row: always 'Columns' per instructions
  const cells = [['Columns']];

  // For each row, extract its columns (immediate child divs)
  rows.forEach((row) => {
    let cols = Array.from(row.querySelectorAll(':scope > div'));
    // Handle possible wrappers: if only one column and it contains further divs, treat those as the real columns
    if (cols.length === 1) {
      const nested = Array.from(cols[0].querySelectorAll(':scope > div'));
      if (nested.length > 1) {
        cols = nested;
      }
    }
    // Each cell is the referenced original HTML element
    cells.push(cols);
  });

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
