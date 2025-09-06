/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const contentFragment = element.querySelector('article.contentfragment, article.cmp-contentfragment');
  if (!contentFragment) return;

  // Find the main content container inside the contentfragment
  const cfElements = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // We'll build the accordion rows here
  const rows = [];
  // Always use the required header row
  const headerRow = ['Accordion (accordion33)'];
  rows.push(headerRow);

  // Get all children in order
  const children = Array.from(cfElements.children);
  let i = 0;

  // Collect intro content (before first h2)
  const introContent = [];
  while (i < children.length && children[i].tagName.toLowerCase() !== 'h2') {
    if (
      children[i].tagName.toLowerCase() === 'p' ||
      (children[i].querySelector && children[i].querySelector('.cmp-image'))
    ) {
      introContent.push(children[i]);
    }
    i++;
  }
  if (introContent.length) {
    rows.push([
      'Introduction',
      introContent
    ]);
  }

  // Now process each accordion section (h2, [image], p)
  while (i < children.length) {
    if (children[i].tagName.toLowerCase() === 'h2') {
      const title = children[i].textContent.trim();
      i++;
      let sectionContent = [];
      // Collect all content until next h2 or end
      while (
        i < children.length &&
        children[i].tagName.toLowerCase() !== 'h2'
      ) {
        if (
          children[i].tagName.toLowerCase() === 'p' ||
          (children[i].querySelector && children[i].querySelector('.cmp-image'))
        ) {
          sectionContent.push(children[i]);
        }
        i++;
      }
      // Always add row, even if empty
      rows.push([
        title,
        sectionContent.length ? sectionContent : ['']
      ]);
    } else {
      i++;
    }
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original contentfragment with the block table
  contentFragment.replaceWith(table);
}
