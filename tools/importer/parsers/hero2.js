/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the hero image and heading
  // The structure is: element > .hero-wrapper > .hero.block > div > div > [content]
  // We'll reference the deepest content div

  // Find the hero-wrapper
  const wrapper = element.querySelector('.hero-wrapper');
  if (!wrapper) return;

  // Find the hero block
  const heroBlock = wrapper.querySelector('.hero.block');
  if (!heroBlock) return;

  // Find the innermost content div
  let contentDiv = heroBlock;
  // Defensive: descend two levels of divs
  for (let i = 0; i < 2; i++) {
    const nextDiv = contentDiv.querySelector(':scope > div');
    if (!nextDiv) break;
    contentDiv = nextDiv;
  }

  // Find the image (picture or img)
  let imageEl = null;
  // Look for <picture> inside a <p>
  const pictureP = contentDiv.querySelector('p picture');
  if (pictureP) {
    imageEl = pictureP.parentElement; // Use the <p> containing <picture>
  } else {
    // Fallback: look for <img> directly
    const img = contentDiv.querySelector('img');
    if (img) imageEl = img;
  }

  // Find the heading (h1, h2, etc.)
  let headingEl = null;
  // Prefer h1, fallback to h2/h3
  headingEl = contentDiv.querySelector('h1, h2, h3');

  // Compose table rows
  const headerRow = ['Hero (hero2)'];
  const imageRow = [imageEl ? imageEl : ''];
  // Compose text row: heading (and any other text)
  const textContent = [];
  if (headingEl) textContent.push(headingEl);
  // Optionally, include other paragraphs (excluding the image paragraph)
  const paragraphs = Array.from(contentDiv.querySelectorAll('p'));
  paragraphs.forEach(p => {
    // Skip the paragraph containing the image
    if (imageEl && p === imageEl) return;
    // Skip empty paragraphs
    if (!p.textContent.trim()) return;
    // Avoid duplicating heading text
    if (headingEl && p.contains(headingEl)) return;
    textContent.push(p);
  });
  const textRow = [textContent.length ? textContent : ''];

  // Build table
  const cells = [headerRow, imageRow, textRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
