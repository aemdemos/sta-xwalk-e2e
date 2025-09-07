/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the image block
  let imageEl = null;
  const imageWrapper = Array.from(element.querySelectorAll(':scope > div .cmp-teaser__image, :scope > div .cmp-image'))[0];
  if (imageWrapper) {
    imageEl = imageWrapper.querySelector('img');
  }
  // Defensive: Find the content block
  let contentEls = [];
  const contentWrapper = Array.from(element.querySelectorAll(':scope > div .cmp-teaser__content'))[0];
  if (contentWrapper) {
    // Get all headings and paragraphs inside content
    contentEls = Array.from(contentWrapper.children).map((child) => {
      // If child is a div (like description), flatten its children
      if (child.tagName === 'DIV') {
        return Array.from(child.childNodes).filter(
          (node) => node.nodeType === 1 // element nodes only
        );
      }
      return child;
    }).flat();
  }
  // Table header
  const headerRow = ['Hero (hero26)'];
  // Table rows
  const imageRow = [imageEl ? imageEl : ''];
  // Combine all content elements into one cell
  const contentRow = [contentEls.length ? contentEls : ''];
  // Build table
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace original element
  element.replaceWith(block);
}
