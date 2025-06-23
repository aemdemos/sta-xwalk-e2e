/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero block inner content
  // The structure is: div.section > div.hero-wrapper > div.hero.block > div > div > ...
  let heroContent = element.querySelector('.hero.block');
  if (!heroContent) {
    heroContent = element.querySelector('[data-block-name="hero"]');
  }
  let contentDiv;
  if (heroContent) {
    // Most often, hero.block > div > div contains the content
    const divs = heroContent.querySelectorAll(':scope > div > div');
    contentDiv = divs.length > 0 ? divs[0] : heroContent;
  } else {
    contentDiv = element;
  }

  // Find first picture (image)
  const picture = contentDiv.querySelector('picture');
  let imageCell = '';
  if (picture) {
    // Reference the parent p if present, so we get spacing and possible captions
    imageCell = picture.closest('p') || picture;
  }

  // Gather all content except the image paragraph for the content cell
  // The example has the image in its own row, so the rest go in the next row
  const contentNodes = [];
  Array.from(contentDiv.children).forEach((child) => {
    // Skip if child contains a picture
    if (child.querySelector('picture')) return;
    // Skip empty paragraphs
    if (child.tagName.toLowerCase() === 'p' && !child.textContent.trim()) return;
    contentNodes.push(child);
  });

  // If all content was image, ensure we return an empty string for the content cell
  const contentCell = contentNodes.length ? contentNodes : '';

  // Build table with required structure and header
  const cells = [
    ['Hero'],
    [imageCell],
    [contentCell],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
