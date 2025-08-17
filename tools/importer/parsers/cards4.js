/* global WebImporter */
export default function parse(element, { document }) {
  // Header row with exact block name
  const headerRow = ['Cards'];
  const rows = [];
  // Find the <ul> inside the .cards block
  const ul = element.querySelector('ul');
  if (ul) {
    // For each direct <li> child (each card)
    ul.querySelectorAll(':scope > li').forEach((li) => {
      // Image/Icon cell: div.cards-card-image (contains <picture> and <img>)
      const imgDiv = li.querySelector('.cards-card-image');
      // Text cell: div.cards-card-body (contains <p>, <strong>, description, etc)
      const textDiv = li.querySelector('.cards-card-body');
      rows.push([
        imgDiv,
        textDiv
      ]);
    });
  }
  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}