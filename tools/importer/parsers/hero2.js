/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero block
  let heroContent = element.querySelector('.hero-wrapper .hero.block');
  if (!heroContent) heroContent = element;

  // Find the inner content div
  let blockInner = heroContent.querySelector('div > div');
  if (!blockInner) blockInner = heroContent;

  // Find image <p> containing <picture>
  let imageParagraph = null;
  const paragraphs = Array.from(blockInner.querySelectorAll('p'));
  for (const p of paragraphs) {
    if (p.querySelector('picture')) {
      imageParagraph = p;
      break;
    }
  }

  // Find the heading (h1-h6) from blockInner
  let heading = blockInner.querySelector('h1, h2, h3, h4, h5, h6');

  // Compose table rows: header, image, heading
  const tableRows = [
    ['Hero'],
    [imageParagraph || ''],
    [heading || ''],
  ];

  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
