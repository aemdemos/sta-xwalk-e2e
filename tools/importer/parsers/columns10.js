/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest .aem-Grid with at least 3 direct children (logo, nav, follow-us/buttons)
  let grid;
  const grids = element.querySelectorAll('.aem-Grid');
  for (const g of grids) {
    const children = g.querySelectorAll(':scope > div');
    if (children.length >= 3 && g.closest('footer') === element) {
      grid = g;
      break;
    }
  }
  if (!grid) return;

  // Get columns: logo, nav, follow-us (title + buttons)
  const gridChildren = Array.from(grid.querySelectorAll(':scope > div'));
  const logoCol = gridChildren.find(div => div.classList.contains('cmp-image--logo'));
  const navCol = gridChildren.find(div => div.classList.contains('cmp-navigation--footer'));
  const titleCol = gridChildren.find(div => div.classList.contains('cmp-title--right'));
  const btnCol = gridChildren.find(div => div.classList.contains('cmp-buildingblock--btn-list'));

  // Defensive: fallback to empty divs if not found
  const logo = logoCol || document.createElement('div');
  const nav = navCol || document.createElement('div');
  // For follow-us, combine title and buttons
  const followUsTitle = titleCol || document.createElement('div');
  const followUsBtns = btnCol || document.createElement('div');
  const followUsCol = [followUsTitle, followUsBtns];

  // Find the two text blocks after the separator (footer description and copyright)
  const textBlocks = Array.from(element.querySelectorAll('.cmp-text--font-xsmall.aem-GridColumn--default--12'));
  // Defensive: fallback to empty divs if not found
  const text1 = textBlocks[0] || document.createElement('div');
  const text2 = textBlocks[1] || document.createElement('div');

  // Table header
  const headerRow = ['Columns (columns10)'];
  // First row: 3 columns: logo, nav, follow-us
  const firstRow = [logo, nav, followUsCol];
  // Second row: 2 columns: text1, text2 (no unnecessary empty columns)
  const secondRow = [text1, text2];

  const cells = [
    headerRow,
    firstRow,
    secondRow,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
