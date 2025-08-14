/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns block (div with data-block-name="columns")
  let block = element.querySelector('[data-block-name="columns"]');
  if (!block) block = element;

  // Each direct child of block is a 'row' group (for this HTML that means two rows, each with two columns)
  const rowGroups = Array.from(block.children);

  // Prepare table rows
  const rows = [];

  // 1. Header row - always 'Columns' as per the instructions and example
  rows.push(['Columns']);

  // 2+. For each row, extract its direct children as columns
  rowGroups.forEach(rowGroup => {
    // Each column is a direct child div
    const columns = Array.from(rowGroup.children);
    // Reference the original divs to preserve all content/structure within
    rows.push(columns);
  });

  // Create table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element with table
  element.replaceWith(table);
}
