/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist > li')
  ).map(li => li.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Compose rows: [Tab Label, Tab Content]
  const rows = tabLabels.map((label, idx) => {
    // Defensive: get panel, fallback to empty div
    const panel = tabPanels[idx] || document.createElement('div');
    // For content, use the entire tabpanel element
    return [label, panel];
  });

  // Table header
  const headerRow = ['Tabs (tabs32)'];
  const cells = [headerRow, ...rows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original tabs block with new table
  tabsBlock.parentNode.replaceChild(block, tabsBlock);
}
