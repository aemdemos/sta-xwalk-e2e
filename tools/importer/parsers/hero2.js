/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the hero image and heading
  // The structure is: element > .hero-wrapper > .hero.block > div > div > [content]
  // We want to extract the image (picture/img) and the heading (h1)

  // Find the deepest content container
  let contentDiv = element;
  // Traverse down to the content block
  const heroWrapper = element.querySelector('.hero-wrapper');
  if (heroWrapper) {
    const heroBlock = heroWrapper.querySelector('.hero.block');
    if (heroBlock) {
      // The content is inside heroBlock > div > div
      const outerDiv = heroBlock.querySelector('div');
      if (outerDiv) {
        const innerDiv = outerDiv.querySelector('div');
        if (innerDiv) {
          contentDiv = innerDiv;
        } else {
          contentDiv = outerDiv;
        }
      } else {
        contentDiv = heroBlock;
      }
    } else {
      contentDiv = heroWrapper;
    }
  }

  // Find the image (picture or img)
  let imageEl = null;
  const picture = contentDiv.querySelector('picture');
  if (picture) {
    imageEl = picture;
  } else {
    // Fallback: find img
    const img = contentDiv.querySelector('img');
    if (img) imageEl = img;
  }

  // Find the heading (h1)
  const heading = contentDiv.querySelector('h1');

  // Compose the table rows
  const headerRow = ['Hero (hero2)'];
  const imageRow = [imageEl ? imageEl : ''];

  // Compose the text row
  const textContent = [];
  if (heading) textContent.push(heading);

  // If there are additional subheadings or CTA, include them
  // For this example, there is only h1 and no CTA or subheading

  const textRow = [textContent.length ? textContent : ''];

  // Build the table
  const cells = [
    headerRow,
    imageRow,
    textRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
