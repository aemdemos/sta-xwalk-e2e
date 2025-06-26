/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main hero block inside the container
  const heroBlock = element.querySelector('.hero.block');
  let image = '';
  let heading = '';

  if (heroBlock) {
    // Look for the deepest div (where picture/img and headings are)
    const blockContent = heroBlock.querySelector('div > div');
    if (blockContent) {
      // Find first img for the background image
      const pic = blockContent.querySelector('picture');
      if (pic) {
        const img = pic.querySelector('img');
        if (img) image = img;
      }
      // Find first h1 for the heading/title
      const h1 = blockContent.querySelector('h1');
      if (h1) heading = h1;
    }
  }

  const cells = [
    ['Hero'],
    [image || ''],
    [heading || '']
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
