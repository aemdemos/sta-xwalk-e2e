/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero block element (robust to nesting)
  let heroBlock = element.querySelector('.hero.block');
  if (!heroBlock) heroBlock = element;

  // The actual content is often nested inside two divs
  let contentWrapper = heroBlock;
  const candidateDivs = heroBlock.querySelectorAll(':scope > div > div');
  if (candidateDivs.length > 0) {
    contentWrapper = candidateDivs[0];
  }

  // Find image (picture element)
  let picture = contentWrapper.querySelector('picture');

  // Find heading (h1-h6), prefer h1 if available
  let heading = contentWrapper.querySelector('h1, h2, h3, h4, h5, h6');

  // Find all paragraphs other than those containing the image
  // Don't include empty paragraphs
  const allParagraphs = Array.from(contentWrapper.querySelectorAll('p'));
  const otherParagraphs = allParagraphs.filter(p =>
    (!picture || !p.contains(picture)) && p.textContent.trim().length > 0
  );

  // Compose content cell: heading, then paragraphs
  const contentCell = [];
  if (heading) contentCell.push(heading);
  contentCell.push(...otherParagraphs);

  // Table rows
  const headerRow = ['Hero']; // Must exactly match example
  const imageRow = [picture ? picture : ''];
  const contentRow = [contentCell.length > 0 ? contentCell : ''];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
