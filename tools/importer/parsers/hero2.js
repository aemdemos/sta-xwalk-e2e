/* global WebImporter */
export default function parse(element, { document }) {
  // The block header: matches example and spec
  const headerRow = ['Hero'];

  // Drill down to the innermost actual block content
  // The HTML structure:
  // <div class="section hero-container">
  //   <div class="hero-wrapper">
  //     <div class="hero block">
  //       <div>
  //         <div>
  //           ...
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // </div>

  let contentDiv = element;
  while (
    contentDiv &&
    contentDiv.children.length === 1 &&
    contentDiv.firstElementChild.tagName === 'DIV'
  ) {
    contentDiv = contentDiv.firstElementChild;
  }

  // Now contentDiv contains the actual Hero content: <p><picture>...</picture></p><h1>...</h1> etc

  // Row 2: background image (first <picture> or <img> in a <p>)
  let imageCell = '';
  let usedImageP = null;
  const allParagraphs = Array.from(contentDiv.querySelectorAll('p'));
  for (const p of allParagraphs) {
    const pic = p.querySelector('picture');
    if (pic) {
      imageCell = p;
      usedImageP = p;
      break;
    }
  }
  if (!imageCell) {
    // Fallback: check for a bare image
    const img = contentDiv.querySelector('img');
    if (img) imageCell = img;
  }

  // Row 3: title, subheading, CTA, etc — all other content except usedImageP & empty <p>
  const contentCell = [];
  Array.from(contentDiv.children).forEach((child) => {
    // Skip the <p> used for the image
    if (usedImageP && child === usedImageP) return;
    // Skip empty <p> (no text, no image)
    if (child.tagName === 'P' && child.textContent.trim() === '' && !child.querySelector('img,picture')) return;
    contentCell.push(child);
  });

  // Only reference existing elements; do not clone or create new ones
  // Compose the table as a 3-row, 1-column array
  const cells = [
    headerRow,
    [imageCell],
    [contentCell]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
