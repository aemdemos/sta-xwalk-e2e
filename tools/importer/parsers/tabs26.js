/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Table header
  const headerRow = ['Tabs (tabs26)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    // Defensive: If panel is missing, skip
    if (!panel) continue;

    // Tab content: Use the entire tabpanel content
    // Defensive: Remove aria-hidden panels if needed (but keep all for import)
    // We want the contentfragment/article inside the panel
    let tabContent = null;
    // Usually there's a .contentfragment > article
    const contentFragment = panel.querySelector('article');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // Fallback: Use panel itself
      tabContent = panel;
    }

    rows.push([label, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs element with the block
  tabs.replaceWith(block);
}
