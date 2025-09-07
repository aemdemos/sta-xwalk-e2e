/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the tab labels (li elements inside ol[role=tablist])
  const tabList = tabsBlock.querySelector('ol[role="tablist"]');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li[role="tab"]'));

  // Find all tab panels (div[role=tabpanel])
  const tabPanels = Array.from(tabsBlock.querySelectorAll('div[role="tabpanel"]'));

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Table header: must match block name exactly
  const headerRow = ['Tabs (tabs7)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Defensive: find the main content inside the tab panel
    // Prefer the .contentfragment or article if present
    let content = null;
    const contentFragment = panel.querySelector('.contentfragment, article');
    if (contentFragment) {
      content = contentFragment;
    } else {
      // Fallback: use all children of the panel
      const children = Array.from(panel.children);
      if (children.length === 1) {
        content = children[0];
      } else {
        // If multiple, wrap in a div
        const wrapper = document.createElement('div');
        children.forEach(child => wrapper.appendChild(child));
        content = wrapper;
      }
    }
    rows.push([label, content]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
