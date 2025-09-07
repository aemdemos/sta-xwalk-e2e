/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest .aem-Grid with the actual footer content
  let grid;
  const grids = element.querySelectorAll('.aem-Grid');
  if (grids.length > 0) {
    grid = grids[grids.length - 1];
  } else {
    grid = element;
  }

  // Get all direct children of the grid (these are the columns visually)
  const columns = Array.from(grid.children);

  // 1. Logo (always present)
  let logoCell = null;
  const logoCol = columns.find(col => col.classList.contains('image'));
  if (logoCol) {
    const logoLink = logoCol.querySelector('a');
    if (logoLink) {
      logoCell = logoLink.cloneNode(true);
    }
  }

  // 2. Navigation (may be missing)
  let navCell = null;
  const navCol = columns.find(col => col.classList.contains('navigation'));
  if (navCol) {
    const nav = navCol.querySelector('nav');
    if (nav) {
      // Only top-level navigation links (no submenus)
      const navFrag = document.createElement('div');
      const navLinks = nav.querySelectorAll('ul.cmp-navigation__group > li > a');
      navLinks.forEach(link => navFrag.appendChild(link.cloneNode(true)));
      if (navFrag.childNodes.length > 0) navCell = navFrag;
    }
  }

  // 3. Follow Us + Social Buttons (always present)
  let followCell = null;
  const titleCol = columns.find(col => col.classList.contains('title'));
  const btnCol = columns.find(col => col.classList.contains('buildingblock'));
  if (titleCol || btnCol) {
    const frag = document.createElement('div');
    if (titleCol) {
      const followTitle = titleCol.querySelector('.cmp-title__text');
      if (followTitle) frag.appendChild(followTitle.cloneNode(true));
    }
    if (btnCol) {
      const btns = btnCol.querySelectorAll('a.cmp-button');
      btns.forEach(btn => frag.appendChild(btn.cloneNode(true)));
    }
    if (frag.childNodes.length > 0) followCell = frag;
  }

  // 4. Copyright text (always present)
  let copyrightCell = null;
  const textCol = columns.find(col => col.classList.contains('text'));
  if (textCol) {
    const cmpText = textCol.querySelector('.cmp-text');
    if (cmpText) copyrightCell = cmpText.cloneNode(true);
  }

  // Compose columns row, only include non-empty columns
  const columnsRow = [];
  if (logoCell) columnsRow.push(logoCell);
  if (navCell) columnsRow.push(navCell);
  if (followCell) columnsRow.push(followCell);
  if (copyrightCell) columnsRow.push(copyrightCell);

  // Always create the table if there's any content
  if (columnsRow.length > 0) {
    const headerRow = ['Columns (columns5)'];
    const cells = [headerRow, columnsRow];
    const block = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(block);
  }
}
