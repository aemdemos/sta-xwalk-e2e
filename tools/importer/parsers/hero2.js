/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero block
  const heroBlock = element.querySelector('.hero.block');
  if (!heroBlock) return;
  // The relevant content is inside .hero.block > div > div
  let contentRoot = heroBlock.querySelector('div > div');
  if (!contentRoot) contentRoot = heroBlock;

  // IMAGE: find the <picture> or <img>
  let imageEl = null;
  const picture = contentRoot.querySelector('picture');
  if (picture) {
    imageEl = picture;
  } else {
    const img = contentRoot.querySelector('img');
    if (img) {
      // Wrap in <picture> if necessary for consistency
      const pic = document.createElement('picture');
      pic.appendChild(img);
      imageEl = pic;
    }
  }

  // CONTENT: gather heading(s) and non-empty <p> not containing the picture
  const contentNodes = [];
  for (const node of contentRoot.childNodes) {
    if (node.nodeType === 1) {
      const tag = node.tagName.toLowerCase();
      if (tag === 'p') {
        if (node.querySelector('picture, img')) continue;
        if (node.textContent.trim() === '') continue;
        contentNodes.push(node);
      } else if (/^h[1-6]$/.test(tag)) {
        contentNodes.push(node);
      }
    }
  }

  // Compose the table as per the example: 3 rows, 1 column
  const cells = [
    ['Hero'],
    [imageEl || ''],
    [contentNodes.length ? contentNodes : '']
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
