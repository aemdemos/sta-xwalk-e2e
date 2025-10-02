/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: find first descendant <img>
  function findFirstImg(el) {
    return el.querySelector('img');
  }
  // Helper: find first descendant heading (h1/h2/h3)
  function findFirstHeading(el) {
    return el.querySelector('h1, h2, h3');
  }
  // Helper: find subheading (first <p> after heading)
  function findSubheading(el, heading) {
    if (!heading) return null;
    let next = heading.nextElementSibling;
    while (next) {
      if (next.tagName === 'P' && next.textContent.trim()) {
        return next;
      }
      next = next.nextElementSibling;
    }
    return null;
  }

  // Defensive: find the deepest content div
  let contentDiv = element;
  while (
    contentDiv &&
    contentDiv.children.length === 1 &&
    contentDiv.firstElementChild.tagName === 'DIV'
  ) {
    contentDiv = contentDiv.firstElementChild;
  }

  // Find the image (background)
  const img = findFirstImg(contentDiv);

  // Find the heading
  const heading = findFirstHeading(contentDiv);

  // Find subheading (optional)
  const subheading = findSubheading(contentDiv, heading);

  // Find CTA (optional: a link)
  let cta = null;
  const link = contentDiv.querySelector('a');
  if (link) {
    cta = link;
  }

  // Compose the third row cell
  const thirdRowItems = [];
  if (heading) thirdRowItems.push(heading);
  if (subheading) thirdRowItems.push(subheading);
  if (cta) thirdRowItems.push(cta);

  // Compose table rows
  const headerRow = ['Hero (hero2)'];
  const imageRow = [img ? img : ''];
  const contentRow = [thirdRowItems.length ? thirdRowItems : ''];

  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
