/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns3)'];

  // Find the two main rows in the columns block
  const rows = [headerRow];

  // The columns block structure: two main <div>s, each with two <div>s inside
  const mainRows = Array.from(element.querySelectorAll(':scope > div'));

  // Defensive: Only process the first two rows (as per screenshot and markdown)
  for (let i = 0; i < 2; i++) {
    const mainRow = mainRows[i];
    if (!mainRow) continue;
    // Get the two columns for this row
    const cols = Array.from(mainRow.querySelectorAll(':scope > div'));
    // Defensive: If only one column, pad to two
    while (cols.length < 2) cols.push(document.createElement('div'));
    // Only take the first two columns, and ensure each cell is not a container div
    const rowCells = cols.slice(0, 2).map(cell => {
      // If the cell is a div with only one child, and that child is a div, flatten it
      if (
        cell.childElementCount === 1 &&
        cell.firstElementChild &&
        cell.firstElementChild.tagName === 'DIV'
      ) {
        return cell.firstElementChild;
      }
      return cell;
    });
    rows.push(rowCells);
  }

  // Only keep header + two data rows (no extra rows)
  rows.length = 3;

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
