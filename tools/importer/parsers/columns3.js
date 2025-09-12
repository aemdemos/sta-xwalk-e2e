/* global WebImporter */
export default function parse(element, { document }) {
  // Only process if element is a columns-wrapper
  if (!element || !element.classList.contains('columns-wrapper')) return;

  // Always use the required block header
  const headerRow = ['Columns (columns3)'];

  // Find the columns block
  const block = element.querySelector('.columns.block');
  if (!block) return;

  // Each direct child of .columns.block is a row
  const rows = Array.from(block.children);
  const tableRows = [];

  rows.forEach((row) => {
    // Each row has two columns
    const cols = Array.from(row.children);
    if (cols.length !== 2) return;
    const cells = cols.map((col) => {
      // If this is an image column
      if (col.classList.contains('columns-img-col')) {
        // Use the <img> element directly if present
        const img = col.querySelector('img');
        if (img) return img;
        // Fallback: use the <picture> if no <img>
        const pic = col.querySelector('picture');
        if (pic) return pic;
        return col;
      }
      // Otherwise, collect all child nodes (including text, lists, buttons)
      return Array.from(col.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
    });
    tableRows.push(cells);
  });

  // Compose the table data
  const cells = [headerRow, ...tableRows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the table
  element.replaceWith(table);
}
