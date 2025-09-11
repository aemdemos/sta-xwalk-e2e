/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero image (picture or img)
  let imageEl = null;
  const picture = element.querySelector('picture');
  if (picture) {
    imageEl = picture;
  } else {
    const img = element.querySelector('img');
    if (img) imageEl = img;
  }

  // Find the content (headings, paragraphs, etc)
  // We'll use the innermost <div>
  let contentDiv = null;
  const innerDivs = element.querySelectorAll('div');
  if (innerDivs.length) {
    contentDiv = innerDivs[innerDivs.length - 1];
  } else {
    contentDiv = element;
  }

  // Remove the <picture> (or <img>) from the clone
  let contentClone = contentDiv.cloneNode(true);
  const picInClone = contentClone.querySelector('picture');
  if (picInClone) {
    picInClone.parentNode.removeChild(picInClone);
  }
  // Remove any empty <p> left behind
  const emptyPs = contentClone.querySelectorAll('p');
  emptyPs.forEach(p => {
    if (!p.textContent.trim() && !p.querySelector('*')) {
      p.parentNode.removeChild(p);
    }
  });

  // Compose the table rows
  const headerRow = ['Hero (hero2)'];
  const imageRow = [imageEl ? imageEl : ''];
  // The third row should always be present, even if empty
  let thirdRowCell = '';
  if (contentClone && contentClone.childNodes.length) {
    // If only whitespace, treat as empty
    const text = contentClone.textContent.trim();
    if (text.length > 0 || contentClone.querySelector('*')) {
      thirdRowCell = Array.from(contentClone.childNodes).filter(n => {
        return n.nodeType !== Node.TEXT_NODE || n.textContent.trim();
      });
      if (thirdRowCell.length === 1) thirdRowCell = thirdRowCell[0];
      if (thirdRowCell.length === 0) thirdRowCell = '';
    }
  }
  const thirdRow = [thirdRowCell];

  // Ensure 3 rows: header, image, content (even if content is empty)
  const cells = [headerRow, imageRow, thirdRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
