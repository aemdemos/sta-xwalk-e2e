/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main tabs container
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from the tablist (ol > li)
  const tabLabels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(li => li.textContent.trim());

  // Get tab panels (div[data-cmp-hook-tabs="tabpanel"])
  const tabPanels = Array.from(
    tabs.querySelectorAll('div[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: ensure matching number of labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Build rows: header, then one row per tab
  const rows = [];
  // Header row as required
  rows.push(['Tabs (tabs36)']);

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Defensive: skip if panel missing
    if (!panel) continue;

    // For content, use the entire contentfragment/article inside the tabpanel if present
    let content = null;
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      content = contentFragment;
    } else {
      // fallback: use the panel's children
      content = Array.from(panel.childNodes);
    }
    rows.push([label, content]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs element with the table
  tabs.replaceWith(table);
}
