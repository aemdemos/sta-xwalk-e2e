/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero block in the given element
  let block = element.querySelector('.hero.block');
  if (!block) {
    block = element.querySelector('[data-block-name="hero"]');
  }
  if (!block) return;

  // Drill down to the deepest content wrapper (div > div > ...)
  let content = block;
  while (content && content.children.length === 1 && content.firstElementChild.tagName === 'DIV') {
    content = content.firstElementChild;
  }

  const children = Array.from(content.children);
  let imageCell = null;
  let textContent = [];

  children.forEach(child => {
    // Check if this is a <p> containing an image (inside <picture> or <img>)
    const pic = child.querySelector && child.querySelector('picture');
    const img = child.querySelector && child.querySelector('img');
    if (!imageCell && child.tagName === 'P' && (pic || img)) {
      // Reference the <p> containing the image (for alt, layout, etc.)
      imageCell = child;
    } else {
      // If element is not empty, add to text content
      if (child.textContent && child.textContent.trim().length > 0) {
        textContent.push(child);
      }
    }
  });

  // Ensure we always have a 3-row, 1-column table: header, image, text
  const rows = [
    ['Hero'],
    [imageCell],
    [textContent],
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
