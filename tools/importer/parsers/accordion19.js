/* global WebImporter */
export default function parse(element, { document }) {
  // Only operate on the main contentfragment article
  if (!element || !element.classList.contains('cmp-contentfragment')) return;

  // Find the main content container inside the contentfragment
  const cfElements = element.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Gather all direct children (paragraphs, divs, etc.)
  const children = Array.from(cfElements.children);

  // We'll build the accordion rows here
  const rows = [];

  // Always use the required header
  const headerRow = ['Accordion (accordion19)'];
  rows.push(headerRow);

  // We'll iterate through the children and group them into accordion items
  // Each item: [title, content]
  // Titles are h2s (cmp-title__text), content is everything until next h2

  let currentTitle = null;
  let currentContent = [];
  let sawFirstH2 = false;

  // For intro block (before first h2), treat as first accordion item
  let introTitleElem = null;
  let introContentElems = [];

  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    // Find h2 title blocks
    if (
      node.tagName === 'DIV' &&
      node.querySelector('.cmp-title__text') &&
      node.querySelector('.cmp-title__text').tagName === 'H2'
    ) {
      // If this is the first h2, everything before is intro
      if (!sawFirstH2) {
        sawFirstH2 = true;
        for (let j = 0; j < i; j++) {
          const introNode = children[j];
          if (
            introNode.tagName === 'DIV' &&
            introNode.querySelector('blockquote')
          ) {
            introTitleElem = introNode.querySelector('blockquote');
            // Also include the attribution (u tag) if present
            const uElem = introNode.querySelector('u');
            if (uElem) introContentElems.push(uElem);
          } else {
            introContentElems.push(introNode);
          }
        }
        // Fallback: if no blockquote, use first paragraph as title
        if (!introTitleElem && introContentElems.length > 0 && introContentElems[0].tagName === 'P') {
          introTitleElem = introContentElems.shift();
        }
        if (introTitleElem) {
          rows.push([
            introTitleElem,
            introContentElems.length ? introContentElems : ''
          ]);
        }
      }
      // If we already have a currentTitle, push the previous item
      if (currentTitle) {
        rows.push([
          currentTitle,
          currentContent.length === 1 ? currentContent[0] : currentContent
        ]);
      }
      // Start new item
      currentTitle = node.querySelector('.cmp-title__text');
      currentContent = [];
    } else {
      // Not a title block
      // If we haven't seen a h2 yet, this is intro content
      if (!sawFirstH2) {
        // handled above
      } else {
        // Add to current content
        // Ignore empty grid wrappers
        if (
          node.tagName === 'DIV' &&
          node.classList.contains('aem-Grid') &&
          node.children.length === 0
        ) {
          continue;
        }
        currentContent.push(node);
      }
    }
  }
  // Push the last accordion item
  if (currentTitle) {
    rows.push([
      currentTitle,
      currentContent.length === 1 ? currentContent[0] : currentContent
    ]);
  }

  // Replace the original element only if there are rows (including header)
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
