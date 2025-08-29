/* global WebImporter */
export default function parse(element, { document }) {
  // Identify the content area, targeting the innermost hero block structure
  let heroBlock = element.querySelector('.hero.block');
  // Fallback to element if not found
  if (!heroBlock) heroBlock = element;

  // The hero block layout is typically a div structure, inspect for main content wrapper
  // Find the deepest div containing the content
  let contentDiv = heroBlock;
  // If heroBlock has only one child div, use it
  const firstLevelDivs = heroBlock.querySelectorAll(':scope > div');
  if (firstLevelDivs.length === 1) {
    contentDiv = firstLevelDivs[0];
  }

  // Find image: look for <picture> or <img> within the relevant content block
  let imageEl = null;
  const picture = contentDiv.querySelector('picture');
  if (picture) {
    imageEl = picture;
  } else {
    const img = contentDiv.querySelector('img');
    if (img) imageEl = img;
  }

  // Find text: headings, subheading, paragraphs, CTA
  // All headings and paragraphs inside contentDiv
  const textElements = [];
  const heading = contentDiv.querySelector('h1, h2, h3');
  if (heading) {
    textElements.push(heading);
    // Find subheading if present (next heading sibling)
    let sibling = heading.nextElementSibling;
    if (sibling && sibling.tagName.match(/^H[2-6]$/)) {
      textElements.push(sibling);
      sibling = sibling.nextElementSibling;
    }
    // Find paragraph if present (after heading or subheading)
    if (sibling && sibling.tagName === 'P' && sibling.textContent.trim().length > 0) {
      textElements.push(sibling);
    }
  } else {
    // If no heading, include first paragraph if present
    const firstParagraph = contentDiv.querySelector('p');
    if (firstParagraph && firstParagraph.textContent.trim().length > 0) {
      textElements.push(firstParagraph);
    }
  }
  // Find CTA link (first <a> in contentDiv)
  const cta = contentDiv.querySelector('a');
  if (cta && !textElements.includes(cta)) {
    textElements.push(cta);
  }

  // Compose the block table according to spec
  const rows = [
    ['Hero (hero2)'],
    [imageEl ? imageEl : ''],
    [textElements.length ? textElements : '']
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
