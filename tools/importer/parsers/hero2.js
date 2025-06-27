/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .hero.block
  const heroBlock = element.querySelector('.hero.block');
  let contentRoot;
  // Look for the deepest div descendant for content
  if (heroBlock) {
    // Usually structure is .hero.block > div > div
    const innerDivs = heroBlock.querySelectorAll(':scope > div > div');
    if (innerDivs.length) {
      contentRoot = innerDivs[0];
    } else {
      const divs = heroBlock.querySelectorAll(':scope > div');
      if (divs.length) {
        contentRoot = divs[0];
      } else {
        contentRoot = heroBlock;
      }
    }
  } else {
    contentRoot = element;
  }

  // Table row 1: Block name as in the example (no formatting)
  const headerRow = ['Hero'];

  // Table row 2: Image (img or picture), can be empty
  let imageEl = null;
  if (contentRoot) {
    // Look for first <picture> or <img>
    imageEl = contentRoot.querySelector('picture,img');
  }
  const imageRow = [imageEl ? imageEl : ''];

  // Table row 3: Headings and subsequent text, each as an element, all in one cell
  // Find all headings (h1-h6) in order, then paragraphs that are not empty
  let contentArr = [];
  if (contentRoot) {
    // Get all heading and paragraph children in order
    const children = Array.from(contentRoot.children);
    children.forEach(child => {
      if (/^H[1-6]$/.test(child.tagName)) {
        contentArr.push(child);
      } else if (child.tagName === 'P' && child.textContent.trim() !== '') {
        contentArr.push(child);
      }
    });
  }
  // If no headings or text, row should still exist and be empty
  const contentRow = [contentArr.length > 0 ? contentArr : ''];

  // Compose rows as in the markdown example
  const rows = [
    headerRow,
    imageRow,
    contentRow,
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  
  // Replace the original element with this table
  element.replaceWith(table);
}
