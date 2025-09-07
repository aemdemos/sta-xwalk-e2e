/* global WebImporter */
export default function parse(element, { document }) {
  if (!element) return;

  // Header row as required
  const headerRow = ['Columns (columns3)'];

  // Get all immediate child divs (each is a row of columns)
  const rows = Array.from(element.querySelectorAll(':scope > div'));
  const tableRows = [];

  rows.forEach((rowDiv) => {
    // Each rowDiv contains 2 child divs (columns)
    const cols = Array.from(rowDiv.children);
    const rowCells = cols.map((colDiv) => {
      // If this column contains only an image, use the image
      const picture = colDiv.querySelector('picture');
      // If there is a picture and other content, collect all content
      if (picture && colDiv.childNodes.length === 1) {
        return picture;
      }
      // Otherwise, collect all content (including text nodes)
      const fragment = document.createDocumentFragment();
      Array.from(colDiv.childNodes).forEach((node) => {
        // Only append if node has meaningful content
        if (
          (node.nodeType === Node.ELEMENT_NODE && (node.textContent.trim() || node.tagName.toLowerCase() === 'picture')) ||
          (node.nodeType === Node.TEXT_NODE && node.textContent.trim())
        ) {
          fragment.appendChild(node.cloneNode(true));
        }
      });
      // If fragment is empty, return empty string
      if (!fragment.childNodes.length) return '';
      // If only one node, return it directly
      if (fragment.childNodes.length === 1) return fragment.firstChild;
      // Otherwise, return the fragment
      return fragment;
    });
    tableRows.push(rowCells);
  });

  const cells = [headerRow, ...tableRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
