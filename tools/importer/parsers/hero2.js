/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero image (the <picture> and its <img>)
  let imageEl = null;
  // Find the first <picture> in the element
  const picture = element.querySelector('picture');
  if (picture) {
    imageEl = picture;
  } else {
    // fallback: look for an <img> directly if no <picture>
    const img = element.querySelector('img');
    if (img) imageEl = img;
  }

  // Find the text content (title, subheading, CTA, etc.)
  // The text is usually grouped near the image in the same parent
  let textNodes = [];
  // Look for a heading (h1-h6) first
  let heading = element.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) {
    // Get the parent that contains the heading (and maybe other text)
    let container = heading.parentElement;
    // If the parent is a <div>, collect all its child nodes except the hero image
    if (container && container.nodeName === 'DIV') {
      textNodes = Array.from(container.childNodes).filter((node) => {
        // Exclude <picture> and empty <p>
        if (node.nodeType === 1) { // element
          const tn = node.tagName.toLowerCase();
          if (tn === 'picture') return false;
          if (tn === 'p' && node.textContent.trim() === '') return false;
          return true;
        }
        // Exclude whitespace text nodes
        if (node.nodeType === 3) {
          return node.textContent.trim().length > 0;
        }
        return false;
      });
    } else {
      // If not wrapped, just include the heading
      textNodes = [heading];
    }
  }

  // Assemble the table rows
  const cells = [
    ['Hero'],
    [imageEl ? imageEl : ''],
    [textNodes.length > 0 ? textNodes : ''],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
