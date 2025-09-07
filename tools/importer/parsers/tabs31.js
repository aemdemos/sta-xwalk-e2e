/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (content)
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build rows: [Tab Label, Tab Content]
  const rows = tabLabels.map((tab, i) => {
    const label = tab.textContent.trim();
    const panel = tabPanels[i];
    let content = '';
    if (panel) {
      // Use the entire panel content, referencing the actual DOM node
      content = panel;
    }
    return [label, content];
  });

  // Table header (must match block name exactly)
  const headerRow = ['Tabs (tabs31)'];
  const cells = [headerRow, ...rows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original tabs element with block table
  tabs.replaceWith(block);
}
