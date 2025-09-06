/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Header row for the table
  const headerRow = ['Tabs (tabs30)'];
  const rows = [headerRow];

  // Get all tab labels
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels (content)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Only process if counts match
  if (tabLabels.length !== tabPanels.length) return;

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // For each tab, extract the content fragment inside the tab panel
    // We'll use the entire content fragment/article as the content cell
    let contentCell = null;
    // Try to find the main content fragment/article inside the panel
    const article = panel.querySelector('article');
    if (article) {
      contentCell = article;
    } else {
      // fallback: use the whole panel
      contentCell = panel;
    }

    rows.push([label, contentCell]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the table
  tabsBlock.replaceWith(table);
}
