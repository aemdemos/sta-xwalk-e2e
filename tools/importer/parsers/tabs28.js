/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) {
    const minLen = Math.min(tabLabels.length, tabPanels.length);
    tabLabels.length = minLen;
    tabPanels.length = minLen;
  }

  // Build table rows
  const headerRow = ['Tabs (tabs28)'];
  const rows = [headerRow];

  tabLabels.forEach((label, idx) => {
    const panel = tabPanels[idx];
    if (!panel) return;
    // Reference the contentfragment/article inside the panel if present
    let tabContent = panel.querySelector('article.cmp-contentfragment');
    if (!tabContent) {
      tabContent = panel;
    }
    rows.push([label, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block element with the new table
  element.replaceWith(block);
}
