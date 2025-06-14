/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero block content root
  let contentRoot = null;
  const heroBlock = element.querySelector('.hero.block');
  if (heroBlock) {
    const outerDiv = heroBlock.querySelector(':scope > div');
    if (outerDiv) {
      contentRoot = outerDiv.querySelector(':scope > div');
    }
  }
  if (!contentRoot) {
    contentRoot = element;
  }

  // Extract image row (picture inside <p>)
  let imageCell = '';
  const picP = contentRoot.querySelector('p > picture');
  if (picP && picP.parentElement) imageCell = picP.parentElement;

  // Extract only the heading for text row (third row)
  let textCell = '';
  // Try all heading levels, pick the first one found in document order
  const heading = contentRoot.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) {
    textCell = heading;
  }

  // Always produce three rows: header, image, text
  const rows = [
    ['Hero'],
    [imageCell || ''],
    [textCell || '']
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
