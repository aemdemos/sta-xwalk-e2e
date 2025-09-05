/* global WebImporter */
export default function parse(element, { document }) {
  // Always build 3 rows: header, image, text
  const headerRow = ['Hero (hero2)'];

  // Find the first <picture> or <img> in the block
  let imageEl = element.querySelector('picture, img');
  const imageRow = [imageEl ? imageEl : ''];

  // For the text row: collect all heading and paragraph content (grouped in a single cell)
  let textRowContent = [];
  // Find all h1, h2, h3, p in the element (not just in a div)
  const nodes = Array.from(element.querySelectorAll('h1, h2, h3, p'));
  nodes.forEach((node) => {
    if (node.textContent.trim()) {
      textRowContent.push(node.cloneNode(true));
    }
  });
  // Always provide a third row, even if empty
  const textRow = [textRowContent.length ? textRowContent : ''];

  const cells = [headerRow, imageRow, textRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
