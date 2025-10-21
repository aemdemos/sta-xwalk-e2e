/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as per block requirements
  const headerRow = ['Columns (columns3)'];

  // Find the two main rows (each row is a direct child div of the block)
  const rows = Array.from(element.children).filter((row) => row.nodeType === 1 && row.tagName === 'DIV');
  if (rows.length < 2) {
    const block = WebImporter.DOMUtils.createTable([headerRow], document);
    element.replaceWith(block);
    return;
  }

  // Helper: get all direct child divs for each row
  function getRowCells(row) {
    // Use all direct children that are DIVs
    return Array.from(row.children).filter((node) => node.nodeType === 1 && node.tagName === 'DIV');
  }

  // Compose rows: each row should have two columns
  const firstRowCells = getRowCells(rows[0]);
  const secondRowCells = getRowCells(rows[1]);
  while (firstRowCells.length < 2) firstRowCells.push(document.createElement('div'));
  while (secondRowCells.length < 2) secondRowCells.push(document.createElement('div'));

  // Extract all content for each cell (not just text!)
  function extractCellContent(cell) {
    if (!cell) return '';
    // If cell contains a .columns-img-col, grab its picture
    const imgCol = cell.querySelector('.columns-img-col picture');
    if (imgCol) return imgCol.cloneNode(true);
    // Otherwise, include all child nodes (text, lists, buttons, etc)
    // CRITICAL FIX: If cell contains only whitespace, return empty string
    const frag = document.createDocumentFragment();
    let hasContent = false;
    Array.from(cell.childNodes).forEach(node => {
      if (node.nodeType === 3 && node.textContent.trim().length > 0) hasContent = true;
      if (node.nodeType === 1) hasContent = true;
      frag.appendChild(node.cloneNode(true));
    });
    return hasContent ? frag : '';
  }

  // Ensure all text content is included (not just images)
  const row1 = [extractCellContent(firstRowCells[0]), extractCellContent(firstRowCells[1])];
  const row2 = [extractCellContent(secondRowCells[0]), extractCellContent(secondRowCells[1])];

  // Compose table rows
  const tableRows = [
    headerRow,
    row1,
    row2,
  ];

  // Remove any empty rows (all cells empty except header)
  const filteredRows = [tableRows[0]].concat(tableRows.slice(1).filter(row => row.some(cell => cell && (typeof cell === 'string' ? cell.trim() : true))));

  // Create table block
  const block = WebImporter.DOMUtils.createTable(filteredRows, document);

  // Replace original element with block table
  element.replaceWith(block);
}
