/* global WebImporter */
export default function parse(element, { document }) {
  // Since the input HTML does not contain any video link or embed, we output only the header and an empty cell.
  const headerRow = ['Embed (embedVideo1)'];
  const cells = [
    headerRow,
    ['']
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}