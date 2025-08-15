/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the header row exactly as needed
  const headerRow = ['Columns'];
  const tableRows = [headerRow];

  // The intended structure: one row after the header, containing all content columns side-by-side
  // Find all immediate child divs (these are the 'rows' in the block, each containing several columns)
  const rowGroups = Array.from(element.querySelectorAll(':scope > div'));
  const columnCells = [];

  rowGroups.forEach((rowGroup) => {
    // Each rowGroup contains columns as its immediate children
    const cols = Array.from(rowGroup.querySelectorAll(':scope > div'));
    // For each column, add it directly to the array
    cols.forEach((col) => {
      columnCells.push(col);
    });
  });

  // Only add the content row if there are any columns
  if (columnCells.length) {
    tableRows.push(columnCells);
  }

  // Create table and replace original element
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
