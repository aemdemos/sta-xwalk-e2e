/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero block contents
  const heroWrapper = element.querySelector('.hero-wrapper');
  if (!heroWrapper) return;
  const heroBlock = heroWrapper.querySelector('.hero.block');
  if (!heroBlock) return;
  const heroBlockInner = heroBlock.querySelector('div');
  if (!heroBlockInner) return;

  // Get the first block content div (for content)
  const contentDiv = heroBlockInner;
  // Find the image <picture> (inside a <p>), and keep the p for context
  let imagePara = null;
  const firstPicture = contentDiv.querySelector('picture');
  if (firstPicture) {
    // Use the containing <p> (the closest parent)
    imagePara = firstPicture.closest('p');
  }
  // Get all elements after the image para for text content
  let textContent = [];
  if (imagePara) {
    let sibling = imagePara.nextElementSibling;
    while (sibling) {
      // Only include if not an empty <p> and not just whitespace
      if (sibling.textContent.trim() || sibling.querySelector('a')) {
        textContent.push(sibling);
      }
      sibling = sibling.nextElementSibling;
    }
  }
  // Fallback: If no image, all content is text content
  if (!imagePara) {
    textContent = Array.from(contentDiv.children);
  }

  // Table: [ [Header], [Image], [Text] ]
  const cells = [
    ['Hero'],
    [imagePara],
    [textContent.length > 1 ? textContent : textContent[0]]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
