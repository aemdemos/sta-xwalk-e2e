/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero wrapper and main content block
  const heroWrapper = element.querySelector('.hero-wrapper');
  let heroBlock = heroWrapper ? heroWrapper.querySelector('.hero.block') : null;
  let contentRoot = null;
  if (heroBlock) {
    // Often .hero.block > div > div is the actual content
    const outerDiv = heroBlock.querySelector('div');
    if (outerDiv && outerDiv.querySelector('div')) {
      contentRoot = outerDiv.querySelector('div');
    } else if (outerDiv) {
      contentRoot = outerDiv;
    } else {
      contentRoot = heroBlock;
    }
  } else {
    contentRoot = element;
  }
  // Find the image (picture or img)
  let bgImg = null;
  if (contentRoot) {
    const imgP = contentRoot.querySelector('p:has(picture), p:has(img)');
    if (imgP) {
      bgImg = imgP.querySelector('picture, img');
    } else {
      // fallback: picture or img directly inside contentRoot
      bgImg = contentRoot.querySelector('picture, img');
    }
  }
  // Gather hero content: heading, subheading, cta, extra text
  let title = null;
  let subheading = null;
  let cta = null;
  const textContent = [];
  if (contentRoot) {
    // Title: first h1/h2/h3
    title = contentRoot.querySelector('h1, h2, h3');
    if (title) textContent.push(title);
    // Subheading: next heading or p after title
    if (title) {
      let sib = title.nextElementSibling;
      while (sib) {
        if (/^h[1-6]$/i.test(sib.tagName)) {
          subheading = sib;
          textContent.push(subheading);
          break;
        } else if (sib.tagName === 'P' && sib.textContent.trim() !== '' && !sib.querySelector('img, picture')) {
          subheading = sib;
          textContent.push(subheading);
          break;
        }
        sib = sib.nextElementSibling;
      }
    }
    // CTA: first <a> (outside of image links)
    cta = contentRoot.querySelector('a');
    if (cta && !textContent.includes(cta)) textContent.push(cta);
    // Extra non-image paragraphs after heading/subheading if any
    const allPs = Array.from(contentRoot.querySelectorAll('p'));
    for (const p of allPs) {
      // skip if contains image or already used
      if (p.querySelector('img, picture')) continue;
      if (textContent.includes(p)) continue;
      if (p.textContent.trim()) {
        textContent.push(p);
      }
    }
  }
  // Create the rows array (always 1 column, 3 rows)
  const rows = [
    ['Hero'],
    [bgImg ? bgImg : ''],
    [textContent.length > 0 ? textContent : '']
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
