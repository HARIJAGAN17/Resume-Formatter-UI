// generateResumeDocx.ts
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  SectionType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  VerticalAlign,
  BorderStyle,
  ImageRun,
} from "docx";
import { saveAs } from "file-saver";
import { UstLogoBase64Code } from "../assets/UstLogoBase64";

export const generateResumeDocx = async (data) => {
  const doc = new Document({
    sections: createStyledSections(data),
  });
  const buffer = await Packer.toBlob(doc);
  saveAs(
    buffer,
    `${data.name ? data.name.replace(/\s+/g, "_") + "_resume" : "resume"}.docx`
  );
};

const allNone = {
  top: BorderStyle.NONE,
  bottom: BorderStyle.NONE,
  left: BorderStyle.NONE,
  right: BorderStyle.NONE,
};

const createStyledSections = (data) => {
  const leftContent = [];

  if (data.technicalExpertise) {
    leftContent.push(createSectionHeading("Technical Expertise:", "FFFFFF"));
    Object.entries(data.technicalExpertise).forEach(([category, items]) => {
      leftContent.push(
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 100, after: 100, line: 300 },
          indent: { left: 200 },
          children: [
            new TextRun({
              text: `• ${category}: `,
              bold: true,
              color: "FFFFFF",
              font: "Arial",
              size: 20,
            }),
            new TextRun({
              text: Array.isArray(items) ? items.join(", ") : items,
              color: "FFFFFF",
              font: "Arial",
              size: 20,
            }),
          ],
        })
      );
    });
  }

  if (Array.isArray(data.certifications) && data.certifications.length > 0) {
    leftContent.push(createSectionHeading("Certifications:", "FFFFFF"));
    data.certifications.forEach((cert) => {
      leftContent.push(
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 100, after: 100, line: 300 },
          indent: { left: 200 },
          children: [
            new TextRun({
              text: `• ${cert}`,
              color: "FFFFFF",
              font: "Arial",
              size: 20,
            }),
          ],
        })
      );
    });
  }

  const rightContent = [];

  if (Array.isArray(data.summary) && data.summary.length > 0) {
    rightContent.push(createSectionHeading("Professional Summary:", "000000"));
    data.summary.forEach((item) => {
      rightContent.push(
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { after: 150 },
          indent: { left: 180, hanging: 180 },
          children: [
            new TextRun({
              text: "• ",
              bold: true,
              font: "Arial",
              size: 20,
            }),
            new TextRun({ text: item, font: "Arial", size: 20 }),
          ],
        })
      );
    });
  }

  const headerTable = createHeader(data.name);
  const contentTable = createMainTable(leftContent, rightContent);

  const experienceAndEducation = createExperienceAndEducation(data);

  return [
    {
      properties: {
        page: { margin: { top: 0, bottom: 0, left: 0, right: 0 } },
      },
      children: [headerTable, new Paragraph({ spacing: { before: 400 } })],
    },
    {
      properties: {
        type: SectionType.CONTINUOUS,
        page: { margin: { top: 0, bottom: 0, left: 0, right: 0 } },
      },
      children: [contentTable],
    },
    {
      children: experienceAndEducation,
    },
  ];
};

const createExperienceAndEducation = (data) => {
  const content = [];

  content.push(
    new Paragraph({
      spacing: { before: 300, after: 300 },
      children: [
        new TextRun({
          text: "Professional Experience",
          bold: true,
          color: "000000",
          size: 32,
          font: "Arial",
        }),
      ],
    })
  );

  data.experience.forEach((exp) => {
    if (exp.company) {
      content.push(createLabeledTextParagraph("Company", exp.company));
    }
    if (exp.date) {
      content.push(createLabeledTextParagraph("Date", exp.date));
    }
    if (exp.role) {
      content.push(createLabeledTextParagraph("Role", exp.role));
    }
    if (exp.clientEngagement) {
      content.push(
        createLabeledTextParagraph("Client Engagement", exp.clientEngagement)
      );
    }
    if (exp.program) {
      content.push(createLabeledTextParagraph("Program", exp.program));
    }

    if (
      Array.isArray(exp.responsibilities) &&
      exp.responsibilities.length > 0
    ) {
      content.push(
        new Paragraph({
          spacing: { after: 150 },
          indent: { left: 150 },
          children: [
            new TextRun({
              text: "RESPONSIBILITIES:",
              bold: true,
              size: 22,
              font: "Arial",
            }),
          ],
        })
      );
      exp.responsibilities.forEach((resp) => {
        content.push(
          new Paragraph({
            spacing: { after: 100 },
            indent: { left: 200 },
            children: [
              new TextRun({ text: "• ", bold: true, font: "Arial" }),
              new TextRun({ text: resp, size: 20, font: "Arial" }),
            ],
          })
        );
      });
    }

    content.push(new Paragraph({ children: [] }));
  });

  if (Array.isArray(data.education) && data.education.length > 0) {
    content.push(createSectionHeading("Education", "000000"));
    data.education.forEach((edu) => {
      if (edu.degree && edu.university) {
        content.push(
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 100, after: 200 },
            indent: { left: 300 },
            children: [
              new TextRun({
                text: `• ${edu.degree} from ${edu.university}`,
                color: "000000",
                font: "Arial",
                size: 20,
              }),
            ],
          })
        );
      }
    });
  }

  return content;
};

const createHeader = (name) => {
  const base64String = UstLogoBase64Code.split(",")[1];
  const binary = atob(base64String);
  const imageBytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    imageBytes[i] = binary.charCodeAt(i);
  }

  return new Table({
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 20, type: WidthType.PERCENTAGE },
            shading: { fill: "241E20" },
            borders: allNone,
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                indent: { left: 700 },
                children: [
                  new ImageRun({
                    data: imageBytes,
                    transformation: { width: 100, height: 100 },
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 80, type: WidthType.PERCENTAGE },
            shading: { fill: "241E20" },
            borders: allNone,
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                indent: { left: 900 },
                children: [
                  new TextRun({
                    text: name || "YOUR NAME",
                    bold: true,
                    color: "FFFFFF",
                    size: 60,
                    font: "Arial",
                  }),
                ],
              }),
            ],
          }),
        ],
        height: { value: 2000, rule: "exact" },
      }),
    ],
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: allNone,
  });
};

const createMainTable = (leftContent, rightContent) =>
  new Table({
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 3, type: WidthType.PERCENTAGE },
            children: [new Paragraph("")],
            borders: allNone,
          }),
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            shading: { fill: "166a6a" },
            children: leftContent,
            margins: { top: 240, bottom: 240, left: 240, right: 240 },
            borders: allNone,
          }),
          new TableCell({
            width: { size: 60, type: WidthType.PERCENTAGE },
            children: rightContent,
            margins: { top: 160, bottom: 240, left: 240, right: 240 },
            borders: allNone,
          }),
          new TableCell({
            width: { size: 5, type: WidthType.PERCENTAGE },
            children: [new Paragraph("")],
            borders: allNone,
          }),
        ],
      }),
    ],
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: allNone,
  });

const createSectionHeading = (title, color = "000000") =>
  new Paragraph({
    spacing: { after: 150, before: 300 },
    children: [
      new TextRun({
        text: title,
        bold: true,
        color: color,
        size: 28,
        font: "Arial",
      }),
    ],
  });

const createLabeledTextParagraph = (label, value) =>
  new Paragraph({
    children: [
      new TextRun({
        text: `• ${label}: `,
        size: 22,
        font: "Arial",
        bold: true,
      }),
      new TextRun({ text: value, size: 20, font: "Arial" }),
    ],
  });
