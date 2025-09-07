/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const contentFragment = element.querySelector('.contentfragment article.cmp-contentfragment');
  if (!contentFragment) return;

  // Find the main content container inside the contentfragment
  const elementsContainer = contentFragment.querySelector('.cmp-contentfragment__elements > div');
  if (!elementsContainer) return;

  // Always use the required header row
  const headerRow = ['Accordion (accordion16)'];
  const rows = [];

  // Get all children of the elementsContainer
  const children = Array.from(elementsContainer.children);

  // Group content by section: each <h2> is a title, everything until next <h2> is content
  let i = 0;
  // If there is an intro (before first h2), skip it (matches screenshot and markdown)
  while (i < children.length) {
    if (children[i].tagName === 'H2') break;
    i++;
  }
  let foundSection = false;
  while (i < children.length) {
    if (children[i].tagName === 'H2') {
      foundSection = true;
      const title = children[i].textContent.trim();
      i++;
      // Gather all content nodes until next h2 or end
      const contentNodes = [];
      while (i < children.length && children[i].tagName !== 'H2') {
        const node = children[i];
        // If it's a grid, check for images inside
        if (node.classList && node.classList.contains('aem-Grid')) {
          const imageWrappers = node.querySelectorAll('.image');
          imageWrappers.forEach(imgWrap => {
            const cmpImage = imgWrap.querySelector('.cmp-image');
            if (cmpImage) contentNodes.push(cmpImage);
          });
        } else {
          contentNodes.push(node);
        }
        i++;
      }
      // Only add if there's actual content
      if (contentNodes.length) {
        rows.push([title, contentNodes]);
      }
    } else {
      i++;
    }
  }

  // Only create the table if there are rows
  if (rows.length) {
    const cells = [headerRow, ...rows];
    const block = WebImporter.DOMUtils.createTable(cells, document);
    // Replace the content fragment, not the root element
    element.replaceWith(block);
  }
}
