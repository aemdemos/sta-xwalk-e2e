/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest content div (the one with picture and heading)
  let contentDiv = element;
  while (contentDiv && contentDiv.children.length === 1 && contentDiv.firstElementChild) {
    contentDiv = contentDiv.firstElementChild;
    // Stop if there are no further child divs
    if (!contentDiv.querySelector(':scope > div')) break;
  }

  // Now, look for the picture (image) and heading(s)
  let picture = null;
  let heading = null;
  if (contentDiv) {
    picture = contentDiv.querySelector('picture');
    heading = contentDiv.querySelector('h1, h2, h3, h4, h5, h6');
  }

  // Build the rows: header, image row, content row
  // If elements are not found, use an empty string
  const rows = [
    ['Hero'],
    [picture ? picture : ''],
    [heading ? heading : '']
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
