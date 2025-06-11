/* global WebImporter */
export default function parse(element, { document }) {
  // Header row, as per block name
  const headerRow = ['Embed (embedVideo1)'];

  // According to the example, the only relevant content is the embed URL, no image present
  // In this header HTML, there is no video iframe or link to a video. We must output a valid Embed block, but there is no dynamic data in this header, so we leave the content cell empty (edge case handling)

  // However, to match the structure, we'll leave the content cell empty
  const cells = [
    headerRow,
    ['']
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
