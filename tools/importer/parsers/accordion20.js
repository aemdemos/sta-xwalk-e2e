/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const cfArticle = element.querySelector('article.cmp-contentfragment');
  if (!cfArticle) return;

  const cfElements = cfArticle.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Compose header row with exactly one column
  const headerRow = ['Accordion (accordion20)'];
  const rows = [];

  // Helper to flatten grids and get all content elements in order
  function getContentElements(parent) {
    const result = [];
    parent.childNodes.forEach((node) => {
      if (node.nodeType === 1) {
        if (node.classList && node.classList.contains('aem-Grid')) {
          result.push(...getContentElements(node));
        } else {
          result.push(node);
        }
      }
    });
    return result;
  }

  const children = getContentElements(cfElements);

  // Find all h2.cmp-title__text elements and their indices
  const sectionIndices = [];
  children.forEach((child, idx) => {
    const h2 = child.querySelector && child.querySelector('h2.cmp-title__text');
    if (h2) {
      sectionIndices.push({ idx, h2 });
    }
  });

  // If there is intro content before the first h2, add it
  if (sectionIndices.length > 0 && sectionIndices[0].idx > 0) {
    const introContent = [];
    for (let i = 0; i < sectionIndices[0].idx; i++) {
      if (
        children[i].textContent.trim() !== '' &&
        (children[i].querySelector || children[i].textContent.trim() !== '')
      ) {
        introContent.push(children[i]);
      }
    }
    if (introContent.length > 0) {
      rows.push([
        'Introduction',
        introContent.length === 1 ? introContent[0] : introContent,
      ]);
    }
  }

  // For each section, collect title and content
  for (let i = 0; i < sectionIndices.length; i++) {
    const { idx, h2 } = sectionIndices[i];
    const nextIdx = (i + 1 < sectionIndices.length) ? sectionIndices[i + 1].idx : children.length;
    // Content cell is everything between idx+1 and nextIdx
    const contentCell = [];
    for (let j = idx + 1; j < nextIdx; j++) {
      if (
        children[j].textContent.trim() !== '' &&
        (children[j].querySelector || children[j].textContent.trim() !== '')
      ) {
        contentCell.push(children[j]);
      }
    }
    // Only add the row if there is actual content for the section
    if (contentCell.length > 0) {
      rows.push([
        h2,
        contentCell.length === 1 ? contentCell[0] : contentCell,
      ]);
    }
  }

  // Compose the table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
