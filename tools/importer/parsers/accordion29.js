/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const contentFragment = element.querySelector('article.contentfragment article.cmp-contentfragment');
  if (!contentFragment) return;

  // Helper to get all accordion sections
  function getAccordionSections(cfEl) {
    const sections = [];
    const elementsDiv = cfEl.querySelector('.cmp-contentfragment__elements');
    if (!elementsDiv) return sections;

    // Get all direct children of elementsDiv
    const children = Array.from(elementsDiv.childNodes).filter(n => n.nodeType === 1);

    // Find all section titles (h2.cmp-title__text)
    let sectionIndexes = [];
    children.forEach((node, idx) => {
      if (node.querySelector && node.querySelector('.cmp-title__text')) {
        sectionIndexes.push(idx);
      }
    });

    // Gather intro content before first section title
    let introContent = [];
    let introEnd = sectionIndexes.length > 0 ? sectionIndexes[0] : children.length;
    for (let i = 0; i < introEnd; i++) {
      const node = children[i];
      // Ignore empty grids
      if (node.classList && node.classList.contains('aem-Grid') && node.children.length === 0) continue;
      // Only push nodes that have meaningful text or media
      if (node.textContent.trim() || node.querySelector('img, video, blockquote, p, h1, h2, h3, h4, h5, h6')) {
        introContent.push(node);
      }
    }
    // Only add intro row if it has meaningful content
    if (introContent.length && introContent.some(n => n.textContent.trim() || n.querySelector('img, video, blockquote, p, h1, h2, h3, h4, h5, h6'))) {
      // Use the main article title as the accordion title
      const mainTitleEl = element.querySelector('.cmp-title__text');
      if (mainTitleEl) {
        sections.push([
          mainTitleEl.cloneNode(true),
          introContent.length === 1 ? introContent[0].cloneNode(true) : introContent.map(n => n.cloneNode(true))
        ]);
      }
    }

    // Now process each section (title + content)
    for (let s = 0; s < sectionIndexes.length; s++) {
      const idx = sectionIndexes[s];
      const node = children[idx];
      const titleEl = node.querySelector('.cmp-title__text');
      let content = [];
      let nextIdx = sectionIndexes[s + 1] !== undefined ? sectionIndexes[s + 1] : children.length;
      for (let i = idx + 1; i < nextIdx; i++) {
        const child = children[i];
        // Ignore empty grids
        if (child.classList && child.classList.contains('aem-Grid') && child.children.length === 0) continue;
        // Only push nodes that have meaningful text or media
        if (child.textContent.trim() || child.querySelector('img, video, blockquote, p, h1, h2, h3, h4, h5, h6')) {
          content.push(child);
        }
      }
      // Only add if content has meaningful content
      if (titleEl && content.some(n => n.textContent.trim() || n.querySelector('img, video, blockquote, p, h1, h2, h3, h4, h5, h6'))) {
        sections.push([
          titleEl.cloneNode(true),
          content.length === 1 ? content[0].cloneNode(true) : content.map(n => n.cloneNode(true))
        ]);
      }
    }
    return sections;
  }

  // Build the table
  const headerRow = ['Accordion (accordion29)'];
  const rows = [];
  const accordionSections = getAccordionSections(contentFragment);
  accordionSections.forEach(([titleEl, contentEl]) => {
    rows.push([titleEl, contentEl]);
  });

  // Only create table if there is at least one accordion row
  if (rows.length > 0) {
    const table = WebImporter.DOMUtils.createTable([headerRow, ...rows], document);
    // Replace the contentfragment, not the root element
    contentFragment.replaceWith(table);
  }
}
