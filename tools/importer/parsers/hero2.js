/* global WebImporter */
export default function parse(element, { document }) {
  // Get the hero-wrapper, which contains the hero block
  const wrapper = element.querySelector('.hero-wrapper');
  if (!wrapper) return;
  // Get the hero block inside the wrapper
  const block = wrapper.querySelector('.hero.block');
  if (!block) return;
  // The block structure is: .hero.block > div > div
  const outerDiv = block.querySelector('div');
  if (!outerDiv) return;
  const innerDiv = outerDiv.querySelector('div');
  if (!innerDiv) return;

  // The image is inside a <picture> (preferred), inside a <p>
  let bgImg = null;
  const paragraphs = innerDiv.querySelectorAll('p');
  for (const p of paragraphs) {
    const picture = p.querySelector('picture');
    if (picture) {
      bgImg = picture;
      break;
    }
  }

  // The heading/title is the <h1> inside innerDiv (could be h1-h6)
  let title = null;
  for (let i = 1; i <= 6; i++) {
    const heading = innerDiv.querySelector(`h${i}`);
    if (heading) {
      title = heading;
      break;
    }
  }

  // Collect any additional elements after the image and title, if they exist
  // (for this example, there aren't any, but guard for future HTML variations)
  // We'll collect all children of innerDiv, skipping the picture and heading that were already extracted
  const cellsContent = [];
  // Ensure we include the title (h1)
  if (title) cellsContent.push(title);
  // Add additional children that are not the picture or the title, and not empty
  Array.from(innerDiv.children).forEach(child => {
    if (child.contains(bgImg) || child === title) return; // skip image and title already handled
    // Only add non-empty elements
    if (child.textContent && child.textContent.trim()) {
      cellsContent.push(child);
    }
  });

  // Build the block table
  const cells = [
    ['Hero'],
    [bgImg ? bgImg : ''],
    [cellsContent.length > 0 ? cellsContent : ''],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
