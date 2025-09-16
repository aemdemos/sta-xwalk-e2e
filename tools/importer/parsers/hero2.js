/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the hero image and text content
  // The structure is: element > .hero-wrapper > .hero.block > div > div > ...
  // We'll reference the innermost div containing the content
  let contentDiv = element;
  // Traverse down to the actual content block
  // .section.hero-container > .hero-wrapper > .hero.block > div > div
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
    // Fallback: look for img directly
    const img = contentDiv.querySelector('img');
    if (img) imageEl = img;
  }

  // Find the heading (h1, h2, h3, etc)
  let headingEl = null;
  const heading = contentDiv.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) headingEl = heading;

  // Find any subheading or paragraph (optional)
  // We want to include all text content except the image
  const textEls = [];
  if (headingEl) textEls.push(headingEl);
  // Collect all paragraphs that are not inside a picture
  contentDiv.querySelectorAll('p').forEach((p) => {
    // Exclude paragraphs that only contain a picture
    if (!p.querySelector('picture') && p.textContent.trim()) {
      textEls.push(p);
    }
  });

  // Compose the table rows
  const headerRow = ['Hero (hero2)'];
  const imageRow = [imageEl ? imageEl : ''];
  // For the text row, combine all text elements
  const textRow = [textEls.length > 0 ? textEls : ''];

  const cells = [
    headerRow,
    imageRow,
    textRow,
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
