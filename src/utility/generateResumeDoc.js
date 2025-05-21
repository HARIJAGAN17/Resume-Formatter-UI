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
  console.log(data);
  const buffer = await Packer.toBlob(doc);
  saveAs(
    buffer,
    `${data.name ? data.name.replace(/\s+/g, "_") + "_resume" : "resume"}.docx`
  );
};

const createStyledSections = (data) => {
  const leftContent = [];
  const rightContent = [];

  if (data.education && data.education.degree) {
    leftContent.push(createSectionHeading("Education:", "FFFFFF"));
    leftContent.push(
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { before: 100, after: 200, line: 300 },
        indent: { left: 300, hanging: 200 },
        children: [
          new TextRun({
            text: `• ${data.education.degree} from ${data.education.university}`,
            color: "FFFFFF",
            font: "Arial",
            size: 20,
          }),
        ],
      })
    );
  }

  if (data.technicalExpertise) {
    leftContent.push(createSectionHeading("Technical Expertise:", "FFFFFF"));
    Object.entries(data.technicalExpertise).forEach(([category, items]) => {
      leftContent.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { before: 100, after: 100, line: 300 },
          indent: { left: 300, hanging: 200 },
          children: [
            new TextRun({
              text: "• ",
              bold: true,
              color: "FFFFFF",
              font: "Arial",
              size: 20,
            }),
            new TextRun({
              text: `${category}: `,
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
          alignment: AlignmentType.JUSTIFIED,
          spacing: { before: 100, after: 100, line: 300 },
          indent: { left: 300, hanging: 200 },
          children: [
            new TextRun({
              text: "• ",
              bold: true,
              color: "FFFFFF",
              font: "Arial",
              size: 20,
            }),
            new TextRun({
              text: `${cert}`,
              color: "FFFFFF",
              font: "Arial",
              size: 20,
            }),
          ],
        })
      );
    });
  }

  if (Array.isArray(data.summary) && data.summary.length > 0) {
    rightContent.push(createSectionHeading("Professional Summary:", "000000"));
    data.summary.forEach((item) => {
      rightContent.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { line: 300 },
          indent: { left: 180, hanging: 180, right: 180 },
          children: [
            new TextRun({
              text: "• ",
              bold: true,
              spacing: { after: 200 },
              font: "Arial",
              size: 20,
            }),
            new TextRun({ text: item, font: "Arial", size: 20 }),
          ],
        })
      );
    });
  }

  const ustLogoBase64 = UstLogoBase64Code;
  const base64String = ustLogoBase64.split(",")[1];
  const base64ToUint8Array = (base64) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };
  const imageBytes = base64ToUint8Array(base64String);

  const headerTable = new Table({
    rows: [
      new TableRow({
        children: [
          // Logo Cell
          new TableCell({
            width: { size: 20, type: WidthType.PERCENTAGE },
            shading: { fill: "241E20" },
            borders: allNone,
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { before: 0, after: 0 },
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

          // Name Cell
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
                    text: data.name || "YOUR NAME",
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

  const contentTable = new Table({
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

  const experiencePage = [
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
    }),
    ...data.experience.flatMap((exp) => [
      ...(exp.company
        ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: "• Company: ",
                  size: 22,
                  font: "Arial",
                  bold: true,
                }),
                new TextRun({ text: exp.company, size: 20, font: "Arial" }),
              ],
            }),
          ]
        : []),
      ...(exp.date
        ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: "• Date: ",
                  size: 22,
                  font: "Arial",
                  bold: true,
                }),
                new TextRun({ text: exp.date, size: 20, font: "Arial" }),
              ],
            }),
          ]
        : []),
      ...(exp.role
        ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: "• Role: ",
                  size: 22,
                  font: "Arial",
                  bold: true,
                }),
                new TextRun({ text: exp.role, size: 20, font: "Arial" }),
              ],
            }),
          ]
        : []),
      ...(exp.clientEngagement
        ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: "• Client Engagement: ",
                  size: 22,
                  font: "Arial",
                  bold: true,
                }),
                new TextRun({
                  text: exp.clientEngagement,
                  size: 20,
                  font: "Arial",
                }),
              ],
            }),
          ]
        : []),
      ...(exp.program
        ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: "• Program: ",
                  size: 22,
                  font: "Arial",
                  bold: true,
                }),
                new TextRun({ text: exp.program, size: 20, font: "Arial" }),
              ],
              spacing: { after: 100 },
            }),
          ]
        : []),
      ...(Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0
        ? [
            new Paragraph({
              spacing: { after: 200 },
              children: [
                new TextRun({
                  text: "RESPONSIBILITIES:",
                  bold: true,
                  size: 22,
                  font: "Arial",
                }),
              ],
              indent: { left: 150 },
            }),
            ...exp.responsibilities.map(
              (resp) =>
                new Paragraph({
                  spacing: { after: 100 },
                  indent: { left: 200 },
                  children: [
                    new TextRun({ text: "• ", bold: true, font: "Arial" }),
                    new TextRun({ text: resp, size: 20, font: "Arial" }),
                  ],
                })
            ),
          ]
        : []),
      new Paragraph({ children: [new TextRun({ text: "" })] }),
    ]),
  ];

  return [
    {
      properties: {
        page: { margin: { top: 0, bottom: 0, left: 0, right: 0 } },
      },
      children: [
        headerTable,
        new Paragraph({
          spacing: {
            before: 500, // Adds 600 twips = ~0.42 inches
            after: 0,
          },
          children: [],
        }),
      ],
    },
    {
      properties: {
        type: SectionType.CONTINUOUS,
        page: { margin: { top: 0, bottom: 0, left: 0, right: 0 } },
      },
      children: [contentTable],
    },
    { children: experiencePage },
  ];
};

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

const allNone = {
  top: BorderStyle.NONE,
  bottom: BorderStyle.NONE,
  left: BorderStyle.NONE,
  right: BorderStyle.NONE,
};
