/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero main content: image, heading, etc.
  // Structure is: section.hero-container > .hero-wrapper > .hero.block > div > div > ...
  // Find the innermost div, which contains the image and text
  let heroInner = element.querySelector('.hero-wrapper .hero.block > div > div');
  if (!heroInner) {
    // fallback: find first div that contains a picture or h1 inside hero.block
    const heroBlock = element.querySelector('.hero.block');
    if (heroBlock) {
      heroInner = Array.from(heroBlock.querySelectorAll('div')).find(div => div.querySelector('picture, h1, h2, h3'));
    }
  }
  if (!heroInner) {
    // fallback: use the .hero.block element itself
    heroInner = element.querySelector('.hero.block') || element;
  }

  // Find the picture (image)
  const picture = heroInner.querySelector('picture');

  // Find all heading and paragraph content after the image, in order
  const contentFragment = document.createDocumentFragment();
  let foundImage = false;
  for (const child of heroInner.children) {
    if (child.tagName.toLowerCase() === 'p' && child.querySelector('picture')) {
      foundImage = true;
      continue;
    }
    if (foundImage) {
      // Only include meaningful heading or text nodes
      if ((/^h[1-6]$/i).test(child.tagName) || (child.tagName.toLowerCase() === 'p' && child.textContent.trim())) {
        contentFragment.appendChild(child);
      }
    }
  }
  // If nothing is found but there is a heading (sometimes structure may vary)
  if (!contentFragment.childNodes.length) {
    const heading = heroInner.querySelector('h1, h2, h3');
    if (heading) contentFragment.appendChild(heading);
  }

  // Prepare block table structure: [header], [image], [content]
  const rows = [];
  rows.push(["Hero"]);
  rows.push([picture ? picture : '']);
  rows.push([contentFragment.childNodes.length ? contentFragment : '']);

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
