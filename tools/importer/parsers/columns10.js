/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the deepest grid containing the actual footer content
  let grid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!grid) {
    // fallback: try to find any .aem-Grid
    grid = element.querySelector('.aem-Grid');
  }
  if (!grid) {
    // fallback: use the element itself
    grid = element;
  }

  // Get all direct children of the grid (these are the columns visually)
  const columns = Array.from(grid.children);

  // Helper: find by class substring
  function findByClass(substring) {
    return columns.find(col => col.className && col.className.includes(substring));
  }

  // Column 1: Logo + Navigation
  const logoCol = findByClass('cmp-image--logo');
  const navCol = findByClass('cmp-navigation--footer');
  let col1Content = [];
  if (logoCol) {
    const logoBlock = logoCol.querySelector('[data-cmp-is="image"]') || logoCol;
    col1Content.push(logoBlock.cloneNode(true));
  }
  if (navCol) {
    const navBlock = navCol.querySelector('nav') || navCol;
    col1Content.push(navBlock.cloneNode(true));
  }

  // Column 2: Follow Us title + Social buttons
  const titleCol = findByClass('cmp-title--right');
  const btnListCol = findByClass('cmp-buildingblock--btn-list');
  let col2Content = [];
  if (titleCol) {
    const titleBlock = titleCol.querySelector('.cmp-title') || titleCol;
    col2Content.push(titleBlock.cloneNode(true));
  }
  if (btnListCol) {
    const btnGrid = btnListCol.querySelector('.aem-Grid') || btnListCol;
    const buttons = Array.from(btnGrid.querySelectorAll('.cmp-button'));
    buttons.forEach(btn => col2Content.push(btn.cloneNode(true)));
  }

  // Column 3: Text blocks (footer info) - preserve links and markup
  // Instead of using the grid's columns, search for all .cmp-text--font-xsmall in the element to ensure we get the correct nodes
  const textCols = Array.from(element.querySelectorAll('.cmp-text--font-xsmall'));
  let col3Content = [];
  textCols.forEach(tc => {
    // Defensive: get the actual text block
    const textBlock = tc.querySelector('.cmp-text') || tc;
    // Use outerHTML to preserve all markup, including links
    // Instead of just pushing childNodes, push the full .cmp-text block as a node
    col3Content.push(textBlock.cloneNode(true));
  });

  // Compose the table rows
  const headerRow = ['Columns (columns10)'];
  const contentRow = [col1Content, col2Content, col3Content];

  // Create the block table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
