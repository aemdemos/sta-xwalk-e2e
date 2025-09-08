/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tab'));

  // Get tab panels (content)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build table rows
  const rows = [];
  // Header row: must match block name exactly
  rows.push(['Tabs (tabs24)']);

  // For each tab, get label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    const panel = tabPanels[i];
    let content = '';
    if (panel) {
      // Defensive: Find the main contentfragment/article inside the panel
      const contentFragment = panel.querySelector('article') || panel.querySelector('.contentfragment');
      if (contentFragment) {
        // Reference the actual element, not clone or string
        content = contentFragment;
      } else {
        // Fallback: use all children of the panel
        content = Array.from(panel.childNodes);
      }
    }
    rows.push([label, content]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsRoot.replaceWith(block);
}
