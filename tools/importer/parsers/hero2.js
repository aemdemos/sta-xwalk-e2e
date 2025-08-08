/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero image and hero text
  // The structure is:
  // .section.hero-container > .hero-wrapper > .hero.block > div > div
  // That inner div contains the block content
  const heroWrapper = element.querySelector('.hero-wrapper');
  const heroBlock = heroWrapper && heroWrapper.querySelector('.hero.block');
  let blockContentDiv = null;
  if (heroBlock) {
    // Find deepest div (usually 2 levels)
    const divs = heroBlock.querySelectorAll('div');
    blockContentDiv = divs.length ? divs[divs.length - 1] : heroBlock;
  }
  // Defensive: fallback to element if not found
  const contentRoot = blockContentDiv || element;

  // Get immediate children of contentRoot
  const children = Array.from(contentRoot.children);

  // Extract picture/img for row 2 (Background Image)
  let imageEl = null;
  for (const child of children) {
    // If <p> contains <picture> or <img>
    if (
      child.tagName === 'P' &&
      (child.querySelector('picture') || child.querySelector('img'))
    ) {
      imageEl = child.querySelector('picture') || child.querySelector('img');
      break;
    } else if (child.tagName === 'PICTURE' || child.tagName === 'IMG') {
      imageEl = child;
      break;
    }
  }

  // Extract all text (header, subheader, paragraph, cta) for row 3
  // We'll include all children that are not picture/img, skipping empty <p> as well
  let textEls = [];
  for (const child of children) {
    // skip if image
    if (imageEl && (child.contains(imageEl) || child === imageEl)) continue;
    // skip if empty paragraph
    if (child.tagName === 'P' && child.textContent.trim() === '') continue;
    if (child.textContent.trim()) textEls.push(child);
  }

  // Fallback: if no text found and imageEl is not first child, try all headings in contentRoot
  if (textEls.length === 0) {
    const headings = contentRoot.querySelectorAll('h1, h2, h3, h4, h5, h6, p');
    for (const h of headings) {
      if (h.textContent.trim()) textEls.push(h);
    }
  }

  // Compose table
  const cells = [
    ['Hero'],
    [imageEl ? imageEl : ''],
    [textEls.length ? textEls : '']
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
