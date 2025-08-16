/* global WebImporter */
export default function parse(element, { document }) {
  // Find relevant content container
  let heroContent = element.querySelector('.hero-wrapper');
  if (!heroContent) heroContent = element.querySelector('.hero.block');
  if (!heroContent) heroContent = element;

  // Drill down to inner content div if structure exists
  let contentDiv = heroContent;
  if (heroContent.classList.contains('hero-wrapper')) {
    const block = heroContent.querySelector('.hero.block');
    if (block && block.firstElementChild && block.firstElementChild.firstElementChild) {
      contentDiv = block.firstElementChild.firstElementChild;
    }
  } else if (heroContent.classList.contains('hero')) {
    if (heroContent.firstElementChild && heroContent.firstElementChild.firstElementChild) {
      contentDiv = heroContent.firstElementChild.firstElementChild;
    }
  }

  // Find image (background)
  let backgroundImage = null;
  let pictureParent = null;
  const picture = contentDiv.querySelector('picture');
  if (picture) {
    // Use the immediate parent of picture (usually <p>) for correct referencing
    if (picture.parentElement && picture.parentElement.tagName === 'P') {
      backgroundImage = picture.parentElement;
    } else {
      backgroundImage = picture;
    }
  }

  // Gather non-image content
  const contentNodes = [];
  Array.from(contentDiv.children).forEach((child) => {
    // Skip the background image node
    if (backgroundImage && child === backgroundImage) return;
    // Skip empty paragraphs
    if (child.tagName === 'P' && child.textContent.trim() === '') return;
    contentNodes.push(child);
  });

  // Construct table cells
  const cells = [
    ['Hero'],
    [backgroundImage || ''],
    [contentNodes.length === 1 ? contentNodes[0] : contentNodes],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
