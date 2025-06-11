/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero content wrapper
  let heroContent = element.querySelector('.hero.block > div > div');
  if (!heroContent) {
    // fallback: .hero.block > div (if only one level)
    const blockDiv = element.querySelector('.hero.block > div');
    if (blockDiv && blockDiv.children.length === 1 && blockDiv.firstElementChild.tagName === 'DIV') {
      heroContent = blockDiv.firstElementChild;
    } else {
      heroContent = blockDiv;
    }
  }

  // Find the <picture> (image) if present
  let pictureEl = null;
  if (heroContent) {
    pictureEl = heroContent.querySelector('picture');
  }

  // Find the heading (h1-h6)
  let headingEl = null;
  if (heroContent) {
    headingEl = heroContent.querySelector('h1, h2, h3, h4, h5, h6');
  }

  // Compose the table according to the example: header, image (row2), content (row3)
  const table = WebImporter.DOMUtils.createTable([
    ['Hero'],
    [pictureEl ? pictureEl : ''],
    [headingEl ? headingEl : '']
  ], document);

  // Replace element with the new block
  element.replaceWith(table);
}
