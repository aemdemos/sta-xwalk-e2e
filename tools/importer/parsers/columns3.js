/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns3)'];

  // Find the two main row groups (each is a row)
  const rowGroups = Array.from(element.querySelectorAll(':scope > div'));

  // Build a 2x2 grid: each rowGroup contains two columns
  const cells = [headerRow];

  // Only use the first two rowGroups (should be two rows)
  for (let i = 0; i < 2; i++) {
    const rowGroup = rowGroups[i];
    let columns = [];
    if (rowGroup) {
      columns = Array.from(rowGroup.querySelectorAll(':scope > div'));
      // If only one column, pad with empty
      if (columns.length === 1) columns.push(document.createElement('div'));
      // Only use first two columns
      columns = columns.slice(0, 2);
    } else {
      // If missing, pad with two empty columns
      columns = [document.createElement('div'), document.createElement('div')];
    }
    cells.push([columns[0], columns[1]]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
