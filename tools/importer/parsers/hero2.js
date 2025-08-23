/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the hero block (handle variations)
  let heroBlock = element.querySelector('.hero.block');
  if (!heroBlock) heroBlock = element;

  // 2. Find the deepest content div (usually contains the image and headings)
  let contentDiv = heroBlock;
  // Go one level deeper if possible
  if (heroBlock.children.length === 1 && heroBlock.firstElementChild.tagName === 'DIV') {
    contentDiv = heroBlock.firstElementChild;
  }
  // Go even deeper if the structure has one child again
  if (contentDiv.children.length === 1 && contentDiv.firstElementChild.tagName === 'DIV') {
    contentDiv = contentDiv.firstElementChild;
  }

  // 3. Find the <picture> and <img> for the background image (if present)
  let imageEl = null;
  let pictureEl = null;
  let foundPicture = false;
  for (const node of contentDiv.children) {
    if (!foundPicture && node.querySelector && node.querySelector('picture')) {
      pictureEl = node.querySelector('picture');
      imageEl = pictureEl ? pictureEl.querySelector('img') : null;
      foundPicture = true;
    }
  }
  // Fallback: search directly for the picture in the contentDiv
  if (!imageEl) {
    pictureEl = contentDiv.querySelector('picture');
    imageEl = pictureEl ? pictureEl.querySelector('img') : null;
  }

  // 4. Collect all heading/subheading/CTA elements after the image
  const textEls = [];
  let startCollect = false;
  for (const node of contentDiv.childNodes) {
    // Skip picture and its parent p
    if (!startCollect && node.nodeType === 1 && node.querySelector && node.querySelector('picture')) {
      startCollect = true;
      continue;
    }
    if (!startCollect) continue;
    // Only keep elements with real text
    if (node.nodeType === 1 && (node.tagName.startsWith('H') || node.tagName === 'P')) {
      if (node.textContent.trim().length > 0) {
        textEls.push(node);
      }
    }
  }
  // Fallback: if nothing found, just get all h1/h2/h3/p in contentDiv
  if (textEls.length === 0) {
    Array.from(contentDiv.children).forEach((node) => {
      if (node.tagName && (node.tagName.startsWith('H') || node.tagName === 'P')) {
        if (node.textContent.trim().length > 0) {
          textEls.push(node);
        }
      }
    });
  }

  // 5. Compose table rows
  const rows = [];
  rows.push(['Hero']); // header ALWAYS 'Hero'
  rows.push([imageEl ? imageEl : '']);
  rows.push([textEls.length === 1 ? textEls[0] : textEls.length > 1 ? textEls : '']);

  // 6. Create and replace
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(blockTable);
}