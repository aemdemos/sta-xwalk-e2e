/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a fragment with a field comment and content
  function fieldFragment(fieldName, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    frag.appendChild(content);
    return frag;
  }

  // Find the image (picture or img)
  let imageEl = element.querySelector('picture, img');
  // If we found a <picture>, use it; if only <img>, wrap in <picture>
  let imageContent;
  if (imageEl) {
    if (imageEl.tagName.toLowerCase() === 'picture') {
      imageContent = imageEl;
    } else {
      // Wrap img in picture
      const pic = document.createElement('picture');
      pic.appendChild(imageEl);
      imageContent = pic;
    }
  }

  // Find the main heading (h1, h2, h3, etc.)
  let heading = element.querySelector('h1, h2, h3, h4, h5, h6');
  // If no heading, fallback to first <p> with text
  if (!heading) {
    heading = Array.from(element.querySelectorAll('p')).find(p => p.textContent.trim());
  }

  // The text field is richtext. Use the heading as the content.
  let textContent = null;
  if (heading) {
    textContent = heading;
  }

  // Build the table rows
  const rows = [];
  // Header row
  rows.push(['Hero (hero2)']);

  // Image row (field: image)
  if (imageContent) {
    rows.push([fieldFragment('image', imageContent)]);
  } else {
    rows.push(['']);
  }

  // Text row (field: text)
  if (textContent) {
    rows.push([fieldFragment('text', textContent)]);
  } else {
    rows.push(['']);
  }

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
