/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main hero image (first .cmp-image inside the first .image block)
  let heroImage = null;
  const imageBlocks = element.querySelectorAll('.image');
  for (const imgBlock of imageBlocks) {
    const cmpImg = imgBlock.querySelector('.cmp-image');
    if (cmpImg && cmpImg.querySelector('img')) {
      heroImage = cmpImg;
      break;
    }
  }

  // Find the main title (first h1 in .cmp-title)
  let heroTitle = null;
  const titleBlocks = element.querySelectorAll('.cmp-title');
  for (const titleBlock of titleBlocks) {
    const h1 = titleBlock.querySelector('h1');
    if (h1) {
      heroTitle = h1;
      break;
    }
  }

  // Find the byline (author) - first h4 in .cmp-title ("By ...")
  let heroByline = null;
  for (const titleBlock of titleBlocks) {
    const h4 = titleBlock.querySelector('h4');
    if (h4) {
      heroByline = h4;
      break;
    }
  }

  // Find the first paragraph after the title for subheading (if present)
  let subheading = null;
  if (heroTitle) {
    // Look for the closest .cmp-title containing heroTitle
    let titleContainer = heroTitle.closest('.cmp-title');
    // The .cmp-title is inside a .title, which is a sibling to the next .title or article
    let parent = titleContainer ? titleContainer.parentElement : null;
    let next = parent ? parent.nextElementSibling : null;
    // Look for the first <p> in the next .title or article
    while (next && !subheading) {
      // If it's a .title, look for <h4> or <p>
      if (next.classList.contains('title')) {
        const h4 = next.querySelector('h4');
        if (h4 && h4 !== heroByline) {
          subheading = h4;
          break;
        }
        const p = next.querySelector('p');
        if (p) {
          subheading = p;
          break;
        }
      } else {
        // If it's an article, look for first <p>
        const p = next.querySelector('p');
        if (p) {
          subheading = p;
          break;
        }
      }
      next = next.nextElementSibling;
    }
  }

  // --- FLEXIBILITY FIX: ---
  // Instead of only picking h1/h4/p, grab all elements that are part of the hero content area (title, byline, and all paragraphs up to the first main section)
  // Find the main content area (the first .container.responsivegrid.cmp-layout-container--fixed)
  const mainContainer = element.querySelector('main.container.responsivegrid.cmp-layout-container--fixed');
  let contentCell = [];
  if (mainContainer) {
    // Find the first .cmp-title h1 (title)
    const h1 = mainContainer.querySelector('.cmp-title h1');
    if (h1) contentCell.push(h1);
    // Find the first .cmp-title h4 (byline)
    const h4 = mainContainer.querySelector('.cmp-title h4');
    if (h4) contentCell.push(h4);
    // Find all <p> elements that are siblings after the h4 (byline) and before the first <article> or <div.article>
    let pEls = [];
    let foundH4 = false;
    let stop = false;
    mainContainer.querySelectorAll(':scope > div, :scope > article').forEach((block) => {
      if (stop) return;
      if (block.querySelector('.cmp-title h4')) {
        foundH4 = true;
        return;
      }
      if (!foundH4) return;
      // Stop at first article or .contentfragment
      if (block.matches('article, .contentfragment')) {
        stop = true;
        return;
      }
      // Collect all <p> in this block
      const ps = block.querySelectorAll('p');
      ps.forEach(p => pEls.push(p));
    });
    // If no <p> found, try to get the first <p> in the next article/contentfragment
    if (pEls.length === 0) {
      const nextArticle = mainContainer.querySelector('article, .contentfragment');
      if (nextArticle) {
        const firstP = nextArticle.querySelector('p');
        if (firstP) pEls.push(firstP);
      }
    }
    contentCell = [h1, h4, ...pEls].filter(Boolean);
  } else {
    // fallback to previous logic
    contentCell = [];
    if (heroTitle) contentCell.push(heroTitle);
    if (heroByline) contentCell.push(heroByline);
    if (subheading) contentCell.push(subheading);
  }

  // Table rows: header, image, content
  const headerRow = ['Hero (hero18)'];
  const imageRow = [heroImage ? heroImage : ''];
  const contentRow = [contentCell.length ? contentCell : ''];

  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
