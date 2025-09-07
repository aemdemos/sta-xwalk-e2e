/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Only proceed if we have matching labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Build table rows: header first
  const rows = [
    ['Tabs (tabs39)']
  ];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Defensive: find the main content fragment/article inside the tab panel
    // We'll use the entire article or contentfragment div as the content cell
    let contentElem = panel.querySelector('article') || panel.querySelector('.contentfragment') || panel;
    rows.push([
      label,
      contentElem
    ]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the table
  tabsRoot.replaceWith(table);
}
