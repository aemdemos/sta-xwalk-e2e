/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns3)'];

  // Find the two main column groups (each visual row)
  const columnGroups = Array.from(element.querySelectorAll(':scope > div'));
  const rows = [];

  columnGroups.forEach(group => {
    // Each group has two columns
    const cols = Array.from(group.querySelectorAll(':scope > div'));
    if (cols.length === 2) {
      // Left cell: all content from left column
      const leftCell = document.createElement('div');
      cols[0].childNodes.forEach(node => {
        leftCell.appendChild(node.cloneNode(true));
      });
      // Right cell: all content from right column
      const rightCell = document.createElement('div');
      cols[1].childNodes.forEach(node => {
        rightCell.appendChild(node.cloneNode(true));
      });
      rows.push([leftCell, rightCell]);
    }
  });

  // Compose the table: header + rows
  const cells = [headerRow, ...rows];
  // Remove empty cells (must be empty string, not null)
  for (let i = 1; i < cells.length; i++) {
    for (let j = 0; j < cells[i].length; j++) {
      if (!cells[i][j] || (cells[i][j].outerHTML && cells[i][j].outerHTML.trim() === '<div></div>')) {
        cells[i][j] = '';
      }
    }
  }
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
