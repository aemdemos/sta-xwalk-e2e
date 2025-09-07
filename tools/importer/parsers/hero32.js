/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the main hero image (topmost image in the main content)
  function findHeroImage(el) {
    // Look for the first .image block inside the main container
    const imageBlocks = el.querySelectorAll('.image');
    for (const imgBlock of imageBlocks) {
      const img = imgBlock.querySelector('img');
      if (img && img.width >= 600) { // Heuristic: large image at top
        return img;
      }
    }
    return null;
  }

  // Helper to find the main heading and subheading
  function findHeroText(el) {
    // Find the first .title block with h1 (main heading)
    const titleBlocks = el.querySelectorAll('.title');
    let heading = null;
    let subheading = null;
    for (const t of titleBlocks) {
      const h1 = t.querySelector('h1');
      if (h1 && !heading) {
        heading = h1;
        continue;
      }
      const h4 = t.querySelector('h4');
      if (h4 && !subheading) {
        subheading = h4;
      }
    }
    return { heading, subheading };
  }

  // Helper to find all paragraphs at the top of the article (for full hero text)
  function findHeroParagraphs(el) {
    // Try to find the article/contentfragment area
    const mainContent = el.querySelector('article.contentfragment, article.cmp-contentfragment');
    const paragraphs = [];
    if (mainContent) {
      // Get all <p> elements before any h2 (section heading)
      let foundSection = false;
      for (const child of mainContent.children) {
        if (child.tagName === 'H2' || (child.querySelector && child.querySelector('h2'))) {
          foundSection = true;
        }
        if (!foundSection) {
          if (child.tagName === 'P') {
            paragraphs.push(child);
          } else if (child.querySelectorAll) {
            child.querySelectorAll('p').forEach(p => paragraphs.push(p));
          }
        }
      }
    }
    // Fallback: first <p> in the whole element
    if (paragraphs.length === 0) {
      const p = el.querySelector('p');
      if (p) paragraphs.push(p);
    }
    return paragraphs;
  }

  // Find main hero image
  const heroImage = findHeroImage(element);

  // Find main heading and subheading
  const { heading, subheading } = findHeroText(element);

  // Find all hero paragraphs (for full text content)
  const heroParagraphs = findHeroParagraphs(element);

  // Compose hero text cell
  const heroTextCell = [];
  if (heading) heroTextCell.push(heading);
  if (subheading) heroTextCell.push(subheading);
  heroParagraphs.forEach(p => heroTextCell.push(p));

  // Compose table rows
  const headerRow = ['Hero (hero32)'];
  const imageRow = [heroImage ? heroImage : ''];
  const textRow = [heroTextCell.length ? heroTextCell : ''];

  const cells = [
    headerRow,
    imageRow,
    textRow,
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
