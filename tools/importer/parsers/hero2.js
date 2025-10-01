/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the deepest content container
  // The image and heading are nested inside several divs
  let contentDiv = element;
  // Drill down to the actual content div
  while (contentDiv && contentDiv.children.length === 1 && contentDiv.firstElementChild.tagName === 'DIV') {
    contentDiv = contentDiv.firstElementChild;
  }

  // Now, contentDiv should contain the actual block content
  // Find the image (background)
  let imgEl = null;
  let pictureEl = null;
  const pictures = contentDiv.querySelectorAll('picture');
  if (pictures.length > 0) {
    pictureEl = pictures[0];
    imgEl = pictureEl.querySelector('img');
  }

  // Find the heading (title)
  let headingEl = null;
  const h1 = contentDiv.querySelector('h1');
  if (h1) headingEl = h1;

  // Find subheading and CTA (not present in this example, but support for future)
  // Subheading: look for h2/h3 after h1
  let subheadingEl = null;
  let ctaEl = null;
  // Find all children after h1
  if (headingEl) {
    let next = headingEl.nextElementSibling;
    while (next) {
      if (!subheadingEl && (next.tagName === 'H2' || next.tagName === 'H3')) {
        subheadingEl = next;
      } else if (!ctaEl && next.tagName === 'A') {
        ctaEl = next;
      }
      next = next.nextElementSibling;
    }
  }
  // Also look for CTA in paragraphs
  if (!ctaEl) {
    const links = contentDiv.querySelectorAll('a');
    if (links.length > 0) ctaEl = links[0];
  }

  // Compose table rows
  const headerRow = ['Hero (hero2)'];
  const imageRow = [pictureEl || imgEl || ''];
  const contentRow = [
    [
      ...(headingEl ? [headingEl] : []),
      ...(subheadingEl ? [subheadingEl] : []),
      ...(ctaEl ? [ctaEl] : [])
    ]
  ];

  const cells = [headerRow, imageRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}
