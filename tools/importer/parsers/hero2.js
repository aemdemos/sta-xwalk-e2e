/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero block content
  // The hero is deeply nested, but we want to reference existing elements
  let heroContent = element;
  // Try to find the .hero.block (if this is a section wrapper)
  const heroBlock = element.querySelector('.hero.block');
  if (heroBlock) {
    // The relevant content is usually hero.block > div > div
    const contentDiv = heroBlock.querySelector('div > div');
    if (contentDiv) heroContent = contentDiv;
    else heroContent = heroBlock;
  }

  // 1. Find the background image (picture OR img)
  let imageEl = null;
  // Try to find picture first, then fallback to img
  imageEl = heroContent.querySelector('picture');
  if (!imageEl) {
    imageEl = heroContent.querySelector('img');
  }

  // 2. Find all headings and content except images
  // Gather heading(s)
  const textEls = [];
  // Find all headings (there should be one, but generic for robustness)
  heroContent.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
    textEls.push(h);
  });
  // Find all paragraphs that do NOT contain an image or picture, and are not empty
  heroContent.querySelectorAll('p').forEach(p => {
    if (!p.querySelector('picture, img') && p.textContent.trim().length > 0) {
      textEls.push(p);
    }
  });
  // Also handle if the heading is not in a paragraph but present as a direct child

  // Build the rows for the hero table
  const rows = [
    ['Hero'],
    [imageEl ? imageEl : ''],
    [textEls.length ? textEls : '']
  ];

  // Create and replace with the structured hero block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
