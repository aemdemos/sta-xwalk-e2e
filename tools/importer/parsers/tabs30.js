/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels (content)
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header must match block name exactly
  const headerRow = ['Tabs (tabs30)'];
  const rows = [headerRow];

  // For each tab, create a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Find the main content fragment inside the panel
    let contentFragment = panel.querySelector('.contentfragment, .cmp-contentfragment');
    let tabContent;
    if (contentFragment) {
      // Use the content fragment itself (preserves all HTML, images, headings, lists, etc)
      tabContent = contentFragment;
    } else {
      // Fallback: use the panel itself
      tabContent = panel;
    }

    rows.push([label, tabContent]);
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs element with the block
  tabs.replaceWith(block);
}
