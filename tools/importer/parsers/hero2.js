/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero image: first <picture> or <img> inside this element
  let heroImage = null;
  const picture = element.querySelector('picture');
  if (picture) {
    heroImage = picture;
  } else {
    const img = element.querySelector('img');
    if (img) heroImage = img;
  }

  // Find the hero text content: div containing heading and p after the image
  // Find the parent div that contains the image and heading
  let textContent = null;
  if (heroImage) {
    // The containing div will have as children: a <p> (image), h1, and p
    const parentDiv = heroImage.closest('div');
    if (parentDiv) {
      // Get all children after the image paragraph
      // Find the parent <p> of the image
      const imageP = heroImage.closest('p');
      if (imageP && imageP.parentElement === parentDiv) {
        // Collect all siblings after imageP
        const siblings = [];
        let foundImgP = false;
        for (const child of parentDiv.children) {
          if (child === imageP) {
            foundImgP = true;
            continue;
          }
          if (foundImgP) {
            siblings.push(child);
          }
        }
        // If there is at least one sibling (e.g. heading), group them in a div
        if (siblings.length) {
          const container = document.createElement('div');
          siblings.forEach(el => container.appendChild(el));
          // Remove empty <p> tags
          [...container.querySelectorAll('p')].forEach(p => {
            if (!p.textContent.trim() && p.children.length === 0) p.remove();
          });
          // If container has no content, set textContent to null
          textContent = container.childNodes.length ? container : null;
        }
      }
    }
  }
  // Fallback: If no image or can't find text, use the whole element's text portion
  if (!textContent) {
    // Try to find the first heading in the block
    const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      const container = document.createElement('div');
      container.appendChild(heading);
      // Add all following siblings that are paragraphs
      let next = heading.nextElementSibling;
      while (next && next.tagName.toLowerCase() === 'p') {
        container.appendChild(next);
        next = next.nextElementSibling;
      }
      // Remove empty <p> tags
      [...container.querySelectorAll('p')].forEach(p => {
        if (!p.textContent.trim() && p.children.length === 0) p.remove();
      });
      textContent = container.childNodes.length ? container : null;
    }
  }

  const cells = [
    ['Hero'],
    [heroImage ? heroImage : ''],
    [textContent ? textContent : '']
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
