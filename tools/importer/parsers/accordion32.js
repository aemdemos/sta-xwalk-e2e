/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const mainArticle = element.querySelector('article.contentfragment');
  if (!mainArticle) return;

  // Find the contentfragment's elements container
  const cfElements = mainArticle.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Helper: get the main title (h3)
  const mainTitle = mainArticle.querySelector('.cmp-contentfragment__title');

  // Get all children of cmp-contentfragment__elements
  const children = Array.from(cfElements.children);

  // Prepare sections
  const sections = [];

  // Find all h2 divs (section titles)
  const h2Divs = children
    .map((div, idx) => ({div, idx}))
    .filter(({div}) => div.querySelector('h2'));

  // First section: everything before the first h2
  let firstH2Idx = h2Divs.length > 0 ? h2Divs[0].idx : children.length;
  const firstSectionContent = children.slice(0, firstH2Idx).filter(el => {
    // Remove empty grid wrappers and empty divs
    if (el.classList && el.classList.contains('aem-Grid')) return false;
    if (el.childNodes.length === 0 && el.textContent.trim() === '') return false;
    if (el.querySelector && el.querySelector('.aem-Grid') && el.textContent.trim() === '') return false;
    return true;
  });
  if (firstSectionContent.length > 0) {
    // Compose the content cell as a fragment to ensure all text is included
    const frag = document.createDocumentFragment();
    firstSectionContent.forEach(node => frag.appendChild(node.cloneNode(true)));
    sections.push({
      title: mainTitle.cloneNode(true),
      content: frag,
    });
  }

  // Subsequent sections: each h2 and its following siblings until the next h2
  for (let i = 0; i < h2Divs.length; i++) {
    const {div: h2Div, idx: startIdx} = h2Divs[i];
    const endIdx = i + 1 < h2Divs.length ? h2Divs[i + 1].idx : children.length;
    const sectionContent = children.slice(startIdx + 1, endIdx).filter(el => {
      if (el.classList && el.classList.contains('aem-Grid')) return false;
      if (el.childNodes.length === 0 && el.textContent.trim() === '') return false;
      if (el.querySelector && el.querySelector('.aem-Grid') && el.textContent.trim() === '') return false;
      return true;
    });
    if (sectionContent.length > 0) {
      const frag = document.createDocumentFragment();
      sectionContent.forEach(node => frag.appendChild(node.cloneNode(true)));
      sections.push({
        title: h2Div.cloneNode(true),
        content: frag,
      });
    }
  }

  // Build the Accordion table
  const headerRow = ['Accordion (accordion32)'];
  const rows = [headerRow];

  sections.forEach(({ title, content }) => {
    rows.push([
      title,
      content,
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
