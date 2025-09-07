/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels (li elements)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Ensure labels and panels match
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Table header row: must match block name exactly
  const headerRow = ['Tabs (tabs25)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    // Defensive: Get corresponding panel
    const panel = tabPanels[i];
    if (!panel) continue;

    // Tab content: Use the entire tabpanel content, preserving all HTML and references
    // Prefer the .contentfragment/article inside the panel if present, else use the panel
    let tabContent = null;
    const cf = panel.querySelector('.contentfragment, article.cmp-contentfragment');
    if (cf) {
      tabContent = cf;
    } else {
      tabContent = panel;
    }
    rows.push([label, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
