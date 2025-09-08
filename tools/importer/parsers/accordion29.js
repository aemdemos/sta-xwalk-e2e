/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const cfArticle = element.querySelector('.contentfragment article.cmp-contentfragment');
  if (!cfArticle) return;

  const cfElements = cfArticle.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Get all direct children of cfElements
  const children = Array.from(cfElements.children);

  // Helper: get all meaningful content from a node (including images, blockquotes, etc)
  function getContent(nodes) {
    return nodes.filter(n => n.nodeType === Node.ELEMENT_NODE && (
      n.textContent.trim() || n.querySelector('img, picture, video, blockquote, ul, ol, table')
    ));
  }

  // Build accordion sections: intro (before first h2), then each h2 section
  const sections = [];
  let introContent = [];
  let currentTitle = null;
  let currentContent = [];

  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    const h2 = node.querySelector && node.querySelector('h2');
    if (h2) {
      // Save previous section if exists
      if (currentTitle && currentContent.length) {
        sections.push([currentTitle, currentContent.slice()]);
      }
      currentTitle = h2;
      currentContent = [];
    } else {
      if (!currentTitle) {
        introContent.push(node);
      } else {
        currentContent.push(node);
      }
    }
  }
  // Push last section if exists
  if (currentTitle && currentContent.length) {
    sections.push([currentTitle, currentContent.slice()]);
  }

  // Add intro section as first accordion item if it has content
  const h1 = element.querySelector('h1.cmp-title__text');
  if (introContent.length) {
    sections.unshift([h1 || 'Introduction', introContent.slice()]);
  }

  // Build the table rows
  const headerRow = ['Accordion (accordion29)'];
  const rows = [headerRow];

  // Each section: title cell, content cell
  sections.forEach(([title, content]) => {
    const filteredContent = getContent(content);
    if (title && filteredContent.length) {
      rows.push([
        title,
        filteredContent.length === 1 ? filteredContent[0] : filteredContent
      ]);
    }
  });

  // Replace element with block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
