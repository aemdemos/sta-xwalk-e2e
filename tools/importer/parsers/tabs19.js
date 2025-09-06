/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block container
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels
  const tabLabels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tablist > li')
  );
  // Get tab panels (content)
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: Only proceed if we have matching labels and panels
  if (!tabLabels.length || !tabPanels.length || tabLabels.length !== tabPanels.length) return;

  // Table header: must match block name exactly
  const headerRow = ['Tabs (tabs19)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    if (!label) continue;
    const panel = tabPanels[i];
    if (!panel) continue;

    // Find the main content inside the tab panel (skip empty wrappers)
    let content = null;
    // Prefer the first contentfragment/article if present
    const cf = panel.querySelector('article.cmp-contentfragment');
    if (cf) {
      content = cf;
    } else {
      // Otherwise, use the panel itself
      content = panel;
    }
    rows.push([label, content]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsContainer.replaceWith(table);
}
