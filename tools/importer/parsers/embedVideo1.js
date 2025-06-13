/* global WebImporter */
export default function parse(element, { document }) {
  // This header navigation block does not contain any video embeds or external images
  // According to the Embed (embedVideo1) block rules, if there is nothing to embed, create a block with just the header and an empty cell
  const headerRow = ['Embed (embedVideo1)'];
  const cells = [
    headerRow,
    ['']
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
