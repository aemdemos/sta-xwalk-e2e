/* global WebImporter */
export default function parse(element, { document }) {
  // This header element does not contain an embed, video, or image for the Embed (embedVideo1) block.
  // Per requirements, we still create the block table with the proper header.
  const cells = [
    ['Embed (embedVideo1)'],
    [''] // Empty cell as there is no embed content in this section
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
