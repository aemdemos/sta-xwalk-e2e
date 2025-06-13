/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero block's inner content div
  const heroBlock = element.querySelector('.hero.block');
  let image = '';
  let heading = '';

  if (heroBlock) {
    // The structure is: hero.block > div > div > ...
    const contentDiv = heroBlock.querySelector('div > div');
    if (contentDiv) {
      // Find the <picture> (with the image)
      const picture = contentDiv.querySelector('picture');
      if (picture) {
        image = picture;
      }
      // Find the main heading (h1-h6)
      const mainHeading = contentDiv.querySelector('h1, h2, h3, h4, h5, h6');
      if (mainHeading) {
        heading = mainHeading;
      }
    }
  }

  // Build the table: 1 col, 3 rows: header, image, text (heading)
  const rows = [
    ['Hero'],
    [image || ''],
    [heading || ''],
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
