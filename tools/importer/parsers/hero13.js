/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero teaser block
  const hero = element.querySelector('.teaser.cmp-teaser--hero, .cmp-teaser--hero');
  if (!hero) return;

  // Find the image inside the hero block
  const imageContainer = hero.querySelector('.cmp-teaser__image .cmp-image');
  let imageEl = null;
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }

  // Find the content (heading, subheading, CTA, etc)
  const contentContainer = hero.querySelector('.cmp-teaser__content');
  let contentEls = [];
  if (contentContainer) {
    contentEls = Array.from(contentContainer.children).filter(el => el.textContent.trim().length > 0);
  }

  // Combine all content elements into a single cell for the third row (flatten if only one element)
  let contentCell = '';
  if (contentEls.length === 1) {
    contentCell = contentEls[0].cloneNode(true);
  } else if (contentEls.length > 1) {
    // Create a fragment to hold all content elements
    const fragment = document.createDocumentFragment();
    contentEls.forEach(el => fragment.appendChild(el.cloneNode(true)));
    contentCell = fragment;
  }

  // Build the table rows
  const headerRow = ['Hero (hero13)'];
  const imageRow = [imageEl ? imageEl.cloneNode(true) : ''];
  const contentRow = [contentCell];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow,
  ], document);

  // Replace the original hero element with the new table
  hero.replaceWith(table);
}
