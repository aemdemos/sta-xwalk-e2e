/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main .columns.block element (the actual columns content)
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Get all direct child divs of the columns.block (each is a ROW of columns)
  const rows = Array.from(columnsBlock.querySelectorAll(':scope > div'));
  if (!rows.length) return;

  // For this block, we want one header row, and then a single row containing N columns (cells)
  // as shown in both the HTML and screenshot: one row, two columns
  // So, for each row, collect its direct children (each is a column cell)
  // If only one row (as here), just use its children as the content row

  // Find the maximum number of columns among the rows (for generality)
  let maxCols = 0;
  rows.forEach(row => {
    maxCols = Math.max(maxCols, row.children.length);
  });

  // Combine all direct children from all rows as columns in one row,
  // but if there are multiple row-divs, keep each row separate with same number of columns
  // For this HTML, there are two row-divs, each with two columns (so two rows of two columns)

  const table = [];
  // Header row must be exactly as in the prompt, a single cell
  table.push(['Columns']);

  // For each row, push a row with each column as a cell
  rows.forEach(row => {
    const cells = Array.from(row.children);
    table.push(cells);
  });

  const block = WebImporter.DOMUtils.createTable(table, document);
  element.replaceWith(block);
}
