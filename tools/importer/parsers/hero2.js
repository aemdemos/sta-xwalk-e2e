/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest block content
  const divs = element.querySelectorAll(':scope > div');
  let contentDiv = null;
  if (divs.length) {
    let current = divs[0];
    while (current && current.children.length === 1 && current.children[0].tagName === 'DIV') {
      current = current.children[0];
    }
    contentDiv = current;
  } else {
    contentDiv = element;
  }

  // Find <picture> or <img>
  const imageEl = contentDiv.querySelector('picture, img');

  // Find heading (h1)
  const headingEl = contentDiv.querySelector('h1');

  // Find subheading(s): any <h2>, <h3>, <p> after heading
  const subheadingEls = [];
  if (headingEl) {
    let next = headingEl.nextElementSibling;
    while (next) {
      if ((/H2|H3|P/).test(next.tagName) && next.textContent.trim()) {
        subheadingEls.push(next);
      }
      next = next.nextElementSibling;
    }
  }

  // Find CTA: any <a> inside contentDiv
  const ctaEls = Array.from(contentDiv.querySelectorAll('a'));

  // Build table rows
  const headerRow = ['Hero (hero2)'];
  const imageRow = [imageEl ? imageEl : ''];

  // Compose the third row: heading, subheading(s), CTA(s)
  const thirdRowContent = [];
  if (headingEl) thirdRowContent.push(headingEl);
  if (subheadingEls.length) thirdRowContent.push(...subheadingEls);
  if (ctaEls.length) thirdRowContent.push(...ctaEls);
  // Always provide the third row, even if empty
  const thirdRow = [thirdRowContent.length ? thirdRowContent : ''];

  // Compose table
  const cells = [
    headerRow,
    imageRow,
    thirdRow
  ];

  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(blockTable);
}
