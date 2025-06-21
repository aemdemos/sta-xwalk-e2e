/* global WebImporter */
export default function parse(element, { document }) {
  // The block name header row, as specified
  const headerRow = ['Embed (embedVideo1)'];

  // Gather all visible text content from the header navigation (ignore icons/images)
  // Reference existing DOM elements rather than clones
  const nav = element.querySelector('nav');
  let textContent = '';

  if (nav) {
    // Remove images and buttons from the nav visually (do NOT clone; reference only)
    // Gather only visible text nodes
    // We'll walk through all child nodes, extract text from element nodes, ignoring images/buttons
    function getText(el) {
      let output = '';
      for (const child of el.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
          output += child.textContent + ' ';
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          // Skip img, svg, button
          if (['IMG', 'SVG', 'BUTTON'].includes(child.tagName)) continue;
          output += getText(child);
        }
      }
      return output;
    }
    textContent = getText(nav).replace(/\s+/g, ' ').trim();
  }
  // Fallback: if nothing found, try element's text
  if (!textContent) {
    textContent = element.textContent.replace(/\s+/g, ' ').trim();
  }

  // Create a single paragraph for the text for semantic meaning
  const para = document.createElement('p');
  para.textContent = textContent;

  // Content row as an array containing the referenced paragraph element
  const contentRow = [para];

  // Assemble the table rows
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the new block table
  element.replaceWith(table);
}