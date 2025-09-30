/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest div with content
  let heroContentRoot = element;
  while (
    heroContentRoot &&
    heroContentRoot.children.length === 1 &&
    heroContentRoot.children[0].tagName === 'DIV'
  ) {
    heroContentRoot = heroContentRoot.children[0];
  }

  // Find image (background image)
  let imgEl = null;
  const pTags = Array.from(heroContentRoot.querySelectorAll('p'));
  for (const p of pTags) {
    const picture = p.querySelector('picture');
    if (picture) {
      imgEl = picture;
      break;
    }
  }

  // Find headings and other content
  let headingEls = [];
  let subheadingEls = [];
  let ctaEls = [];

  // Look for h1, h2, h3, etc.
  const headings = heroContentRoot.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headingEls = Array.from(headings);

  // Paragraphs with text (excluding those with picture)
  for (const p of pTags) {
    if (!p.querySelector('picture') && p.textContent.trim().length > 0) {
      subheadingEls.push(p);
    }
  }

  // CTAs (a tags)
  const aTags = heroContentRoot.querySelectorAll('a');
  ctaEls = Array.from(aTags);

  // Always produce 3 rows, even if some are empty
  const headerRow = ['Hero (hero2)'];
  const imageRow = [imgEl ? imgEl : ''];
  // The third row must be a single cell containing all content (heading, subheading, CTA)
  const contentCell = [...headingEls, ...subheadingEls, ...ctaEls];
  const contentRow = [contentCell.length ? contentCell : ''];

  const tableCells = [
    headerRow,
    imageRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
