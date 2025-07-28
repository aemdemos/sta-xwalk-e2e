/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero block inside the section
  const heroBlock = element.querySelector('.hero.block');
  let image = null;
  let title = null;
  let extra = [];

  if (heroBlock) {
    // Find the first <picture> in the hero block, for the image
    const picture = heroBlock.querySelector('picture');
    if (picture) {
      image = picture;
    }
    // Find the first heading (from h1 to h6)
    const heading = heroBlock.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      title = heading;
    }
    // Collect subheading/paragraphs after heading (skip empty)
    if (heading) {
      let node = heading.nextElementSibling;
      while (node) {
        if (node.tagName === 'P' && node.textContent.trim().length > 0) {
          extra.push(node);
        }
        node = node.nextElementSibling;
      }
    }
  }

  // Prepare the table structure
  const rows = [];
  rows.push(['Hero']); // Header row, static as per specification
  rows.push([image || '']); // Image row, empty string if no image

  // Combine title and any extra content as per block spec
  const textContent = [];
  if (title) textContent.push(title);
  if (extra.length) textContent.push(...extra);
  rows.push([textContent.length === 1 ? textContent[0] : textContent.length ? textContent : '']);

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
