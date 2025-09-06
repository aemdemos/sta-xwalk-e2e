/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const contentFragment = element.querySelector('article.cmp-contentfragment');
  if (!contentFragment) return;

  // Find the main content area inside contentfragment
  const fragmentElements = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!fragmentElements) return;

  // Helper to get all direct children of a parent
  function getDirectChildren(parent) {
    return Array.from(parent.children);
  }

  // We'll collect accordion items as [title, content] pairs
  const accordionRows = [];

  // 1. Find the intro (before first h2)
  let children = getDirectChildren(fragmentElements);
  let introContent = [];

  // Instead of only direct children, collect all content before first h2, including nested elements
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    // If child contains h2, stop intro collection
    if (child.querySelector && child.querySelector('h2')) {
      break;
    }
    // For divs, collect all their children except empty grids
    if (child.tagName === 'DIV' && child.classList.contains('aem-Grid')) {
      if (child.innerHTML.trim() === '') continue;
      Array.from(child.children).forEach((sub) => {
        if (
          sub.innerHTML.trim() !== '' &&
          !(sub.tagName === 'DIV' && sub.classList.contains('aem-Grid') && sub.innerHTML.trim() === '')
        ) introContent.push(sub);
      });
    } else if (child.innerHTML.trim() !== '') {
      introContent.push(child);
    }
  }

  // Grab the main title and author if present
  const mainTitle = element.querySelector('.cmp-title h1');
  const author = element.querySelector('.cmp-title h4');
  if (mainTitle) introContent.unshift(mainTitle);
  if (author) introContent.unshift(author);

  // Add the intro row only if it has content
  if (introContent.length) {
    accordionRows.push([
      'Introduction',
      introContent
    ]);
  }

  // 2. Find all h2 sections and their content
  let currentTitle = null;
  let currentContent = [];
  let inSection = false;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const h2 = child.querySelector && child.querySelector('h2');
    if (h2) {
      // If we have a previous section, push it
      if (currentTitle && currentContent.length) {
        accordionRows.push([
          currentTitle,
          currentContent
        ]);
      }
      currentTitle = h2;
      currentContent = [];
      inSection = true;
      continue;
    }
    if (inSection) {
      if (child.tagName === 'DIV' && child.classList.contains('aem-Grid')) {
        if (child.innerHTML.trim() === '') continue;
        Array.from(child.children).forEach((sub) => {
          if (
            sub.innerHTML.trim() !== '' &&
            !(sub.tagName === 'DIV' && sub.classList.contains('aem-Grid') && sub.innerHTML.trim() === '')
          ) currentContent.push(sub);
        });
      } else if (child.innerHTML.trim() !== '') {
        currentContent.push(child);
      }
    }
  }
  // Push last section if it has content
  if (currentTitle && currentContent.length) {
    accordionRows.push([
      currentTitle,
      currentContent
    ]);
  }

  // Remove any rows with empty content
  const filteredRows = accordionRows.filter(row => {
    if (Array.isArray(row[1])) {
      return row[1].length > 0;
    }
    return !!row[1];
  });

  // Table header (must be a single cell row)
  const headerRow = ['Accordion (accordion38)'];

  // Compose table cells
  const cells = [headerRow, ...filteredRows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
