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
} from "docx";
import { saveAs } from "file-saver";

export const generateResumeDocx = async (data) => {
  console.log(data);
  const doc = new Document({
    sections: createStyledSections(data),
  });

  const buffer = await Packer.toBlob(doc);
  saveAs(buffer, `${data.name || "resume"}.docx`);
};

const createStyledSections = (data) => {
  const leftContent = [];
  const rightContent = [];

  if (data.education && data.education.degree) {
    leftContent.push(createSectionHeading("Education:", "FFFFFF"));
    leftContent.push(
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({
            text: `${data.education.degree} from ${data.education.university}`,
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
          spacing: { line: 240 },
          indent: { left: 180, hanging: 180, right: 180 },
          children: [
            new TextRun({
              text: "▪ ",
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
          spacing: { line: 240 },
          indent: { left: 180, hanging: 180, right: 180 },
          children: [
            new TextRun({
              text: "▪ ",
              bold: true,
              color: "FFFFFF",
              spacing: { after: 200 },
              font: "Arial",
              size: 20,
            }),
            new TextRun({ text: `${cert}`, color: "FFFFFF", font: "Arial", size: 20 }),
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
              text: "▪ ",
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
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAABCCAYAAAAL1LXDAAAAAXNSR0IArs4c6QAAA7JJREFUaEPtW4111DAMliYANmgngE4ANwFlArgJoBPQm4DeBLQTlE5AmYAyAd2AbiDyBfle4vNfciZx3tnv3evrXWLpk+RPsuKwiJyQezwx85Pnt/ZrEXlORPjsDWZ+DN079jeV+YGIXhLRK0s+ZD4Q0R0z3zv1EpHfROQCfc/MqwjgayJ67wHMY0G57lPHfCYigE0ZAL9hZui4G7wEwCICT373RVMEPYCvTMQVD1g9+3MkWGOLHeglAPYtuZSw7l6DdX1eNGAROW/I6TYhZOFB8JCPgEFg70DCpQO+IqKPHsDb5vvLbibR8Aep4R6TPUBcl2aO0gGDqN4MzQIK/CsR3SyKpRvFvWlPmdeZa0NLoHQPfyKiLwEAMAi8mAy8dMBYh38S6BgVIUD/wN+GjVFtOUfRgKFxU0qGiMuHC6xtvN8rcYsHrKBReKDaGjrg+Stm3iyCpbvoRnraTHHNzGv8swgPG621EEGOdaaqiPvh6YsQ4AdmPgtNEkobTRhl3S1Z3kZ4o8B4PTDUVyHAj8x8GgE8qjAYuhAjOoDJ4XGUoTCAr7zENBsARq2Ki10D2ypnjovsYtA8eJEZ2ElKUyGy1u8AOET7yGcAvdf5EBEUBCgMXCPaPBhijGbPjiYD9OwxrmsOEYG3EXluvSIX4Ka2c6CtEwDH+okRx9quYYcAtNYruhy74l/1uHBFnrZ/ANaXwrYtsQS6HmP1PE0Jv4S1ieXmY2TTv/rVlJ/PFKTd47JFrA3glH1nKvjediz1Jvu6hMgbOnVLwrvUEdmZpE4eZfbUiTTyEMoI6RzjDDV2L1ceWM2A4NBVyNqeFRHkW4AOpZuQQcA70KvNNnvFwQgBmHDb7SrkcIdFXAALb8fybPe2Vi9l9l2W8VZDCvytWtZmPUMY2I6hTg027HMaQMtLEBka8aaPBfnmg0iDXt9ceiWXf0r5NCW4nIYycyUD/h/C55izAp7D6lPKrB6e0tpzyKoensPqU8qsHp7S2nPIqh6ew+pTyqwentLac8g6Pg9r72jMo4uQg9Dq6Z2PmsObLpnoS+fsGxkZWfvSOY1VAWeyZvVwJkMePM1RhnToBBu6lb5TNDd6jsJldTw99B4sOdhNB0wQzMORxx1ZHqkM1V0f08aa8l6DLxFw6LBaNC1WwN0QKzSkq4cdPOCtA2pI15D2HxCZKy3VNVzX8L8jxM53rpZIWt634bqe9h29WBzgoaWofX0FXHpaqh4eaIEa0sce0uh4+N79w2E0HOld1PgLGa5FbiKSBQEAAAAASUVORK5CYII=";
  const base64String = ustLogoBase64.split(",")[1];
  function base64ToUint8Array(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }
  const imageBytes = base64ToUint8Array(base64String);

  const headerTable = new Table({
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [
                  new ImageRun({
                    data: imageBytes,
                    transformation: { width: 60, height: 60 },
                  }),
                ],
                spacing: { before: 100, after: 100 },
              }),
            ],
            verticalAlign: VerticalAlign.TOP,
            shading: { fill: "000000" },
            borders: { top: BorderStyle.NONE, bottom: BorderStyle.NONE, left: BorderStyle.NONE, right: BorderStyle.NONE },
          }),
        ],
        height: { value: 1200, rule: "exact" },
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: data.name || "Your Name",
                    bold: true,
                    color: "FFFFFF",
                    size: 48,
                    font: "Arial",
                  }),
                ],
                spacing: { before: 100, after: 300 },
              }),
            ],
            verticalAlign: VerticalAlign.CENTER,
            shading: { fill: "000000" },
            borders: { top: BorderStyle.NONE, bottom: BorderStyle.NONE, left: BorderStyle.NONE, right: BorderStyle.NONE },
          }),
        ],
        height: { value: 1000, rule: "exact" },
      }),
    ],
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: BorderStyle.NONE,
      bottom: BorderStyle.NONE,
      left: BorderStyle.NONE,
      right: BorderStyle.NONE,
      insideHorizontal: BorderStyle.NONE,
      insideVertical: BorderStyle.NONE,
    },
  });

  const contentTable = new Table({
    rows: [
      new TableRow({
        children: [
          new TableCell({ width: { size: 5, type: WidthType.PERCENTAGE }, children: [new Paragraph("")], borders: allNone }),
          new TableCell({
            width: { size: 35, type: WidthType.PERCENTAGE },
            shading: { fill: "166a6a" },
            children: leftContent,
            margins: { top: 200, bottom: 200, left: 200, right: 200 },
            borders: allNone,
          }),
          new TableCell({
            width: { size: 60, type: WidthType.PERCENTAGE },
            children: rightContent,
            margins: { top: 200, bottom: 200, left: 200, right: 200 },
            borders: allNone,
          }),
          new TableCell({ width: { size: 5, type: WidthType.PERCENTAGE }, children: [new Paragraph("")], borders: allNone }),
        ],
      }),
    ],
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: allNone,
  });

  return [
    {
      properties: { page: { margin: { top: 0, bottom: 0, left: 0, right: 0 } } },
      children: [headerTable, new Paragraph({})],
    },
    {
      properties: { type: SectionType.CONTINUOUS, page: { margin: { top: 0, bottom: 0, left: 0, right: 0 } } },
      children: [contentTable],
    },
  ];
};

const createSectionHeading = (title, color = "000000") =>
  new Paragraph({
    spacing: { after: 150, before: 300 },
    children: [
      new TextRun({ text: title, bold: true, color: color, size: 28, font: "Arial" }),
    ],
  });

const allNone = {
  top: BorderStyle.NONE,
  bottom: BorderStyle.NONE,
  left: BorderStyle.NONE,
  right: BorderStyle.NONE,
};
