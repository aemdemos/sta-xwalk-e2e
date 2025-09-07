/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a contributor fragment
  function extractCard(section) {
    // Defensive: find image
    const imgWrap = section.querySelector('.image .cmp-image');
    let img = null;
    if (imgWrap) {
      img = imgWrap.querySelector('img');
    }

    // Defensive: find all titles (name, role)
    const titleEls = section.querySelectorAll('.title .cmp-title__text');
    let name = null;
    let role = null;
    if (titleEls.length > 0) {
      name = titleEls[0];
      if (titleEls.length > 1) {
        role = titleEls[1];
      }
    }

    // Defensive: find social buttons
    const socialBlock = section.querySelector('.buildingblock');
    let socials = [];
    if (socialBlock) {
      const links = socialBlock.querySelectorAll('a.cmp-button');
      socials = Array.from(links);
    }

    // Compose text cell
    const textCell = document.createElement('div');
    if (name) {
      const nameClone = name.cloneNode(true);
      nameClone.style.marginBottom = '0.2em';
      textCell.appendChild(nameClone);
    }
    if (role) {
      const roleClone = role.cloneNode(true);
      roleClone.style.marginBottom = '0.5em';
      textCell.appendChild(roleClone);
    }
    if (socials.length > 0) {
      const socialDiv = document.createElement('div');
      socials.forEach(link => socialDiv.appendChild(link.cloneNode(true)));
      textCell.appendChild(socialDiv);
    }

    return [img, textCell];
  }

  // Find all contributor sections (cards)
  const cardSections = element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor');

  // Compose table rows
  const rows = [];
  const headerRow = ['Cards (cards24)'];
  rows.push(headerRow);

  cardSections.forEach(section => {
    const cardRow = extractCard(section);
    // Only add if image and text are present
    if (cardRow[0] && cardRow[1].textContent.trim().length > 0) {
      rows.push(cardRow);
    }
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
