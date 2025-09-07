/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from tablist
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get tab panels (content)
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build rows for each tab
  const rows = tabLabels.map((tabLabel, i) => {
    // Find corresponding tabpanel
    const panel = tabPanels[i];
    let tabContent = null;
    if (panel) {
      // Use the entire tabpanel content for resilience
      // Find the contentfragment/article inside
      const fragment = panel.querySelector('article') || panel;
      tabContent = fragment;
    } else {
      tabContent = document.createTextNode('');
    }
    // Tab label text
    const labelText = tabLabel.textContent.trim();
    return [labelText, tabContent];
  });

  // Table header
  const headerRow = ['Tabs (tabs29)'];
  const cells = [headerRow, ...rows];

  // Create table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
