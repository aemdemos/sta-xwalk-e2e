/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block within the provided element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from the tablist (li elements)
  const tabLabels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(li => li.textContent.trim());

  // Get tab panels (content for each tab)
  const tabPanels = Array.from(
    tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: If mismatch, bail
  if (tabLabels.length !== tabPanels.length) return;

  // Build rows: header, then one row per tab (label, content)
  const rows = [];
  // Always use the required header row
  rows.push(['Tabs (tabs30)']);

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Defensive: clone the panel's children into a fragment to avoid moving them from DOM
    const frag = document.createDocumentFragment();
    // Only include the actual tab content, not the tabpanel wrapper
    // If the panel has a single .contentfragment child, use its children (to avoid extra wrappers)
    const contentFragment = panel.querySelector('.contentfragment');
    if (contentFragment) {
      Array.from(contentFragment.children).forEach(child => {
        frag.appendChild(child.cloneNode(true));
      });
    } else {
      // fallback: use all children of the panel
      Array.from(panel.children).forEach(child => {
        frag.appendChild(child.cloneNode(true));
      });
    }
    rows.push([label, frag]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs element with the new table
  tabs.replaceWith(table);
}
