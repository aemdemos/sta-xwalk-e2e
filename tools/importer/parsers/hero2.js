/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero block
  const heroBlock = element.querySelector('.hero.block') || element;

  // Find image (picture or img)
  let imageEl = null;
  const picture = heroBlock.querySelector('picture');
  if (picture) {
    imageEl = picture;
  } else {
    const img = heroBlock.querySelector('img');
    if (img) imageEl = img;
  }

  // Find heading (h1, h2, h3)
  let headingEl = null;
  const heading = heroBlock.querySelector('h1, h2, h3');
  if (heading) headingEl = heading;

  // Find subheading (h2, h3 after heading)
  let subheadingEl = null;
  if (headingEl) {
    let next = headingEl.nextElementSibling;
    while (next) {
      if (/^h[2-6]$/i.test(next.tagName)) {
        subheadingEl = next;
        break;
      }
      next = next.nextElementSibling;
    }
  }

  // Find CTA (a link)
  let ctaEl = null;
  const link = heroBlock.querySelector('a');
  if (link) ctaEl = link;

  // Compose text row: always present, even if empty
  const textContent = [];
  if (headingEl) textContent.push(headingEl);
  if (subheadingEl) textContent.push(subheadingEl);
  if (ctaEl) textContent.push(ctaEl);

  // Table rows
  const headerRow = ['Hero (hero2)'];
  const imageRow = [imageEl ? imageEl : ''];
  // Always include the third row, even if empty
  const textRow = [textContent.length ? textContent : ''];

  // Ensure 3 rows always
  const cells = [headerRow, imageRow, textRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(block);
}
