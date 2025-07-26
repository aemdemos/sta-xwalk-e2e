/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the hero-wrapper or hero block within the section
  let heroBlock = element.querySelector('.hero.block');
  if (!heroBlock) heroBlock = element;

  // 2. Find the first <picture> (or <img> if no <picture>) for background image
  let imageEl = null;
  const picture = heroBlock.querySelector('picture');
  if (picture) {
    imageEl = picture;
  } else {
    const img = heroBlock.querySelector('img');
    if (img) imageEl = img;
  }

  // 3. Find the main heading (h1-h6) for the title
  let titleEl = null;
  for (let i = 1; i <= 6; i++) {
    const h = heroBlock.querySelector('h' + i);
    if (h) {
      titleEl = h;
      break;
    }
  }

  // 4. Find subheading and CTA (not present in this example, but look for robustness)
  // We'll collect all nodes between the heading and the end of heroBlock, except for the image
  const contentEls = [];
  if (titleEl) {
    let current = titleEl.nextSibling;
    while (current) {
      if (current.nodeType === 1) {
        // skip if just whitespace or empty, or if it's a picture/img
        if (!['PICTURE', 'IMG'].includes(current.tagName) && current.textContent.trim() !== '') {
          contentEls.push(current);
        }
      }
      current = current.nextSibling;
    }
  } else {
    // If no title, look for any p tags as fallback for content row
    const ps = heroBlock.querySelectorAll('p');
    ps.forEach(p => {
      if (p.textContent.trim() !== '') contentEls.push(p);
    });
  }

  // 5. Compose the rows for the block table
  const rows = [
    ['Hero'],
    [imageEl ? imageEl : ''],
    [titleEl ? (contentEls.length ? [titleEl, ...contentEls] : titleEl) : (contentEls.length ? contentEls : '')]
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
