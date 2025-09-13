/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest content container
  let contentDiv = element;
  const heroWrapper = element.querySelector('.hero-wrapper');
  if (heroWrapper) {
    const heroBlock = heroWrapper.querySelector('.hero.block');
    if (heroBlock) {
      const innerDiv = heroBlock.querySelector('div > div');
      if (innerDiv) {
        contentDiv = innerDiv;
      }
    }
  }

  // Find the image (picture or img)
  const heroImg = contentDiv.querySelector('picture') || contentDiv.querySelector('img');

  // Find the heading (h1)
  const heroHeading = contentDiv.querySelector('h1');
  // Find subheading (h2, h3, p) and CTA (a)
  const subheading = contentDiv.querySelector('h2, h3');
  const cta = contentDiv.querySelector('a');

  // Compose text row: title, subheading, CTA (all in one cell)
  const textCell = [];
  if (heroHeading) textCell.push(heroHeading);
  if (subheading) textCell.push(subheading);
  if (cta) textCell.push(cta);

  // Build table rows
  const headerRow = ['Hero (hero2)'];
  const imageRow = [heroImg ? heroImg : ''];
  const textRow = [textCell.length ? textCell : ''];

  // Ensure there are always 3 rows
  const cells = [headerRow, imageRow, textRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
