/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest grid containing the actual footer content
  let grid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!grid) return;

  // Get all direct children of the grid (these are the columns visually)
  const columns = Array.from(grid.children).filter((col) => {
    // Filter out separators (hr)
    if (col.classList.contains('separator')) return false;
    return true;
  });

  // The first row is always the block name
  const headerRow = ['Columns (columns5)'];

  // Find the correct columns by class
  const logoCol = columns.find((col) => col.className.includes('cmp-image--logo'));
  const navCol = columns.find((col) => col.className.includes('cmp-navigation--footer'));
  const socialTitleCol = columns.find((col) => col.className.includes('cmp-title--right'));
  const socialBtnsCol = columns.find((col) => col.className.includes('cmp-buildingblock--btn-list'));

  // Compose the social column: title + buttons
  let socialColContent = [];
  if (socialTitleCol) socialColContent.push(socialTitleCol);
  if (socialBtnsCol) socialColContent.push(socialBtnsCol);

  // Second row: three columns (logo, nav, social)
  const columnsRow = [
    logoCol || '',
    navCol || '',
    socialColContent.length ? socialColContent : '',
  ];

  // For the text rows (footer text), get all .cmp-text columns
  const textCols = columns.filter((col) => col.className.includes('cmp-text'));
  // Each textCol is a full-width row, so each gets its own row, single cell with all HTML and links preserved
  const textRows = textCols.map((textCol) => {
    // Use the actual child element (the .cmp-text > div) to preserve links and inline markup
    // CLONE the div to preserve all children and links
    const innerDiv = textCol.querySelector('div');
    return [innerDiv ? innerDiv.cloneNode(true) : textCol.cloneNode(true)];
  });

  // Compose the table
  const table = [
    headerRow,
    columnsRow,
    ...textRows,
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(table, document);
  element.replaceWith(block);
}
