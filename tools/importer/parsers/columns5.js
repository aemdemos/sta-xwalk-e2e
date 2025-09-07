/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the deepest grid containing the footer columns
  let grid = element.querySelector('.aem-Grid');
  if (!grid) return;
  // Get all direct children of the grid (these are the columns visually)
  const columns = Array.from(grid.children);

  // Helper to find a child by class substring
  function findByClass(substring) {
    return columns.find((el) => el.className && el.className.includes(substring));
  }

  // 1. Logo column (image)
  const logoCol = findByClass('cmp-image--logo');
  let logoContent = null;
  if (logoCol) {
    // Defensive: find the image container
    const imgContainer = logoCol.querySelector('[data-cmp-is="image"]');
    if (imgContainer) logoContent = imgContainer;
  }

  // 2. Navigation column
  const navCol = findByClass('cmp-navigation--footer');
  let navContent = null;
  if (navCol) {
    const nav = navCol.querySelector('nav');
    if (nav) navContent = nav;
  }

  // 3. Title column ("Follow Us")
  const titleCol = findByClass('cmp-title--right');
  let titleContent = null;
  if (titleCol) {
    const titleDiv = titleCol.querySelector('.cmp-title');
    if (titleDiv) titleContent = titleDiv;
  }

  // 4. Social buttons column
  const btnListCol = findByClass('cmp-buildingblock--btn-list');
  let btnContent = null;
  if (btnListCol) {
    // Defensive: find the grid containing the buttons
    const btnGrid = btnListCol.querySelector('.aem-Grid');
    if (btnGrid) btnContent = btnGrid;
  }

  // 5. Footer text (always full width, but visually in last column)
  const textCol = findByClass('cmp-text--font-xsmall');
  let textContent = null;
  if (textCol) {
    const textDiv = textCol.querySelector('.cmp-text');
    if (textDiv) {
      // Use a div and set innerHTML to preserve all markup (including <a> tags)
      const wrapper = document.createElement('div');
      // Use outerHTML to preserve all markup and avoid losing links
      wrapper.innerHTML = textDiv.innerHTML;
      textContent = wrapper.childNodes.length === 1 ? wrapper.firstChild : wrapper;
    }
  }

  // Compose the columns for the block
  // The visual layout is:
  // | Logo | Navigation | Follow Us + Social Buttons | Footer Text |
  // We'll combine Follow Us and Social Buttons into one column

  // Compose Follow Us + Social Buttons
  let followCol = [];
  if (titleContent) followCol.push(titleContent);
  if (btnContent) followCol.push(btnContent);

  // Build the columns array
  const contentRow = [
    logoContent || '',
    navContent || '',
    followCol.length ? followCol : '',
    textContent || ''
  ];

  // Table header
  const headerRow = ['Columns (columns5)'];
  const cells = [headerRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
