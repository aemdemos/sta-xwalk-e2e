/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero block main content: innermost div with content
  let contentDiv = element;
  // Go down the tree to the innermost div with content
  let cur = element;
  while (cur && cur.querySelector(':scope > div')) {
    cur = cur.querySelector(':scope > div');
    // Break if no more inner divs
    if (!cur || cur === contentDiv) break;
    contentDiv = cur;
  }

  // Now, contentDiv should be the <div> that contains the picture, heading, and paragraphs
  // Find the <picture> or <img> (background image)
  let imageEl = contentDiv.querySelector('picture');
  if (!imageEl) imageEl = contentDiv.querySelector('img');

  // Find all heading and paragraph elements in visual order
  // We want to preserve heading levels and paragraphs as they are
  const contentEls = [];
  contentDiv.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (/^H[1-6]$/.test(node.tagName) || node.tagName === 'P') {
        // Only push paragraphs that are not empty
        if (node.tagName !== 'P' || node.textContent.trim() !== '' || node.querySelector('img')) {
          contentEls.push(node);
        }
      }
    }
  });
  // Exclude any <p> which only contains the image, since that is used for the background
  if (imageEl && contentEls.length > 0 && contentEls[0].contains(imageEl)) {
    contentEls.shift();
  }

  // Build the Hero block table: header, image row, content row
  const cells = [];
  cells.push(['Hero']);
  cells.push([imageEl ? imageEl : '']);
  cells.push([contentEls.length ? contentEls : '']);

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
