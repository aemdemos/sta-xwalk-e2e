/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .hero.block inside the element
  const heroBlock = element.querySelector('.hero.block');
  let imageEl = null;
  let contentEls = [];
  if (heroBlock) {
    // Look for a picture or img as background image
    const pic = heroBlock.querySelector('picture');
    if (pic) {
      imageEl = pic;
    } else {
      const img = heroBlock.querySelector('img');
      if (img) imageEl = img;
    }
    // Grab the div containing the heading and content
    const innerDiv = heroBlock.querySelector('div > div');
    if (innerDiv) {
      for (const node of innerDiv.children) {
        // skip image (picture)
        if (node.tagName.toLowerCase() === 'picture') continue;
        // skip empty paragraphs
        if (node.tagName.toLowerCase() === 'p' && node.textContent.trim() === '') continue;
        contentEls.push(node);
      }
    }
  }

  // Compose rows: header, image, content
  const rows = [
    ['Hero'],
    [imageEl ? imageEl : ''],
    [contentEls.length > 0 ? contentEls : '']
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
