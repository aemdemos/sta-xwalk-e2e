/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build rows for each tab
  const rows = tabLabels.map((tabLabel, idx) => {
    // Defensive: get panel
    const panel = tabPanels[idx];
    if (!panel) return null;
    // Tab label text
    const label = tabLabel.textContent.trim();
    // Tab content: use the entire panel content
    // Find the main contentfragment inside the panel
    const contentFragment = panel.querySelector('.contentfragment, article, .cmp-contentfragment');
    // If not found, fallback to panel itself
    const content = contentFragment || panel;
    return [label, content];
  }).filter(Boolean);

  // Table header
  const headerRow = ['Tabs (tabs33)'];
  const cells = [headerRow, ...rows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
