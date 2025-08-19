/* global WebImporter */
export default function parse(element, { document }) {
  // Find the actual content container within the hero block
  const heroBlock = element.querySelector('.hero.block');
  let contentDiv = null;
  if (heroBlock) {
    // Look for common nested content (div > div)
    const nested = heroBlock.querySelectorAll(':scope > div > div');
    contentDiv = nested.length ? nested[0] : heroBlock.querySelector(':scope > div') || heroBlock;
  } else {
    contentDiv = element;
  }

  // Find image (picture or img)
  let imageEl = null;
  const picture = contentDiv.querySelector('picture');
  if (picture) {
    imageEl = picture;
  } else {
    const img = contentDiv.querySelector('img');
    if (img) imageEl = img;
  }

  // Find headline (first h1)
  const headline = contentDiv.querySelector('h1');

  // Collect all rich text after h1 (subheading, paragraphs, CTAs), if any
  const textElements = [];
  if (headline) {
    textElements.push(headline);
    let el = headline.nextElementSibling;
    while (el) {
      if ([
        'H2','H3','H4','H5','H6','P','A','STRONG','B','EM','I','SPAN','UL','OL','LI'].includes(el.tagName)
      ) {
        textElements.push(el);
      }
      el = el.nextElementSibling;
    }
  }

  // Defensive: If no headline, collect all reasonable text elements
  if (!headline) {
    contentDiv.querySelectorAll(':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6, :scope > p, :scope > a').forEach(el => {
      textElements.push(el);
    });
  }

  // Build the block table, matching markdown reference: 1 col, 3 rows
  const cells = [
    ['Hero'],
    [imageEl ? imageEl : ''],
    [textElements.length ? textElements : ''],
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
