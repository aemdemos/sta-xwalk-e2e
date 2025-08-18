/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the innermost content block
  let contentContainer = element;
  // It may be nested: .hero-wrapper > .hero.block > div > div
  const nested = element.querySelector('.hero-wrapper .hero.block > div > div')
    || element.querySelector('.hero.block > div > div')
    || element.querySelector('.hero.block > div')
    || element.querySelector('.hero-wrapper')
    || element;
  contentContainer = nested;

  // Find the first <picture> or <img> for background image
  let image = null;
  const picture = contentContainer.querySelector('picture');
  if (picture) {
    image = picture;
  } else {
    const img = contentContainer.querySelector('img');
    if (img) image = img;
  }

  // Find the main heading (usually h1)
  let heading = contentContainer.querySelector('h1, h2, h3');

  // Find subheading (the next heading element after the main heading)
  let subheading = null;
  if (heading) {
    let sib = heading.nextElementSibling;
    while (sib) {
      if (/^H[1-6]$/.test(sib.tagName) && sib !== heading) {
        subheading = sib;
        break;
      }
      sib = sib.nextElementSibling;
    }
  }

  // Find CTA (first <a>)
  let cta = contentContainer.querySelector('a');

  // Collect other relevant rich text (e.g. paragraphs after heading/subheading)
  const textElems = [];
  if (heading) textElems.push(heading);
  if (subheading) textElems.push(subheading);
  // Now find all <p> elements after heading/subheading, excluding empty ones
  let afterElem = subheading || heading;
  if (afterElem) {
    let sib = afterElem.nextElementSibling;
    while (sib) {
      if (sib.tagName === 'P' && sib.textContent.trim()) {
        textElems.push(sib);
      }
      sib = sib.nextElementSibling;
    }
  }
  // Add CTA if not already included
  if (cta && !textElems.includes(cta)) textElems.push(cta);

  // If no heading or text was found, fall back to all content
  if (textElems.length === 0) {
    textElems.push(...contentContainer.childNodes);
  }

  // Build the table: 1 col, 3 rows as described
  const cells = [
    ['Hero'],
    [image ? image : ''],
    [textElems.length === 1 ? textElems[0] : textElems],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
