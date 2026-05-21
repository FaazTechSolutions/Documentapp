import { CustomBlock } from '@/components/CustomDocumentEditor';

export const generateCustomMarkdown = (documentTitle: string, blocks: CustomBlock[]) => {
  let md = `# ${documentTitle}\n\n`;
  let css = '';

  blocks.forEach(block => {
    let styleStr = '';
    if (block.fontSize) styleStr += `font-size: ${block.fontSize} !important; `;
    if (block.color) styleStr += `color: ${block.color} !important; `;
    if (block.backgroundColor) styleStr += `background-color: ${block.backgroundColor} !important; `;
    if (block.align) styleStr += `text-align: ${block.align} !important; `;

    const className = `custom-block-${block.id}`;
    if (styleStr) {
      css += `.${className} { ${styleStr} }\n`;
    }

    if (block.type === 'header') {
      const level = block.headingLevel || '2';
      if (styleStr) {
        md += `<h${level} class="${className}">${block.value || block.label}</h${level}>\n\n`;
      } else {
        const hashes = '#'.repeat(Number(level));
        md += `${hashes} ${block.value || block.label}\n\n`;
      }
    } else if (block.type === 'textarea') {
      if (block.label) md += `**${block.label}**\n\n`;
      if (styleStr) {
        md += `<div class="${className}">\n\n${block.value || ''}\n\n</div>\n\n`;
      } else {
        md += `${block.value || ''}\n\n`;
      }
    } else if (block.type === 'text') {
      if (styleStr) {
        md += `<div class="${className}">\n\n**${block.label}:** ${block.value || ''}\n\n</div>\n\n`;
      } else {
        md += `**${block.label}:** ${block.value || ''}\n\n`;
      }
    } else if (block.type === 'file') {
      if (block.fileDataUrl) {
        const isImage = block.fileType?.startsWith('image/');
        if (block.label) md += `**${block.label}**\n\n`;
        if (isImage) {
          md += `<div class="${className}" style="margin: 1rem 0;"><img src="${block.fileDataUrl}" alt="${block.fileName || 'Image'}" style="max-width: 100%; height: auto; border-radius: 6px; border: 1px solid var(--border);" /></div>\n\n`;
        } else {
          md += `<div class="${className}" style="padding: 1rem; border: 1px dashed var(--border); border-radius: 8px; display: inline-flex; align-items: center; gap: 0.75rem; background: rgba(0,0,0,0.02); margin: 0.5rem 0;">\n`;
          md += `  <span style="font-size: 1.5rem;">📎</span>\n`;
          md += `  <div style="display: flex; flex-direction: column; align-items: flex-start;">\n`;
          md += `    <a href="${block.fileDataUrl}" download="${block.fileName || 'attachment'}" style="font-weight: 600; text-decoration: underline; color: var(--primary);">${block.fileName || 'Download Attachment'}</a>\n`;
          md += `    <span style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-top: 0.25rem;">Size: ${block.fileSize || 'Unknown'}</span>\n`;
          md += `  </div>\n`;
          md += `</div>\n\n`;
        }
      } else {
        if (block.label) md += `**${block.label}**\n\n`;
        md += `*No attachment uploaded*\n\n`;
      }
    } else if (block.type === 'bulleted-list') {
      if (block.label) md += `**${block.label}**\n\n`;
      const items = (block.value || '').split('\n');
      if (styleStr) {
        md += `<ul class="${className}">\n`;
        items.forEach(item => {
          if (item.trim()) md += `  <li>${item.trim()}</li>\n`;
        });
        md += `</ul>\n\n`;
      } else {
        items.forEach(item => {
          if (item.trim()) md += `* ${item.trim()}\n`;
        });
        md += `\n`;
      }
    } else if (block.type === 'numbered-list') {
      if (block.label) md += `**${block.label}**\n\n`;
      const items = (block.value || '').split('\n');
      if (styleStr) {
        md += `<ol class="${className}">\n`;
        items.forEach(item => {
          if (item.trim()) md += `  <li>${item.trim()}</li>\n`;
        });
        md += `</ol>\n\n`;
      } else {
        let count = 1;
        items.forEach(item => {
          if (item.trim()) {
            md += `${count}. ${item.trim()}\n`;
            count++;
          }
        });
        md += `\n`;
      }
    } else if (block.type === 'todo-list') {
      if (block.label) md += `**${block.label}**\n\n`;
      const items = (block.value || '').split('\n');
      items.forEach(item => {
        if (item.trim()) {
          md += `- [ ] ${item.trim()}\n`;
        }
      });
      md += `\n`;
    } else if (block.type === 'quote') {
      if (styleStr) {
        md += `<blockquote class="${className}" style="border-left: 4px solid var(--border); padding-left: 1rem; margin: 1rem 0; font-style: italic;">\n\n${block.value || ''}\n\n`;
        if (block.label) md += `<cite style="display: block; font-size: 0.875rem; font-style: normal; margin-top: 0.5rem; color: var(--text-muted);">— ${block.label}</cite>\n`;
        md += `</blockquote>\n\n`;
      } else {
        md += `> ${(block.value || '').replace(/\n/g, '\n> ')}\n`;
        if (block.label) md += `> \n> <cite>— ${block.label}</cite>\n`;
        md += `\n`;
      }
    } else if (block.type === 'callout') {
      const icon = block.label || '💡 Info';
      md += `<div class="${className}" style="padding: 1rem; border: 1px solid var(--border); border-left: 4px solid var(--primary); border-radius: 6px; background: rgba(2, 132, 199, 0.03); margin: 1rem 0; display: flex; flex-direction: column; gap: 0.5rem;">\n`;
      md += `  <div style="font-weight: 700; display: flex; align-items: center; gap: 0.5rem;">${icon}</div>\n`;
      md += `  <div>${block.value || ''}</div>\n`;
      md += `</div>\n\n`;
    } else if (block.type === 'code') {
      const lang = block.label || '';
      md += `\`\`\`${lang}\n${block.value || ''}\n\`\`\`\n\n`;
    } else if (block.type === 'toggle-header') {
      const level = block.headingLevel || '2';
      md += `<details style="margin: 1rem 0;">\n`;
      md += `  <summary style="cursor: pointer; outline: none; list-style: none;"><h${level} style="display: inline; margin: 0; cursor: pointer;">${block.label || 'Toggle Heading'}</h${level}></summary>\n`;
      md += `  <div style="padding-left: 1.5rem; margin-top: 0.5rem; border-left: 2px solid var(--border); color: var(--text-muted); font-size: 0.95rem;">\n\n`;
      md += `${block.value || ''}\n\n`;
      md += `  </div>\n`;
      md += `</details>\n\n`;
    } else if (block.type === 'page') {
      md += `<div style="margin: 0.5rem 0; padding: 0.75rem 1rem; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc; display: flex; align-items: center; gap: 0.75rem;">\n`;
      md += `  <span>📄</span> <strong><a href="${block.value || '#'}">${block.label || 'Subpage'}</a></strong>\n`;
      md += `</div>\n\n`;
    } else if (block.type === 'toggle-list') {
      md += `<details style="margin: 0.5rem 0;">\n`;
      md += `  <summary style="cursor: pointer; outline: none; font-weight: 500;">${block.label || 'Toggle List Item'}</summary>\n`;
      md += `  <div style="padding-left: 1.5rem; margin-top: 0.25rem; border-left: 2px solid #e2e8f0; color: #475569;">\n\n`;
      md += `${block.value || ''}\n\n`;
      md += `  </div>\n`;
      md += `</details>\n\n`;
    } else if (block.type === 'equation') {
      md += `<div style="margin: 1.5rem 0; text-align: center; font-size: 1.25rem; font-family: Georgia, serif; font-style: italic; background: #f8fafc; padding: 1.5rem 1rem; border: 1px solid #e2e8f0; border-radius: 8px;">\n`;
      md += `  $$\n  ${block.value || ''}\n  $$\n`;
      md += `</div>\n\n`;
    } else if (block.type === 'synced-block') {
      md += `<div style="margin: 1.25rem 0; border: 1px dashed #fca5a5; border-radius: 8px; padding: 1rem 1.25rem; background: #fff5f5; position: relative;">\n`;
      md += `  <span style="position: absolute; top: -0.6rem; right: 1rem; font-size: 0.65rem; background: #fee2e2; color: #ef4444; padding: 0.1rem 0.4rem; border-radius: 4px; font-weight: 600; border: 1px solid #fca5a5;">🔄 Synced Block</span>\n\n`;
      md += `${block.value || ''}\n\n`;
      md += `</div>\n\n`;
    } else if (block.type === 'table') {
      try {
        const grid: string[][] = JSON.parse(block.value || '[["",""],["",""]]');
        if (grid.length > 0) {
          let tableMd = '';
          if (styleStr) {
            tableMd += `<table class="${className}" style="width: 100%; border-collapse: collapse; margin: 1rem 0;">\n`;
            grid.forEach((row, rIdx) => {
              tableMd += `  <tr>\n`;
              row.forEach(cell => {
                const tag = rIdx === 0 ? 'th' : 'td';
                const cellBg = rIdx === 0 ? '#f8fafc' : 'transparent';
                const cellWeight = rIdx === 0 ? '600' : '400';
                tableMd += `    <${tag} style="border: 1px solid var(--border); padding: 0.65rem; text-align: left; background: ${cellBg}; font-weight: ${cellWeight};">${cell || ''}</${tag}>\n`;
              });
              tableMd += `  </tr>\n`;
            });
            tableMd += `</table>\n\n`;
          } else {
            grid.forEach((row, rIdx) => {
              tableMd += `| ${row.map(cell => (cell || '').replace(/\|/g, '\\|')).join(' | ')} |\n`;
              if (rIdx === 0) {
                tableMd += `| ${row.map(() => '---').join(' | ')} |\n`;
              }
            });
            tableMd += `\n`;
          }
          md += tableMd;
        }
      } catch (e) {
        md += `*Error rendering table*\n\n`;
      }
    } else if (block.type === 'date-time') {
      const dateVal = block.value ? new Date(block.value).toLocaleString() : 'No date set';
      if (styleStr) {
        md += `<div class="${className}" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.35rem 0.75rem; border: 1px solid var(--border); border-radius: 20px; background: rgba(0,0,0,0.02); font-size: 0.875rem; margin: 0.5rem 0;">📅 ${dateVal}</div>\n\n`;
      } else {
        md += `📅 **Date & Time:** ${dateVal}\n\n`;
      }
    }
  });

  if (css) {
    md = `<style>\n${css}</style>\n\n` + md;
  }

  return md.trim();
};
