/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .hero.block inside the section
  const heroBlock = element.querySelector('.hero.block');
  // Defensive: exit if not found
  if (!heroBlock) return;

  // The hero content is deeply nested: hero.block > div > div
  // We want the innermost div that contains the picture and heading
  let contentDiv = heroBlock;
  // Drill down if there's only one child and it's a div
  while (contentDiv && contentDiv.children.length === 1 && contentDiv.firstElementChild.tagName === 'DIV') {
    contentDiv = contentDiv.firstElementChild;
  }

  // Find the picture (image) for the background row
  const picture = contentDiv.querySelector('picture');
  // Find the heading (title)
  // This is typically the first heading element
  const heading = contentDiv.querySelector('h1, h2, h3, h4, h5, h6');
  // Typically, the structure may allow for optional subheading or CTA here, but in this example, only heading is present

  // Compose the table rows as in the example: header, image, then text content
  const rows = [
    ['Hero (hero2)'],
    [picture ? picture : ''],
    [heading ? heading : ''],
  ];

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
