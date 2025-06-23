/* global WebImporter */
export default function parse(element, { document }) {
  // The Embed (embedVideo1) block expects: header row, then a single cell with all content (text, nav, links, brand, etc.)
  // To maximize flexibility and semantic retention, place all immediate children of the element in a wrapper div.
  // Reference the original elements to preserve formatting and semantic structure.
  const children = Array.from(element.childNodes);
  const wrapper = document.createElement('div');
  children.forEach(child => {
    // Only append elements or text nodes, skip script/style if present
    if (
      child.nodeType === Node.ELEMENT_NODE || 
      (child.nodeType === Node.TEXT_NODE && child.textContent.trim())
    ) {
      wrapper.appendChild(child);
    }
  });
  const cells = [
    ['Embed (embedVideo1)'],
    [wrapper]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}