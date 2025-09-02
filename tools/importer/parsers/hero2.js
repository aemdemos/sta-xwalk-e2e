/* global WebImporter */
export default function parse(element, { document }) {
  // The block name as per the example
  const headerRow = ['Hero (hero2)'];

  // The hero structure is .section > .hero-wrapper > .hero.block > div > div > [content]
  let heroInnerDiv = element;
  // Try to get the deepest div containing content
  const heroWrapper = element.querySelector(':scope > .hero-wrapper');
  const heroBlock = heroWrapper ? heroWrapper.querySelector(':scope > .hero.block') : null;
  let contentDiv = null;
  if (heroBlock) {
    // hero.block > div > div
    const firstDiv = heroBlock.querySelector(':scope > div');
    contentDiv = firstDiv ? firstDiv.querySelector(':scope > div') : heroBlock;
  }
  if (!contentDiv) {
    // fallback: try first div with children
    contentDiv = element;
  }

  // Find the image (picture inside p)
  let imageCell = '';
  const pWithPicture = contentDiv.querySelector('p > picture') ? contentDiv.querySelector('p:has(picture)') : null;
  if (pWithPicture) {
    imageCell = pWithPicture;
  }

  // Gather all heading and paragraph elements that are not image wrappers
  // Only direct children, to avoid pulling in too much
  const textEls = [];
  Array.from(contentDiv.children).forEach((child) => {
    // Exclude the picture paragraph (already handled)
    if (child === pWithPicture) return;
    // Accept H1-H6 and P tags
    if (/^H[1-6]$/.test(child.tagName) || child.tagName === 'P') {
      // Only push if not empty
      if (child.textContent.trim().length > 0) {
        textEls.push(child);
      }
    }
  });
  let textCell = '';
  if (textEls.length > 0) {
    textCell = textEls.length === 1 ? textEls[0] : textEls;
  }

  const cells = [
    headerRow,
    [imageCell],
    [textCell],
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
