/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct child with certain selector
  function getDirectChild(parent, selector) {
    return Array.from(parent.children).find(child => child.matches(selector));
  }

  // 1. Find the content container for the hero block
  let heroContent = element.querySelector('.hero.block > div > div');
  if (!heroContent) {
    heroContent = element.querySelector('.hero.block');
  }
  if (!heroContent) {
    heroContent = element;
  }

  // 2. Find the image: first <picture> or <img> in a <p>
  let imageEl = null;
  let imageContainer = null;
  // Look for a <p> that contains a <picture> or <img>
  const imgP = Array.from(heroContent.querySelectorAll('p')).find(p => p.querySelector('picture, img'));
  if (imgP) {
    imageEl = imgP.querySelector('picture, img');
    imageContainer = imgP;
  } else {
    imageEl = heroContent.querySelector('picture, img');
  }

  // 3. Find heading(s), subheading, and CTA (in order)
  // We'll include all headings and paragraphs that are not image containers, preserving order
  let textElements = [];
  Array.from(heroContent.children).forEach(child => {
    // Skip if this is the image container
    if (imageContainer && child === imageContainer) return;
    // Only include if it's a heading or paragraph and has content
    if ((/H[1-6]/.test(child.tagName) || child.tagName === 'P') && child.textContent.trim()) {
      textElements.push(child);
    }
  });

  // Also, check for CTA: any <a> in the textElements
  // (The table structure places all in the same cell, so we simply group them)

  // Defensive: if no textElements, try to get all headings/paragraphs with text (excluding image)
  if (textElements.length === 0) {
    textElements = Array.from(heroContent.querySelectorAll('h1,h2,h3,h4,h5,h6,p'))
      .filter(el => el.textContent.trim() && (!imageContainer || !imageContainer.contains(el)));
  }

  // 4. Build the cells array for the table
  const cells = [
    ['Hero'],
    [imageEl ? imageEl : ''],
    [textElements.length ? textElements : ''],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
