/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main content area containing the article
  const mainContent = element.querySelector('main.container.responsivegrid.aem-GridColumn--tablet--12');
  if (!mainContent) return;

  // Find the contentfragment article (main story)
  const contentFragment = mainContent.querySelector('article.contentfragment');
  if (!contentFragment) return;

  // Get the title and author
  const titleBlock = mainContent.querySelector('.title .cmp-title__text');
  const authorBlock = mainContent.querySelector('.title + .title .cmp-title__text');

  // Prepare accordion rows
  const rows = [];
  const headerRow = ['Accordion (accordion31)'];
  rows.push(headerRow);

  // Helper: Find all accordion sections by looking for h2 titles in the contentfragment
  // Each section: title (h2), content (all elements until next h2 or end)
  const fragmentElements = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!fragmentElements) return;

  // Gather all children for parsing
  const children = Array.from(fragmentElements.children);

  // First, add the intro section (before any h2)
  let introContent = [];
  // Title (h1) and author (h4)
  if (titleBlock) introContent.push(titleBlock);
  if (authorBlock) introContent.push(authorBlock);
  // Main heading in fragment
  const mainHeading = contentFragment.querySelector('.cmp-contentfragment__title');
  if (mainHeading) introContent.push(mainHeading);
  // First paragraph(s) before any h2
  let pointer = 0;
  while (pointer < children.length && !children[pointer].querySelector('h2')) {
    introContent.push(children[pointer]);
    pointer++;
  }
  // Add intro row
  rows.push([
    'Introduction',
    introContent
  ]);

  // Now, for each h2 section
  while (pointer < children.length) {
    // Find next h2
    let sectionTitle = null;
    let sectionContent = [];
    // Find h2
    while (pointer < children.length && !children[pointer].querySelector('h2')) {
      pointer++;
    }
    if (pointer >= children.length) break;
    // Get h2 title
    const h2 = children[pointer].querySelector('h2');
    if (h2) {
      sectionTitle = h2.textContent.trim();
      sectionContent.push(children[pointer]);
      pointer++;
    }
    // Gather all content until next h2
    while (pointer < children.length && !children[pointer].querySelector('h2')) {
      sectionContent.push(children[pointer]);
      pointer++;
    }
    // Add row
    if (sectionTitle && sectionContent.length) {
      rows.push([
        sectionTitle,
        sectionContent
      ]);
    }
  }

  // Replace the original element with the accordion block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
