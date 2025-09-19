/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest content wrapper
  let contentRoot = element;
  while (contentRoot.children.length === 1 && contentRoot.firstElementChild) {
    contentRoot = contentRoot.firstElementChild;
  }

  // Find the background image (picture or img)
  let imageEl = contentRoot.querySelector('picture') || contentRoot.querySelector('img') || '';

  // Collect all heading, subheading, CTA, and paragraph elements (excluding image wrapper)
  const contentEls = [];
  Array.from(contentRoot.children).forEach((child) => {
    // Exclude <p> that only contains <picture>
    if (
      child.tagName.match(/^H[1-6]$/) ||
      (child.tagName === 'P' && !(child.querySelector('picture') && child.childElementCount === 1))
    ) {
      if (child.textContent.trim() !== '' || child.querySelector('a')) {
        contentEls.push(child);
      }
    }
  });

  // Ensure table always has 3 rows: header, image, content
  // If there is no image, imageRow is ['']
  // If there is no content, contentRow is ['']
  const headerRow = ['Hero (hero2)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [contentEls.length ? contentEls : ''];

  // If contentEls is empty, still provide a third row with an empty string
  const tableRows = [headerRow, imageRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
