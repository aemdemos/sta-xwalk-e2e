/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const contentFragment = element.querySelector('.contentfragment article.cmp-contentfragment');
  if (!contentFragment) return;

  // Find the content root
  const elementsRoot = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsRoot) return;

  // Get all children in the content root
  const children = Array.from(elementsRoot.children);

  // Find all h2s (section titles)
  const h2s = children.filter(el => el.tagName === 'H2');

  // Find the intro content (before first h2)
  let introContent = [];
  let firstH2Idx = children.findIndex(el => el.tagName === 'H2');
  if (firstH2Idx > 0) {
    introContent = children.slice(0, firstH2Idx);
  }

  // Prepare rows
  const headerRow = ['Accordion (accordion16)'];
  const rows = [headerRow];

  // Add intro as first accordion item if present
  if (introContent.length > 0) {
    // Use h1 as intro title if available, else fallback
    let introTitle = element.querySelector('h1');
    if (!introTitle) {
      const cfTitle = contentFragment.querySelector('.cmp-contentfragment__title');
      if (cfTitle) {
        introTitle = cfTitle.cloneNode(true);
      } else {
        introTitle = document.createElement('span');
        introTitle.textContent = 'Introduction';
      }
    } else {
      introTitle = introTitle.cloneNode(true);
    }
    const introCell = document.createElement('div');
    introContent.forEach(el => introCell.appendChild(el.cloneNode(true)));
    rows.push([introTitle, introCell]);
  }

  // For each h2, collect its content until the next h2
  for (let i = 0; i < children.length; i++) {
    if (children[i].tagName === 'H2') {
      const title = children[i].cloneNode(true);
      const contentCell = document.createElement('div');
      let j = i + 1;
      while (j < children.length && children[j].tagName !== 'H2') {
        // Only add non-empty elements
        if (
          children[j].textContent.trim() !== '' ||
          (children[j].querySelector && children[j].querySelector('img'))
        ) {
          contentCell.appendChild(children[j].cloneNode(true));
        }
        j++;
      }
      // Always add the row, even if contentCell is empty (to match block structure)
      rows.push([title, contentCell]);
      i = j - 1;
    }
  }

  // Only output if we have at least one accordion item
  if (rows.length > 1) {
    const block = WebImporter.DOMUtils.createTable(rows, document);
    // Replace the WHOLE element (not just the contentfragment)
    element.replaceWith(block);
  }
}
