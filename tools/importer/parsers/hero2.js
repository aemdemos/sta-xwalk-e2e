/* global WebImporter */
export default function parse(element, { document }) {
  // Compose the header row for the Hero block
  const headerRow = ['Hero'];

  // The hero image and text will be extracted from the deepest content div found in the block
  // The provided HTML structure is:
  // <div class="section hero-container"> <div class="hero-wrapper"> <div class="hero block"> <div> <div> [content] </div> </div> </div> </div> </div>

  // Locate the deepest content div
  let contentDiv = null;
  let current = element;
  for (let depth = 0; depth < 5; depth++) {
    let nextDiv = current.querySelector(':scope > div');
    if (nextDiv) {
      current = nextDiv;
      contentDiv = current;
    } else {
      break;
    }
  }

  // Find the main image (picture or img) in the first <p>
  let imageCell = null;
  // Try to find a <picture> inside a <p>
  const firstPWithPicture = contentDiv.querySelector('p picture');
  if (firstPWithPicture) {
    imageCell = firstPWithPicture;
  } else {
    // fallback: first <img>
    const img = contentDiv.querySelector('img');
    if (img) imageCell = img;
  }

  // Now gather the text elements following the image
  // We'll collect all heading and paragraph elements, skipping <picture>/<img>
  const children = Array.from(contentDiv.children);
  let foundImage = false;
  const textContent = [];
  for (const child of children) {
    // If the current child contains the image/picture, skip (for text cell)
    if (!foundImage && (child.querySelector('picture') || child.querySelector('img'))) {
      foundImage = true;
      continue;
    }
    // Only include elements with visible text or links
    if (child.textContent.trim() !== '' || child.querySelectorAll('a, button').length) {
      textContent.push(child);
    }
  }
  let textCell;
  if (textContent.length > 0) {
    textCell = textContent;
  } else {
    // If nothing found, use an empty string to preserve the row
    textCell = [''];
  }

  // Compose the table cells array
  const cells = [
    headerRow,          // Header
    [imageCell],        // Image row
    [textCell],         // Text row
  ];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(blockTable);
}
