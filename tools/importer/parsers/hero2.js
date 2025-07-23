/* global WebImporter */
export default function parse(element, { document }) {
  // The block structure requires:
  // 1. First row: ['Hero']
  // 2. Second row: [Background Image (optional)]
  // 3. Third row: [Headline, subheading, CTA (all optional)]

  // Safely find the first <picture> (image)
  let picture = element.querySelector('picture');

  // For text: find the main heading and any subheading or CTA elements
  let textContent = [];
  // Get first heading inside the element
  const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) textContent.push(heading);

  // find any subheading/paragraph or button/cta after the heading (not present in example)
  // but generically, grab all <p> or <a> after the heading
  if (heading) {
    let sibling = heading.nextElementSibling;
    while (sibling) {
      if (sibling.tagName.toLowerCase() === 'p' || sibling.tagName.toLowerCase() === 'a' || sibling.tagName.toLowerCase().match(/^h[1-6]$/)) {
        // Don't add empty paragraphs
        if (sibling.textContent.trim() || sibling.tagName.toLowerCase() !== 'p') {
          textContent.push(sibling);
        }
      }
      sibling = sibling.nextElementSibling;
    }
  }

  // If nothing found for text cell, leave cell empty
  const textCell = textContent.length === 1 ? textContent[0] : (textContent.length > 1 ? textContent : '');

  // Compose rows
  const rows = [
    ['Hero'],
    [picture || ''],
    [textCell]
  ];

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
