/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Create the header row
  const headerRow = ['Hero'];

  // 2. Find the background image (the first <img> inside a <picture>)
  let backgroundImg = '';
  const firstPicture = element.querySelector('picture');
  if (firstPicture) {
    const img = firstPicture.querySelector('img');
    if (img) backgroundImg = img;
  }

  // 3. Gather text content (headings, subheading, cta, etc.)
  // We'll get all h1, h2, h3, and p tags inside the same container as the image, after the image
  // The actual content block is a div containing both the image (in a <p><picture></picture></p>) and the rest of the text
  let textContentElements = [];
  // Find the innermost wrapper containing both the image and the text
  let innerWrapper = null;
  // The structure from the example HTML:
  // <div class="hero block"> -> <div> -> <div> -> ...
  // We'll descend into single-child divs to find the innermost
  let curr = element;
  while (curr && curr.children.length === 1 && curr.firstElementChild.tagName === 'DIV') {
    curr = curr.firstElementChild;
  }
  innerWrapper = curr;

  if (innerWrapper) {
    // Exclude <p> containing only <picture>, include all other h1/h2/h3/p
    Array.from(innerWrapper.children).forEach((child) => {
      if (
        child.tagName === 'H1' ||
        child.tagName === 'H2' ||
        child.tagName === 'H3'
      ) {
        textContentElements.push(child);
      } else if (child.tagName === 'P') {
        // Only include p tags that do not have a picture child
        if (!child.querySelector('picture')) {
          textContentElements.push(child);
        }
      }
    });
  }

  // If nothing found in innerWrapper, fallback to all h1/h2/h3/p in element (excluding <p> with <picture>)
  if (textContentElements.length === 0) {
    element.querySelectorAll('h1,h2,h3,p').forEach((el) => {
      if (el.tagName === 'P' && el.querySelector('picture')) return;
      textContentElements.push(el);
    });
  }

  // 4. Compose the rows
  const imageRow = [backgroundImg ? backgroundImg : ''];
  const textRow = [textContentElements.length > 0 ? textContentElements : ''];

  // 5. Assemble the table
  const cells = [
    headerRow,
    imageRow,
    textRow,
  ];

  // 6. Create the block table and replace the element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
