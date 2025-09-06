/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content area that contains the article sections
  // Defensive: find the main container with the article contentfragment
  const contentFragment = element.querySelector('.contentfragment article.cmp-contentfragment');
  if (!contentFragment) return;

  // Helper to collect all accordion sections
  const accordionRows = [];

  // The contentfragment__elements contains the main content
  const elementsContainer = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsContainer) return;

  // We'll iterate through the children, grouping by section
  // Each section starts with a title (h2.cmp-title__text), and includes all following siblings until the next h2 or end
  // The first section is before the first h2 (the intro)
  const children = Array.from(elementsContainer.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));

  let currentTitle = null;
  let currentContent = [];

  function pushSection(title, content) {
    if (!title || content.length === 0) return;
    accordionRows.push([title, content.length === 1 ? content[0] : content]);
  }

  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    // Section title is a .title.cmp-title--underline or h2.cmp-title__text
    let h2 = null;
    if (node.matches && node.matches('.title.cmp-title--underline, .title')) {
      h2 = node.querySelector('h2.cmp-title__text');
    }
    if (h2) {
      // Push previous section
      pushSection(currentTitle, currentContent);
      currentTitle = h2;
      currentContent = [];
    } else {
      // If not a section title, add to current content
      currentContent.push(node);
    }
  }
  // Push the last section
  pushSection(currentTitle, currentContent);

  // There may be an intro section before the first h2, which is the first <p> and its related content
  // Let's check if the very first child is a <p> and not part of a section
  const firstP = elementsContainer.querySelector('p');
  if (firstP && (!accordionRows.length || accordionRows[0][0] !== firstP)) {
    // Gather all nodes before the first h2
    const introContent = [];
    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      let isSectionTitle = false;
      if (node.matches && node.matches('.title.cmp-title--underline, .title')) {
        isSectionTitle = !!node.querySelector('h2.cmp-title__text');
      }
      if (isSectionTitle) break;
      introContent.push(node);
    }
    // Use the article title as the accordion title for the intro
    const articleTitle = contentFragment.querySelector('h3.cmp-contentfragment__title');
    if (articleTitle && introContent.length) {
      accordionRows.unshift([articleTitle, introContent.length === 1 ? introContent[0] : introContent]);
    }
  }

  // Table header
  const headerRow = ['Accordion (accordion32)'];
  const tableRows = [headerRow, ...accordionRows];

  // Create the table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original contentfragment with the accordion block
  contentFragment.replaceWith(table);
}
