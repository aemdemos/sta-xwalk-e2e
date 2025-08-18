/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest hero block (with .hero.block)
  let heroBlock = element.querySelector('.hero.block');
  if (!heroBlock && element.classList.contains('hero')) heroBlock = element;
  if (!heroBlock) {
    // fallback: look for first child div
    heroBlock = element.querySelector(':scope > div');
  }

  // Find the deepest single-child div structure inside heroBlock
  let inner = heroBlock;
  while (inner && inner.children.length === 1 && inner.firstElementChild.tagName === 'DIV') {
    inner = inner.firstElementChild;
  }

  // Now gather content: expect first <picture> or <img> (background image), then headings/text
  let imgEl = null;
  let headingEl = null;
  let restContent = [];

  const children = Array.from(inner.children);
  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    // Background image: look for <picture> or <img> (usually wrapped in <p>)
    if (!imgEl) {
      const pic = node.querySelector && node.querySelector('picture');
      if (pic) {
        imgEl = pic;
        continue;
      }
      const img = node.querySelector && node.querySelector('img');
      if (img) {
        imgEl = img;
        continue;
      }
    }
    // Look for heading. Only take the first one for hero headline.
    if (!headingEl) {
      if (/^H[1-6]$/.test(node.tagName)) {
        headingEl = node;
        continue;
      }
      const heading = node.querySelector && node.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        headingEl = heading;
        continue;
      }
    }
    // After finding heading, any further non-empty content is subheading or CTA
    if (headingEl) {
      if (node !== headingEl && node.textContent.trim().length > 0) {
        restContent.push(node);
      }
    }
  }

  // Compose the content cell: heading + rest (subheading, CTA, etc)
  let textCell = [];
  if (headingEl) textCell.push(headingEl);
  if (restContent.length) textCell = textCell.concat(restContent);

  // Hero block: 1 column, 3 rows: header, image, text
  const cells = [
    ['Hero'],
    [imgEl ? imgEl : ''],
    [textCell.length ? textCell : ''],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
