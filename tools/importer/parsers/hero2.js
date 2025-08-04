/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero block root (resilient to section wrappers)
  let heroBlock = element.querySelector('.hero.block');
  if (!heroBlock) heroBlock = element;

  // Find the background image: prefer <picture>, else <img>
  let bgImg = null;
  const picture = heroBlock.querySelector('picture');
  if (picture) {
    bgImg = picture;
  } else {
    const img = heroBlock.querySelector('img');
    if (img) bgImg = img;
  }

  // Find the content container (get all text/CTAs)
  // Drill down if nested divs
  let contentRoot = heroBlock;
  while (
    contentRoot.children.length === 1 &&
    contentRoot.firstElementChild.tagName === 'DIV'
  ) {
    contentRoot = contentRoot.firstElementChild;
  }

  // Gather all children except the picture/img (background image)
  const textContent = [];
  for (const child of Array.from(contentRoot.children)) {
    // Skip background image elements
    if (
      child.tagName === 'PICTURE' ||
      (child.tagName === 'P' && child.querySelector('picture')) ||
      child.tagName === 'IMG'
    ) continue;
    // Skip empty paragraphs
    if (child.tagName === 'P' && child.textContent.trim() === '') continue;
    textContent.push(child);
  }
  // Fallback: if nothing, try heroBlock children
  if (textContent.length === 0) {
    for (const child of Array.from(heroBlock.children)) {
      if (
        child.tagName === 'PICTURE' ||
        child.tagName === 'IMG' ||
        (child.tagName === 'P' && child.textContent.trim() === '')
      ) continue;
      textContent.push(child);
    }
  }

  // Build table: 1 col, 3 rows (header, bg, content)
  const cells = [
    ['Hero'],
    [bgImg ? bgImg : ''],
    [textContent.length === 1 ? textContent[0] : textContent]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
