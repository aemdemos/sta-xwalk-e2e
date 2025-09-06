/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by class
  function getDirectChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList && child.classList.contains(className));
  }

  // Find the main grid inside the element
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get the three main columns: logo image, navigation, search
  const columns = [];

  // 1. Logo/Image column
  const imageCol = getDirectChildByClass(grid, 'image');
  if (imageCol) {
    // The actual logo image is inside a div inside this column
    const logoDiv = imageCol.querySelector('[data-cmp-is="image"]');
    if (logoDiv) columns.push(logoDiv);
    else columns.push('');
  } else {
    columns.push('');
  }

  // 2. Navigation column
  const navCol = getDirectChildByClass(grid, 'navigation');
  if (navCol) {
    // The nav element is the main navigation
    const nav = navCol.querySelector('nav');
    if (nav) columns.push(nav);
    else columns.push('');
  } else {
    columns.push('');
  }

  // 3. Search column
  const searchCol = getDirectChildByClass(grid, 'search');
  if (searchCol) {
    // The section element is the search block
    const searchSection = searchCol.querySelector('section');
    if (searchSection) columns.push(searchSection);
    else columns.push('');
  } else {
    columns.push('');
  }

  // If navigation is empty (as in the first screenshot), remove it for a 2-column layout
  let contentRow;
  if (columns[1] && columns[1].textContent.trim()) {
    contentRow = [columns[0], columns[1], columns[2]];
  } else {
    // Only logo and search
    contentRow = [columns[0], columns[2]];
  }

  const headerRow = ['Columns (columns2)'];
  const tableArr = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(tableArr, document);
  element.replaceWith(table);
}
