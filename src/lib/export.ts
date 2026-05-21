import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun } from 'docx';

export const downloadFile = (content: Blob | string, filename: string, mimeType: string) => {
  const blob = typeof content === 'string' ? new Blob([content], { type: mimeType }) : content;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportToMarkdown = (markdown: string, templateId: string) => {
  downloadFile(markdown, `${templateId}-document.md`, 'text/markdown');
};

export const exportToText = (markdown: string, templateId: string) => {
  const text = markdown
    .replace(/#+\s/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '');
  downloadFile(text, `${templateId}-document.txt`, 'text/plain');
};

export const exportToPdf = async (elementId: string, templateId: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  try {
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = canvas.height * imgWidth / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${templateId}-document.pdf`);
  } catch (error) {
    console.error('Error generating PDF', error);
  }
};

export const exportToDocx = async (markdown: string, templateId: string) => {
  const paragraphs = markdown.split('\n').map(line => {
    if (line.startsWith('# ')) {
      return new Paragraph({
        children: [new TextRun({ text: line.replace('# ', ''), bold: true, size: 32 })],
        spacing: { before: 400, after: 200 }
      });
    } else if (line.startsWith('## ')) {
      return new Paragraph({
        children: [new TextRun({ text: line.replace('## ', ''), bold: true, size: 28 })],
        spacing: { before: 300, after: 150 }
      });
    } else {
      const parts = line.split('**');
      const textRuns = parts.map((part, index) => new TextRun({ text: part, bold: index % 2 === 1 }));
      return new Paragraph({ children: textRuns, spacing: { after: 120 } });
    }
  });

  const doc = new Document({
    sections: [{
      properties: {},
      children: paragraphs,
    }],
  });

  const blob = await Packer.toBlob(doc);
  downloadFile(blob, `${templateId}-document.docx`, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
};
