/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels (in order)
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map((li) => li.textContent.trim());

  // Get tab panels (in order)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: ensure tabLabels and tabPanels match
  if (tabLabels.length !== tabPanels.length) return;

  // Build table rows
  const rows = [];
  // Header row: block name as required
  rows.push(['Tabs (tabs30)']);

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Defensive: find the main content fragment/article in the tabpanel
    // Use the contentfragment's .cmp-contentfragment__elements if present, else the panel itself
    let content = null;
    const cf = panel.querySelector('article.cmp-contentfragment');
    if (cf) {
      // Use the .cmp-contentfragment__elements if present, else the article itself
      const cfElements = cf.querySelector('.cmp-contentfragment__elements');
      content = cfElements ? cfElements : cf;
    } else {
      // fallback: use the panel itself
      content = panel;
    }
    rows.push([label, content]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs root with the table
  tabsRoot.replaceWith(table);
}
