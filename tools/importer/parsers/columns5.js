/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the deepest grid containing the actual footer columns
  let grid = element.querySelector('.aem-Grid.aem-Grid--12') || element.querySelector('.aem-Grid') || element;

  // Get all direct children of the grid (these are the columns visually)
  const columns = Array.from(grid.children);

  // Helper to find by class substring
  function findByClass(substring) {
    return columns.find(col => col.className && col.className.indexOf(substring) !== -1);
  }

  // 1. Logo column (image)
  const logoCol = findByClass('cmp-image--logo');
  let logoBlock = null;
  if (logoCol) {
    const imageBlock = logoCol.querySelector('[data-cmp-is="image"]');
    if (imageBlock) {
      logoBlock = imageBlock;
    }
  }

  // 2. Navigation column
  const navCol = findByClass('cmp-navigation--footer');
  let navBlock = null;
  if (navCol) {
    const navBlockEl = navCol.querySelector('nav.cmp-navigation');
    if (navBlockEl) {
      navBlock = navBlockEl;
    }
  }

  // 3. Social title column
  const titleCol = findByClass('cmp-title--right');
  let titleBlock = null;
  if (titleCol) {
    const titleBlockEl = titleCol.querySelector('.cmp-title');
    if (titleBlockEl) {
      titleBlock = titleBlockEl;
    }
  }

  // 4. Social buttons column
  const socialCol = findByClass('cmp-buildingblock--btn-list');
  let socialBlock = null;
  if (socialCol) {
    const socialGrid = socialCol.querySelector('.aem-Grid');
    if (socialGrid) {
      socialBlock = socialGrid;
    }
  }

  // 5. Text blocks (footer text)
  const textCols = columns.filter(col => col.className && col.className.indexOf('cmp-text--font-xsmall') !== -1);
  let textBlocks = [];
  textCols.forEach(tc => {
    const textBlock = tc.querySelector('.cmp-text');
    if (textBlock) {
      textBlocks.push(textBlock);
    }
  });

  // Compose columns for the block table
  // Visual grouping: logo | navigation | social title + buttons
  // Text is below, spanning all columns

  // Compose the first content row (columns)
  const firstRow = [
    logoBlock,
    navBlock,
    [titleBlock, socialBlock]
  ];

  // Compose the second content row (footer text)
  // Combine all text blocks into one cell spanning all columns
  const secondRow = [
    textBlocks
  ];

  // Table header
  const headerRow = ['Columns (columns5)'];

  // Build the table
  const cells = [
    headerRow,
    firstRow,
    secondRow
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
