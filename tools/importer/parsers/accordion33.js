/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all accordion sections from the article
  function getAccordionSections(article) {
    const sections = [];
    let currentTitle = null;
    let currentContent = [];
    // Find all direct children of .cmp-contentfragment__elements
    const elementsContainer = article.querySelector('.cmp-contentfragment__elements');
    if (!elementsContainer) return sections;
    // Flatten all children (including nested divs)
    const children = Array.from(elementsContainer.childNodes).filter(node => {
      // Only keep element nodes and paragraphs
      return node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim());
    });
    children.forEach((node) => {
      // Title section (h2)
      let h2 = null;
      if (node.nodeType === 1 && node.querySelector && (h2 = node.querySelector('h2.cmp-title__text'))) {
        // If we have a previous section, push it
        if (currentTitle && currentContent.length) {
          sections.push([currentTitle, currentContent]);
        }
        currentTitle = h2;
        currentContent = [];
      } else {
        // Content section
        if (currentTitle) {
          // Defensive: skip empty divs
          if (node.nodeType === 1 && node.tagName === 'DIV' && node.children.length === 0 && !node.textContent.trim()) {
            return;
          }
          currentContent.push(node);
        }
      }
    });
    // Push last section
    if (currentTitle && currentContent.length) {
      sections.push([currentTitle, currentContent]);
    }
    return sections;
  }

  // Find the main article block
  const article = element.querySelector('article.cmp-contentfragment');
  if (!article) return;

  // Get all accordion sections (title/content pairs)
  let sections = getAccordionSections(article);

  // If no sections found, fallback to all h2s in article
  if (sections.length === 0) {
    const h2s = Array.from(article.querySelectorAll('h2.cmp-title__text'));
    sections = h2s.map(h2 => {
      // Find all siblings after h2 until next h2
      let content = [];
      let node = h2.parentElement.parentElement.nextElementSibling;
      while (node && !node.querySelector('h2.cmp-title__text')) {
        content.push(node);
        node = node.nextElementSibling;
      }
      return [h2, content];
    });
  }

  // Table header
  const headerRow = ['Accordion (accordion33)'];
  // Build table rows: each is [title, content]
  const tableRows = sections
    .filter(([title, content]) => title && content && content.length)
    .map(([title, content]) => {
      // Flatten content: if array of nodes, wrap in a div
      const contentDiv = document.createElement('div');
      content.forEach(node => {
        // If node is an element, clone it; if text, append as text
        if (node.nodeType === 1) {
          contentDiv.appendChild(node.cloneNode(true));
        } else if (node.nodeType === 3) {
          contentDiv.appendChild(document.createTextNode(node.textContent));
        }
      });
      return [title.cloneNode(true), contentDiv];
    });

  // Create block table
  const cells = [headerRow, ...tableRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
