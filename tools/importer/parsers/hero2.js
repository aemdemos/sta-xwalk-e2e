/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero block
  const heroBlock = element.querySelector('.hero.block') || element;

  // Find the image (picture or img)
  let imageEl = null;
  const picture = heroBlock.querySelector('picture');
  if (picture) {
    imageEl = picture;
  } else {
    const img = heroBlock.querySelector('img');
    if (img) imageEl = img;
  }

  // Gather all text content for the third row: heading, subheading, CTA
  const contentEls = [];
  // Title (h1, h2, h3)
  const heading = heroBlock.querySelector('h1, h2, h3');
  if (heading) contentEls.push(heading);
  // Subheading: any <h2>, <h3>, or non-empty <p> after heading
  if (heading) {
    let sib = heading.nextElementSibling;
    while (sib) {
      if ((sib.tagName === 'H2' || sib.tagName === 'H3' || sib.tagName === 'P') && sib.textContent.trim()) {
        contentEls.push(sib);
      }
      // CTA: look for <a> inside sibling
      const link = sib.querySelector && sib.querySelector('a');
      if (link) {
        contentEls.push(sib);
      }
      sib = sib.nextElementSibling;
    }
  }

  // Compose the table rows
  const headerRow = ['Hero (hero2)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [contentEls.length ? contentEls : ''];

  // Build the table
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
