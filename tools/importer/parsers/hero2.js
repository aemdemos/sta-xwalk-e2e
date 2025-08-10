/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Get the main content container inside the hero block
  const wrapper = element.querySelector('.hero-wrapper') || element;
  const heroBlock = wrapper.querySelector('.hero.block') || wrapper;
  let contentDiv = heroBlock.querySelector(':scope > div > div') || heroBlock.querySelector(':scope > div') || heroBlock;

  // 2. Find the image (picture or img inside first <p>)
  let imageEl = null;
  // Try to find picture inside a paragraph
  const pWithPicture = contentDiv.querySelector('p picture');
  if (pWithPicture) {
    imageEl = pWithPicture;
  } else {
    // Look for img directly
    imageEl = contentDiv.querySelector('img');
  }

  // 3. Find the title (first h1 or h2 inside content)
  const titleEl = contentDiv.querySelector('h1, h2');
  // 4. Find subheading, paragraph(s), or CTA after the heading
  let textEls = [];
  if (titleEl) {
    textEls.push(titleEl);
    let next = titleEl.nextElementSibling;
    while (next) {
      // Don't include empty paragraphs
      if (next.tagName === 'P' && !next.textContent.trim()) {
        next = next.nextElementSibling;
        continue;
      }
      // Don't include the image again if it's in a <p>
      if (next.querySelector && imageEl && next.contains(imageEl)) {
        next = next.nextElementSibling;
        continue;
      }
      textEls.push(next);
      next = next.nextElementSibling;
    }
  }

  // Edge case: if there is no heading, try to gather all children that are not the image
  if (textEls.length === 0) {
    textEls = Array.from(contentDiv.children).filter(child => {
      if (imageEl && (child === imageEl || child.contains(imageEl))) return false;
      if (child.tagName === 'P' && !child.textContent.trim()) return false;
      return true;
    });
  }

  // 5. Compose table rows: header, image, then text
  const blockRows = [
    ['Hero'],
    [imageEl ? imageEl : ''],
    [textEls.length === 1 ? textEls[0] : textEls]
  ];

  const table = WebImporter.DOMUtils.createTable(blockRows, document);
  element.replaceWith(table);
}
