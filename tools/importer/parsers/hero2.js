/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .hero.block element within the section
  const heroBlock = element.querySelector('.hero.block');
  // Find the deepest div containing the content
  let contentContainer = null;
  if (heroBlock) {
    // .hero.block > div > div (from the given HTML structure)
    contentContainer = heroBlock.querySelector('div > div');
  }

  // Fallback if structure changes (be tolerant)
  if (!contentContainer) {
    contentContainer = heroBlock || element;
  }

  // Find the background image (in a <picture> inside a <p>)
  let imageCell = '';
  if (contentContainer) {
    const pictureP = contentContainer.querySelector('p > picture');
    if (pictureP && pictureP.parentElement) {
      imageCell = pictureP.parentElement;
    } else {
      // fallback: any img in content
      const img = contentContainer.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }
  }

  // Find content for the third row: heading and any following content
  let textCellContent = [];
  if (contentContainer) {
    // Find the header element
    const heading = contentContainer.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      textCellContent.push(heading);
    }
    // Find the nodes after the image and heading, if any relevant
    // In the sample HTML, there is an empty <p> after the <h1>
    // We'll include it only if it has real content
    const afterHeading = [];
    let passedHeading = false;
    for (const child of contentContainer.children) {
      if (child === heading) {
        passedHeading = true;
        continue;
      }
      if (passedHeading) {
        // Only include if not empty
        if (child.textContent && child.textContent.trim()) {
          afterHeading.push(child);
        }
      }
    }
    if (afterHeading.length > 0) {
      textCellContent = textCellContent.concat(afterHeading);
    }
  }
  // If we found no heading and no extra content, cell should be empty string
  if (textCellContent.length === 0) {
    textCellContent = [''];
  }

  // Build the block table cells
  const cells = [
    ['Hero'],
    [imageCell],
    [textCellContent],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
