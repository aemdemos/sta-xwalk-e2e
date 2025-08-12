/* global WebImporter */
export default function parse(element, { document }) {
  // The block header row, must be a single cell array
  const headerRow = ['Columns'];

  // Find the columns block (could be the element itself or its child)
  let columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) columnsBlock = element;

  // Find immediate child divs of the columns block (these are the columns)
  const columnDivs = Array.from(columnsBlock.querySelectorAll(':scope > div'));

  // For each column, produce a single cell containing its direct children
  const contentRow = columnDivs.map(col => Array.from(col.children));

  // Compose the table: headerRow (single column), contentRow (N columns)
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
