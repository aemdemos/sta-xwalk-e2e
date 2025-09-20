/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the innermost content div
  function getInnermostContentDiv(el) {
    let current = el;
    while (current && current.children.length === 1 && current.firstElementChild.tagName === 'DIV') {
      current = current.firstElementChild;
    }
    return current;
  }

  // 1. Always use the required header row
  const headerRow = ['Hero (hero2)'];

  // 2. Find the innermost content div
  const contentDiv = getInnermostContentDiv(element);

  // 3. Find image (background)
  let imageEl = null;
  // Look for <img> inside <picture> inside <p>
  const picture = contentDiv.querySelector('picture');
  if (picture) {
    imageEl = picture.querySelector('img');
  }

  // 4. Find heading, subheading, CTA
  // For this example, only h1 exists
  let headingEl = contentDiv.querySelector('h1, h2, h3, h4, h5, h6');

  // 5. Find CTA (a link), if present
  let ctaEl = contentDiv.querySelector('a');

  // 6. Find subheading (paragraphs after heading, if any)
  // For this example, there is only an empty <p> after the h1
  // We'll collect all elements after the heading (excluding the image)
  let textContentEls = [];
  if (headingEl) {
    let sibling = headingEl.nextElementSibling;
    while (sibling) {
      // Exclude empty paragraphs
      if (!(sibling.tagName === 'P' && sibling.textContent.trim() === '')) {
        textContentEls.push(sibling);
      }
      sibling = sibling.nextElementSibling;
    }
  }

  // 7. Build the table rows
  // Row 2: background image (optional)
  const row2 = [imageEl ? imageEl : ''];

  // Row 3: Heading, subheading, CTA (all in one cell)
  const row3Content = [];
  if (headingEl) row3Content.push(headingEl);
  if (textContentEls.length) row3Content.push(...textContentEls);
  if (ctaEl && !row3Content.includes(ctaEl)) row3Content.push(ctaEl);
  const row3 = [row3Content.length === 1 ? row3Content[0] : row3Content];

  // Compose the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    row2,
    row3,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
