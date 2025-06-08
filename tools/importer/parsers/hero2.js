/* global WebImporter */
export default function parse(element, { document }) {
  // Find the innermost hero block content
  // Example HTML: .hero-wrapper > .hero.block > div > div
  const container = element.querySelector('.hero-wrapper .hero.block > div > div');

  // Defensive: fallback to .hero.block > div > div if .hero-wrapper is missing
  let contentRoot = container || element.querySelector('.hero.block > div > div') || element;

  // The block header for Hero must be 'Hero', matching the example, no bold tags
  const headerRow = ['Hero'];

  // The background image is the <picture> (preferred) or <img>
  let bgImage = '';
  let pic = contentRoot.querySelector('picture');
  if (pic) {
    bgImage = pic;
  } else {
    // fallback to standalone img
    let img = contentRoot.querySelector('img');
    if (img) {
      bgImage = img;
    } else {
      bgImage = '';
    }
  }

  // The headline is the first <h1>, <h2>, or <h3>
  let heading = '';
  let h = contentRoot.querySelector('h1, h2, h3');
  if (h) {
    heading = h;
  } else {
    heading = '';
  }

  // Final table structure - 1 column, 3 rows, matching the example
  const rows = [
    headerRow,
    [bgImage],
    [heading],
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the new block table
  element.replaceWith(table);
}
