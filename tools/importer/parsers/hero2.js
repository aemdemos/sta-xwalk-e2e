/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero image (picture or img)
  let imageEl = element.querySelector('picture') || element.querySelector('img');

  // Find the heading (h1, h2, h3)
  let headingEl = element.querySelector('h1, h2, h3');

  // Compose the table rows
  const headerRow = ['Hero (hero2)'];
  const imageRow = [imageEl ? imageEl : ''];

  // Third row: title, subheading, CTA (all in one cell)
  const contentParts = [];
  if (headingEl) contentParts.push(headingEl);
  // Optionally, look for subheading or CTA (not present in this example)
  // For future-proofing, collect any p or a after the heading
  let next = headingEl ? headingEl.nextElementSibling : null;
  while (next) {
    // Only add non-empty paragraphs or links
    if (next.matches('p') && next.textContent.trim().length > 0) {
      contentParts.push(next);
    }
    if (next.matches('a')) {
      contentParts.push(next);
    }
    next = next.nextElementSibling;
  }
  // If nothing, cell must still exist
  const contentRow = [contentParts.length ? contentParts : ''];

  // Add a fourth row for subheading/CTA if not present, to ensure 3 data rows (header, image, content)
  // But per block description, only 3 rows are needed: header, image, content
  // So this is correct as is

  const cells = [headerRow, imageRow, contentRow];
  // Ensure there are always exactly 3 rows
  while (cells.length < 3) {
    cells.push(['']);
  }
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
