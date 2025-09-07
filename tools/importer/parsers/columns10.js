/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest grid containing the actual footer columns
  let grid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!grid) grid = element.querySelector('.aem-Grid');
  if (!grid) grid = element;

  // Get all direct children of the grid
  const columns = Array.from(grid.children);

  // Identify columns by class
  const logoCol = columns.find(col => col.classList.contains('cmp-image--logo'));
  const navCol = columns.find(col => col.classList.contains('cmp-navigation--footer'));
  const followTitleCol = columns.find(col => col.classList.contains('cmp-title--right'));
  const socialCol = columns.find(col => col.classList.contains('cmp-buildingblock--btn-list'));
  const textCols = columns.filter(col => col.classList.contains('cmp-text--font-xsmall'));

  // Compose column 1: logo
  const logoContent = logoCol ? logoCol : '';
  // Compose column 2: navigation
  const navContent = navCol ? navCol : '';
  // Compose column 3: follow title + social buttons
  const followContent = [];
  if (followTitleCol) followContent.push(followTitleCol);
  if (socialCol) followContent.push(socialCol);
  // Compose column 4: all text blocks (footer info)
  const textContent = textCols.length > 0 ? textCols : '';

  // Table header
  const headerRow = ['Columns (columns10)'];
  // Table rows
  const firstRow = [logoContent, navContent, followContent, textContent];

  // Build the table
  const cells = [headerRow, firstRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(block);
}
