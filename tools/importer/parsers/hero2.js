/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get the first descendant <img> (for background image)
  function findFirstImage(el) {
    return el.querySelector('img');
  }

  // Helper: get the first heading (h1-h3) as title
  function findFirstHeading(el) {
    return el.querySelector('h1, h2, h3, h4, h5, h6');
  }

  // Helper: get all subheading/paragraphs after the heading
  function getSubheadingAndCTA(el, heading) {
    const result = [];
    let foundHeading = false;
    for (const child of el.querySelectorAll(':scope > *')) {
      if (!foundHeading && child === heading) {
        foundHeading = true;
        continue;
      }
      if (foundHeading) {
        // Only add non-empty paragraphs or subheadings
        if (child.tagName.match(/^H[1-6]$/) || (child.tagName === 'P' && child.textContent.trim())) {
          result.push(child);
        }
      }
    }
    return result;
  }

  // Find the content root (the innermost div with actual content)
  let contentRoot = element;
  while (
    contentRoot.children.length === 1 &&
    contentRoot.firstElementChild &&
    contentRoot.firstElementChild.tagName === 'DIV'
  ) {
    contentRoot = contentRoot.firstElementChild;
  }

  // 1. Header row
  const headerRow = ['Hero (hero2)'];

  // 2. Background image row
  const img = findFirstImage(contentRoot);
  const bgImgRow = [img ? img : ''];

  // 3. Content row (title, subheading, CTA)
  const heading = findFirstHeading(contentRoot);
  const contentArr = [];
  if (heading) contentArr.push(heading);
  const subContent = getSubheadingAndCTA(contentRoot, heading);
  if (subContent.length) contentArr.push(...subContent);
  const contentRow = [contentArr.length ? contentArr : ''];

  // Compose table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgImgRow,
    contentRow,
  ], document);

  // Replace original element
  element.replaceWith(table);
}
