/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (usually has class 'cmp-tabs')
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist > li')
  ).map(li => li.textContent.trim());

  // Get tab panels (content for each tab)
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: Only process as many panels as there are labels
  const rows = [];
  for (let i = 0; i < tabLabels.length && i < tabPanels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // For tab content, use the entire tabpanel div (preserves all structure)
    rows.push([label, panel]);
  }

  // Table header row as required
  const headerRow = ['Tabs (tabs28)'];
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with the new table
  tabsBlock.parentNode.replaceChild(block, tabsBlock);
}
