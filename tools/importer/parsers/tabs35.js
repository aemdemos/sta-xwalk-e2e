/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the tabs block by class
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element (may be nested)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tablist = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tablist) return;
  const tabLabels = Array.from(tablist.querySelectorAll('.cmp-tabs__tab'));

  // Get all tabpanels (content for each tab)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Table header row
  const headerRow = ['Tabs (tabs35)'];
  const rows = [headerRow];

  // For each tab, add a row: [Tab Label, Tab Content]
  tabLabels.forEach((tabLabel, i) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Tab panel content (may contain nested fragments)
    const tabPanel = tabPanels[i];
    // Defensive: get the main contentfragment/article if present, else use all children
    let tabContent;
    const contentFragment = tabPanel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      // Use the contentfragment's children except the title
      const fragChildren = Array.from(contentFragment.children).filter(child => {
        // Remove the h3 title
        return !(child.tagName === 'H3' && child.classList.contains('cmp-contentfragment__title'));
      });
      // If only one child, use it directly, else use all
      tabContent = fragChildren.length === 1 ? fragChildren[0] : fragChildren;
    } else {
      // Fallback: use all children of tabPanel
      tabContent = Array.from(tabPanel.children);
    }
    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
