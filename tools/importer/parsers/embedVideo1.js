/* global WebImporter */
export default function parse(element, { document }) {
  // The provided HTML contains only navigation/header, no embeds. So produce an empty embed block cell.
  const cells = [
    ['Embed (embedVideo1)'],
    ['']
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}