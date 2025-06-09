/* global WebImporter */
export default function parse(element, { document }) {
  // The table must have the URL in the single cell of the second row.
  const url = 'https://vimeo.com/454418448';
  const link = document.createElement('a');
  link.href = url;
  link.textContent = url;
  const cells = [
    ['Embed (embedVideo1)'],
    [link]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}