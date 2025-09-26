/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the deepest content wrapper
  let contentWrapper = element;
  // Traverse down to the innermost div containing the actual content
  while (
    contentWrapper &&
    contentWrapper.children.length === 1 &&
    contentWrapper.firstElementChild.tagName === 'DIV'
  ) {
    contentWrapper = contentWrapper.firstElementChild;
  }

  // Now, contentWrapper should contain the hero content: image, heading, etc.
  // Get all direct children
  const children = Array.from(contentWrapper.children);

  // Find image (picture inside p)
  let imageEl = null;
  for (const child of children) {
    if (
      child.tagName === 'P' &&
      child.querySelector('picture img')
    ) {
      imageEl = child.querySelector('picture');
      break;
    }
  }

  // Find heading (h1)
  const headingEl = children.find((el) => el.tagName === 'H1');

  // Find subheading (h2, h3, etc.) and CTA (not present in this example)
  // For this HTML, only h1 and image are present

  // Compose rows
  const headerRow = ['Hero (hero2)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [headingEl ? headingEl : ''];

  // Build table
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
