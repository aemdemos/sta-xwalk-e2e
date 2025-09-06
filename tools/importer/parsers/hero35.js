/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get immediate child with class
  function getChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList && child.classList.contains(className));
  }

  // 1. Find the main hero image (first image at the top)
  let heroImg = null;
  const grid = element.querySelector('.aem-Grid');
  if (grid) {
    const imgDiv = Array.from(grid.children).find(child => child.classList && child.classList.contains('image'));
    if (imgDiv) {
      heroImg = imgDiv.querySelector('img');
    }
  }

  // 2. Find the title and subtitle (author)
  let title = null;
  let subtitle = null;
  let introParas = [];
  const innerMain = element.querySelector('main.container');
  if (innerMain) {
    const titles = innerMain.querySelectorAll('.title');
    if (titles.length > 0) {
      // First .title is the main title
      const h1 = titles[0].querySelector('h1');
      if (h1) {
        title = h1.cloneNode(true);
      }
      // Second .title is the author/byline
      if (titles.length > 1) {
        const h4 = titles[1].querySelector('h4');
        if (h4) {
          subtitle = h4.cloneNode(true);
        }
      }
    }
    // Add all paragraphs up to the first image in the contentfragment
    const cf = innerMain.querySelector('article.contentfragment');
    if (cf) {
      // Find the first .cmp-contentfragment__elements
      const cfEls = cf.querySelector('.cmp-contentfragment__elements');
      if (cfEls) {
        let foundFirstImage = false;
        for (const node of cfEls.children) {
          if (foundFirstImage) break;
          // If it's a <p>, add it
          if (node.tagName === 'P') {
            introParas.push(node.cloneNode(true));
          } else if (node.querySelector && node.querySelector('img')) {
            // Stop at the first image
            foundFirstImage = true;
          }
        }
      }
    }
  }

  // Compose the text cell (title, subtitle, intro)
  const textCellContent = [];
  if (title) textCellContent.push(title);
  if (subtitle) textCellContent.push(subtitle);
  if (introParas.length) textCellContent.push(...introParas);

  const headerRow = ['Hero (hero35)'];
  const imageRow = [heroImg ? heroImg.cloneNode(true) : ''];
  const textRow = [textCellContent.length ? textCellContent : ''];

  const cells = [headerRow, imageRow, textRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
