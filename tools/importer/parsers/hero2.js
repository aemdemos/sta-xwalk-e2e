/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the image (background image)
  let imageEl = null;
  // The image is inside a <picture> inside a <p>
  const picture = element.querySelector('picture');
  if (picture) {
    // Find the <img> inside <picture>
    imageEl = picture.querySelector('img');
  }

  // Defensive: find the heading and any other text content
  // The heading is an <h1> inside the block
  let contentEls = [];
  const h1 = element.querySelector('h1');
  if (h1) {
    contentEls.push(h1);
  }
  // Optionally, add any subheading or CTA if present (none in this example)
  // If there are paragraphs after the h1, include them if they have text
  const paragraphs = Array.from(element.querySelectorAll('p'));
  paragraphs.forEach((p) => {
    // Exclude the <p> that contains the <picture>
    if (!p.contains(picture) && p.textContent.trim().length > 0) {
      contentEls.push(p);
    }
  });

  // Build the table rows
  const headerRow = ['Hero (hero2)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [contentEls.length ? contentEls : ''];

  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
