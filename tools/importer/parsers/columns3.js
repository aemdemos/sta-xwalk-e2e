/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .columns.block (the true block root)
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;
  
  // Each direct child of .columns.block is a row
  const rows = Array.from(columnsBlock.children);

  // Skip empty rows
  const validRows = rows.filter(row => row && row.children && row.children.length > 0);
  if (validRows.length === 0) return;

  // Prepare header row
  const headerRow = ['Columns'];
  const table = [headerRow];

  // For each row, extract columns
  validRows.forEach(row => {
    const cells = Array.from(row.children).map(col => {
      // Gather all child nodes in this column (preserving structure)
      const childNodes = Array.from(col.childNodes).filter(
        node => node.nodeType !== Node.COMMENT_NODE && !(node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '')
      );
      // If only one node and it's an element, just use it; else use array
      if (childNodes.length === 1) {
        return childNodes[0];
      }
      return childNodes;
    });
    table.push(cells);
  });

  // Create table with DOMUtils
  const blockTable = WebImporter.DOMUtils.createTable(table, document);

  // Replace the original element with the new table
  element.replaceWith(blockTable);
}
