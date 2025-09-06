/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tab'));
  // Get tab panels (content)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));

  // Table header
  const headerRow = ['Tabs (tabs37)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((tabLabel, i) => {
    // Defensive: match tab panel by aria-controls/id
    let panel = tabPanels.find(
      p => p.id === tabLabel.getAttribute('aria-controls')
    );
    if (!panel) return;

    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Tab content: grab everything inside the panel
    // Defensive: some panels wrap content in a .contentfragment/article
    let content = null;
    const contentFragment = panel.querySelector('.contentfragment');
    if (contentFragment) {
      // Use the article if present, else the fragment itself
      const article = contentFragment.querySelector('article');
      content = article ? article : contentFragment;
    } else {
      // Fallback: use panel itself
      content = panel;
    }

    rows.push([labelText, content]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
