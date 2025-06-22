/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as specified
  const headerRow = ['Hero (hero2)'];

  // Find the hero block (should be the only .hero.block inside)
  const heroBlock = element.querySelector('.hero.block');

  // Default fallbacks
  let imageEl = '';
  let textEls = [];

  if (heroBlock) {
    // The main content div is the first div inside heroBlock
    const contentDiv = heroBlock.querySelector('div > div');
    if (contentDiv) {
      // Image: find first <picture> or <img>
      const pic = contentDiv.querySelector('picture');
      if (pic) {
        imageEl = pic;
      }
      // Text: collect h1, subheading, CTA (if present)
      // In this example, only h1 is present
      const h1 = contentDiv.querySelector('h1, h2, h3, h4, h5, h6');
      if (h1) textEls.push(h1);
      // Look for possible subheading: next <p> with text after heading
      if (h1) {
        let next = h1.nextElementSibling;
        while (next) {
          if (next.tagName.toLowerCase() === 'p' && next.textContent.trim()) {
            textEls.push(next);
            break;
          }
          next = next.nextElementSibling;
        }
      }
      // CTA: look for links in text
      // Here, not present, but could generalize:
      const links = contentDiv.querySelectorAll('a');
      links.forEach(link => {
        if (!textEls.includes(link)) textEls.push(link);
      });
    }
  }

  const cells = [
    headerRow,
    [imageEl],
    [textEls.length > 1 ? textEls : (textEls[0] || '')]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
