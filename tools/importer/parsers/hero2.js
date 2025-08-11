/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row matches the example: 'Hero'
  const headerRow = ['Hero'];

  // Find the deepest content block containing the hero content
  // The structure is: .section > .hero-wrapper > .hero > ... > [actual content]
  // We'll follow this chain for resilience
  let heroContentDiv = null;
  let current = element;
  // Drill down through hero-wrapper and hero block if present
  if (current.classList.contains('section')) {
    const wrapper = current.querySelector(':scope > .hero-wrapper');
    if (wrapper) {
      const block = wrapper.querySelector(':scope > .hero.block');
      if (block) {
        // Drill into nested divs for actual content
        let contentDiv = block;
        while (contentDiv.children.length === 1 && contentDiv.children[0].tagName === 'DIV') {
          contentDiv = contentDiv.children[0];
        }
        heroContentDiv = contentDiv;
      }
    }
  }
  // Fallback: If not found, use the original element
  if (!heroContentDiv) heroContentDiv = element;

  // Row 2: Background Image (optional)
  // Find the first <picture> in the heroContentDiv, preferred over img
  let pictureElement = null;
  let imgElement = null;
  const firstPicture = heroContentDiv.querySelector('picture');
  if (firstPicture) {
    pictureElement = firstPicture;
  } else {
    // fallback to first <img> if no picture
    imgElement = heroContentDiv.querySelector('img');
  }
  // only add image row if there is an image
  let imageCell = null;
  if (pictureElement) {
    imageCell = pictureElement;
  } else if (imgElement) {
    imageCell = imgElement;
  }

  // Row 3: Text content (title, subheading, paragraph, cta)
  // Find all heading and paragraph elements, but skip the <p> that contains the <picture>
  const textElements = [];
  for (const child of heroContentDiv.children) {
    // If it's a <p> containing a <picture>, skip it
    if (child.tagName === 'P' && child.querySelector('picture')) continue;
    // If it's a heading or a paragraph
    if (/^H[1-6]$/.test(child.tagName) || child.tagName === 'P') {
      textElements.push(child);
    }
  }

  // Create the table rows according to the example: 3 rows, 1 column
  // Only include image/text rows if content exists
  const cells = [
    headerRow,
  ];
  if (imageCell) {
    cells.push([imageCell]);
  }
  // For text, if we have multiple elements, put them all into an array for the cell
  if (textElements.length) {
    cells.push([textElements.length === 1 ? textElements[0] : textElements]);
  }

  // Create the table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table (reference elements, not cloning)
  element.replaceWith(blockTable);
}
