/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article (the accordion source)
  const cfArticle = element.querySelector('.contentfragment article.cmp-contentfragment');
  if (!cfArticle) return;

  // Find the content fragment elements wrapper
  const elementsWrapper = cfArticle.querySelector('.cmp-contentfragment__elements');
  if (!elementsWrapper) return;

  // Helper: get all direct children (skip empty text nodes)
  const children = Array.from(elementsWrapper.children);

  // We'll build accordion items: [title, content]
  const items = [];
  let currentTitle = null;
  let currentContent = [];
  let foundFirstH2 = false;

  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    // If node is a div with h2 (section title)
    const h2 = node.querySelector && node.querySelector('h2.cmp-title__text');
    if (h2) {
      // Push previous section
      if (currentTitle !== null && currentContent.length) {
        items.push([
          currentTitle,
          currentContent.length === 1 ? currentContent[0] : currentContent.slice(),
        ]);
      }
      currentTitle = h2;
      currentContent = [];
      foundFirstH2 = true;
      // If next sibling is an image, include it
      const next = children[i + 1];
      if (next && next.querySelector && next.querySelector('.cmp-image__image')) {
        currentContent.push(next);
        i++;
      }
      continue;
    }
    // If node is a div with quote
    const blockquote = node.querySelector && node.querySelector('blockquote');
    if (blockquote) {
      // Push previous section
      if (currentTitle !== null && currentContent.length) {
        items.push([
          currentTitle,
          currentContent.length === 1 ? currentContent[0] : currentContent.slice(),
        ]);
        currentTitle = null;
        currentContent = [];
      }
      // Use the quote as both title and content
      items.push([
        blockquote,
        node,
      ]);
      continue;
    }
    // If node is a div with image and no h2
    const img = node.querySelector && node.querySelector('.cmp-image__image');
    if (img) {
      currentContent.push(node);
      continue;
    }
    // If node is a <p>
    if (node.tagName === 'P') {
      if (!foundFirstH2 && !currentTitle) {
        // Use first <p> as first section title
        currentTitle = node;
        currentContent = [];
      } else {
        currentContent.push(node);
      }
      continue;
    }
    // Otherwise, treat as content
    currentContent.push(node);
  }
  // Push last section
  if (currentTitle !== null && currentContent.length) {
    items.push([
      currentTitle,
      currentContent.length === 1 ? currentContent[0] : currentContent,
    ]);
  }

  // Remove any accidental empty rows
  const filteredItems = items.filter(([title, content]) => title && content && (Array.isArray(content) ? content.length : true));

  // Build the table rows
  const headerRow = ['Accordion (accordion30)'];
  const rows = [headerRow];
  filteredItems.forEach(([title, content]) => {
    rows.push([title, content]);
  });

  // Only create the block if there is at least one accordion item
  if (rows.length > 1) {
    const block = WebImporter.DOMUtils.createTable(rows, document);
    cfArticle.replaceWith(block);
  }
}
