/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the deepest grid containing the columns
  let grid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!grid) return;

  // Find the 3 main columns: logo, navigation, follow-us (title+buttons)
  // These are always direct children of the grid
  const columns = [];

  // 1. Logo column (image)
  const logoCol = grid.querySelector('.image.cmp-image--logo');
  let logoContent = null;
  if (logoCol) {
    // Use the logo image link block
    const logoBlock = logoCol.querySelector('[data-cmp-is="image"]');
    if (logoBlock) logoContent = logoBlock;
  }
  columns.push(logoContent || '');

  // 2. Navigation column
  const navCol = grid.querySelector('.navigation.cmp-navigation--footer');
  let navContent = null;
  if (navCol) {
    // Use the nav block
    const navBlock = navCol.querySelector('nav');
    if (navBlock) navContent = navBlock;
  }
  columns.push(navContent || '');

  // 3. Follow Us column (title + buttons)
  const followCol = grid.querySelector('.title.cmp-title--right');
  let followContent = [];
  if (followCol) {
    const titleBlock = followCol.querySelector('.cmp-title');
    if (titleBlock) followContent.push(titleBlock);
    // The buttons are in the next sibling with cmp-buildingblock--btn-list
    let btnList = followCol.parentElement.querySelector('.cmp-buildingblock--btn-list');
    if (btnList) {
      // Defensive: get the button grid inside
      const btnGrid = btnList.querySelector('.aem-Grid');
      if (btnGrid) followContent.push(btnGrid);
    }
  }
  columns.push(followContent.length ? followContent : '');

  // 4. Text row (copyright and description)
  // Find the .text.cmp-text--font-xsmall block
  let textContent = ['', '', ''];
  const textCol = grid.querySelector('.text.cmp-text--font-xsmall');
  if (textCol) {
    const textBlock = textCol.querySelector('.cmp-text');
    if (textBlock) {
      // Clone to avoid modifying the original
      const cloned = textBlock.cloneNode(true);
      // Distribute paragraphs into columns, preserving links
      const paragraphs = Array.from(cloned.querySelectorAll('p'));
      if (paragraphs.length === 3) {
        textContent = [paragraphs[0], paragraphs[1], paragraphs[2]];
      } else if (paragraphs.length === 2) {
        textContent = [paragraphs[0], paragraphs[1], ''];
      } else if (paragraphs.length === 1) {
        textContent = [paragraphs[0], '', ''];
      } else {
        textContent = [cloned, '', ''];
      }
    }
  }

  // Fix: For the second column, if there are links in the original HTML that are missing, re-insert them
  // This is a fallback for the case where the HTML was flattened (e.g. Core Components and detailed tutorial)
  // We'll check if the second column is a <p> and if so, try to restore the links from the original textBlock
  if (textCol && textContent[1] && textContent[1].nodeType === 1 && textContent[1].tagName === 'P') {
    // Use the original HTML from the textBlock for the second paragraph
    const origParagraphs = textCol.querySelectorAll('p');
    if (origParagraphs.length >= 2) {
      textContent[1] = origParagraphs[1].cloneNode(true);
    }
  }

  const headerRow = ['Columns (columns5)'];
  const contentRow = columns;
  const textRow = textContent;

  // Table: header, content, text (footer) row
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
    textRow,
  ], document);

  element.replaceWith(table);
}
