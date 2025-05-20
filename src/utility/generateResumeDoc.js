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
  PageBreak,
  HeadingLevel,
} from "docx";
import { saveAs } from "file-saver";

export const generateResumeDocx = async (data) => {
  const doc = new Document({
    sections: createStyledSections(data),
  });
  console.log(data);
  const buffer = await Packer.toBlob(doc);
  saveAs(buffer, `${data.name ? data.name.replace(/\s+/g, '_') + '_resume' : 'resume'}.docx`);
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

  const ustLogoBase64 =
    "data:image/jpeg;base64,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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH//2Q==";
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
                indent: { left: 600 },
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
                    new TextRun({ text: "▪ ", bold: true, font: "Arial" }),
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
