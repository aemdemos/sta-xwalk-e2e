/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels (li elements)
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels (content)
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header (must match block name exactly)
  const headerRow = ['Tabs (tabs9)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((labelEl, idx) => {
    const label = labelEl.textContent.trim();
    const panel = tabPanels[idx];

    // Find the main content fragment/article inside the panel
    let tabContent = null;
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // fallback: use panel itself
      tabContent = panel;
    }

    rows.push([label, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs element with the block table
  tabs.replaceWith(block);
}
