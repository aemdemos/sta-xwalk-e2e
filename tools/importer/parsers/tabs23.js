/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Header row as per guidelines
  const headerRow = ['Tabs (tabs23)'];
  const rows = [headerRow];

  // Get tab labels (li elements)
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

  // Defensive: ensure tabPanels and tabLabels match
  for (let i = 0; i < tabLabels.length && i < tabPanels.length; i++) {
    // Tab label text
    const label = tabLabels[i].textContent.trim();
    // Tab content: reference the contentfragment/article inside the tabpanel
    let content = tabPanels[i].querySelector('article');
    if (!content) {
      // fallback: use the tabpanel itself if no article
      content = tabPanels[i];
    }
    rows.push([label, content]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
