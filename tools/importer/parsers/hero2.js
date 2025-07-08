/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the hero block
  let heroBlock = element.querySelector('.hero.block');
  if (!heroBlock) heroBlock = element;

  // Drill down to the innermost content div if necessary
  let mainContent = heroBlock;
  while (mainContent && mainContent.children.length === 1 && mainContent.firstElementChild.tagName === 'DIV') {
    mainContent = mainContent.firstElementChild;
  }

  // Gather the background image (picture) if present
  let picture = mainContent.querySelector('picture');
  if (picture && picture.parentElement.tagName === 'P') {
    // Use the <picture>'s parent <p> to mimic the actual DOM structure, usually for spacing
    picture = picture.parentElement;
  }

  // Gather heading and any content below it
  const contentFragments = [];
  // Find the first heading element in the block (h1-h6)
  const heading = mainContent.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) {
    contentFragments.push(heading);
    // Also include all siblings after the heading (including empty paragraphs, CTAs, etc)
    let current = heading.nextElementSibling;
    while (current) {
      contentFragments.push(current);
      current = current.nextElementSibling;
    }
  }

  // If no heading was found, but there are child elements, include them all as content
  if (!heading) {
    Array.from(mainContent.children).forEach(child => {
      contentFragments.push(child);
    });
  }

  // Table rows
  const headerRow = ['Hero'];
  const imageRow = [picture || ''];
  const contentRow = [contentFragments.length ? contentFragments : ''];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
