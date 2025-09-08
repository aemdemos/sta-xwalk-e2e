/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Build table rows
  const headerRow = ['Tabs (tabs12)'];
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Defensive: Find the main contentfragment/article inside each panel
    let contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (!contentFragment) {
      // fallback: use panel itself
      contentFragment = panel;
    }

    // For tab content, reference the whole contentfragment/article element
    rows.push([label, contentFragment]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsRoot.replaceWith(block);
}
