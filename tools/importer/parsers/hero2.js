/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the hero image and heading
  // The structure is: div.hero.block > div > div > p (picture), h1, p (empty)
  // We'll reference the image and heading directly

  // Get the deepest content container
  let contentDiv = element;
  // Defensive: traverse down to the actual content if wrapped
  // Find the first child div that contains the image and heading
  while (contentDiv && contentDiv.children.length === 1 && contentDiv.firstElementChild.tagName === 'DIV') {
    contentDiv = contentDiv.firstElementChild;
  }

  // Now, contentDiv should contain the image and heading
  // Find the <picture> (inside a <p>), and the <h1>
  let pictureEl = null;
  let headingEl = null;
  Array.from(contentDiv.children).forEach((child) => {
    // Find <p><picture>
    if (child.tagName === 'P' && child.querySelector('picture')) {
      pictureEl = child.querySelector('picture');
    }
    // Find <h1>
    if (child.tagName === 'H1') {
      headingEl = child;
    }
  });

  // Build the table rows
  const headerRow = ['Hero (hero2)'];
  const imageRow = [pictureEl ? pictureEl : ''];
  // The third row should contain title, subheading, CTA (all in one cell)
  const thirdRowContent = [];
  if (headingEl) thirdRowContent.push(headingEl);
  // If there were other text elements (h2, p, CTA), add here
  const thirdRow = [thirdRowContent.length ? thirdRowContent : ''];

  const cells = [
    headerRow,
    imageRow,
    thirdRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
