/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest content container
  let contentContainer = element;
  for (let i = 0; i < 4; i++) {
    const firstDiv = contentContainer.querySelector(':scope > div');
    if (firstDiv) {
      contentContainer = firstDiv;
    }
  }

  // Find the image (background)
  let imageEl = null;
  const pictureP = contentContainer.querySelector('p > picture');
  if (pictureP) {
    imageEl = pictureP.parentElement;
  }

  // Collect all text elements after the image
  let textEls = [];
  if (imageEl) {
    let foundImage = false;
    contentContainer.childNodes.forEach((node) => {
      if (node === imageEl) {
        foundImage = true;
      } else if (foundImage && node.nodeType === 1) {
        textEls.push(node);
      }
    });
  } else {
    textEls = Array.from(contentContainer.children);
  }

  // Compose the table rows
  const headerRow = ['Hero (hero2)'];
  const imageRow = [imageEl ? imageEl : ''];
  // Compose text row: combine all text elements (title, subheading, CTA) into a single cell
  const textRowContent = [];
  textEls.forEach((el) => {
    if (el.tagName === 'P' && el.textContent.trim() === '') return;
    textRowContent.push(el);
  });
  const textRow = [textRowContent.length ? textRowContent : ''];

  // Always ensure 3 rows (header, image, text)
  // Add a third row (for subheading/CTA) even if empty
  const thirdRow = [''];

  const cells = [
    headerRow,
    imageRow,
    textRow,
    thirdRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
