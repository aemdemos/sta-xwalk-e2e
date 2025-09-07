/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels and tab panels
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Header row must match block name exactly
  const headerRow = ['Tabs (tabs23)'];
  const rows = [headerRow];

  // For each tab, build a row: [label, content]
  tabLabels.forEach((tabLabel) => {
    const tabPanelId = tabLabel.getAttribute('aria-controls');
    const tabPanel = tabsBlock.querySelector(`#${tabPanelId}`);
    if (!tabPanel) return;

    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Tab content: find the main contentfragment/article inside the tabpanel
    let tabContent = tabPanel.querySelector('article') || tabPanel;

    // Defensive: If no content, use empty string
    if (!tabContent || !tabContent.textContent.trim()) {
      rows.push([labelText, '']);
    } else {
      rows.push([labelText, tabContent]);
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
