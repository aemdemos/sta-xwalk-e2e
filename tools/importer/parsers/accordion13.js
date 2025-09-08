/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article (the accordion source)
  const contentFragment = element.querySelector('article.cmp-contentfragment');
  if (!contentFragment) return;

  // Find the main content area inside the contentfragment
  const elementsWrapper = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsWrapper) return;

  // The content is inside the second <div> (the first is empty)
  const contentDivs = elementsWrapper.querySelectorAll(':scope > div');
  let mainContentDiv = null;
  if (contentDivs.length > 1) {
    mainContentDiv = contentDivs[1];
  } else {
    mainContentDiv = Array.from(contentDivs).find(div => div.children.length > 0 || div.querySelector('p, h2'));
  }
  if (!mainContentDiv) return;

  // Helper to filter out empty grid divs (and also remove them from DOM)
  function isEmptyGridDiv(node) {
    return node.nodeType === 1 && node.tagName === 'DIV' && node.classList.contains('aem-Grid') && node.innerHTML.trim() === '';
  }
  function cleanContentArr(arr) {
    return (arr || []).filter(node => {
      if (isEmptyGridDiv(node)) {
        node.remove();
        return false;
      }
      return true;
    });
  }

  // Walk through the children of mainContentDiv and collect accordion items
  const rows = [];
  const headerRow = ['Accordion (accordion13)'];
  rows.push(headerRow);

  const children = Array.from(mainContentDiv.childNodes);
  let currentTitle = null;
  let currentContent = [];

  function pushAccordionRow(title, contentArr) {
    if (!title) return;
    const filteredContent = cleanContentArr(contentArr);
    if (filteredContent.length === 0) return;
    rows.push([title, filteredContent.length === 1 ? filteredContent[0] : filteredContent]);
  }

  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    if (node.nodeType === 1 && node.tagName === 'H2') {
      pushAccordionRow(currentTitle, currentContent);
      currentTitle = node;
      currentContent = [];
    } else {
      if (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())) {
        currentContent.push(node);
      }
    }
  }
  pushAccordionRow(currentTitle, currentContent);

  if (rows.length <= 1) return;

  const table = WebImporter.DOMUtils.createTable(rows, document);
  contentFragment.replaceWith(table);
}
