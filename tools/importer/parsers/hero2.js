/* global WebImporter */
export default function parse(element, { document }) {
  // Get the hero block
  let heroBlock = element.querySelector('.hero.block');
  if (!heroBlock) heroBlock = element;

  // Get the inner content wrapper (usually a div > div)
  let innerWrap = heroBlock.querySelector('div > div');
  if (!innerWrap) innerWrap = heroBlock;

  // Find the <picture> element for the background image
  const picture = innerWrap.querySelector('picture');
  // Prepare image row
  const imageRow = [picture ? picture : ''];

  // Gather rich content: headings and non-empty paragraphs AFTER the image
  let richContent = [];
  let foundPicture = false;
  innerWrap.childNodes.forEach((node) => {
    // Only process elements
    if (node.nodeType === 1) {
      // If this node is or contains the picture, set flag then skip
      if (!foundPicture && (node === picture || (node.contains && node.contains(picture)))) {
        foundPicture = true;
        return;
      }
      // After picture, collect headings and non-empty paragraphs
      if (foundPicture) {
        if (/^H[1-6]$/.test(node.tagName)) {
          richContent.push(node);
        } else if (node.tagName === 'P' && node.textContent.trim().length > 0) {
          richContent.push(node);
        }
        // Could add CTA detection here if needed
      }
    }
  });
  // If nothing captured, fallback: try to find any heading
  if (richContent.length === 0) {
    const heading = innerWrap.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) richContent.push(heading);
  }

  const rows = [
    ['Hero'], // header row, exactly as specified
    imageRow, // image row
    [richContent.length === 1 ? richContent[0] : richContent] // rich content row
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element with the block table
  element.replaceWith(table);
}
