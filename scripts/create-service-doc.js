import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, HeadingLevel } from 'docx';
import { writeFileSync } from 'fs';
import { join } from 'path';

const doc = new Document({
  sections: [{
    properties: {},
    children: [
      new Paragraph({
        text: "Cleaning Service Logic & Admin Workflows",
        heading: HeadingLevel.TITLE,
        spacing: { after: 400 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "This document explains the business logic and workflows for the cleaning service platform, including the postcode checker, cleaner approval process, and handling of service requests when all cleaners are busy.",
            size: 22
          })
        ],
        spacing: { after: 400 }
      }),
      new Paragraph({
        text: "1. Postcode Checker Logic",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      }),
      new Paragraph({
        text: "Overview",
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "The postcode checker allows customers to verify whether cleaning services are available in their area before making a booking request.",
            size: 22
          })
        ],
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: "How It Works",
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "1. Admin Defines Service Areas", bold: true }),
          new TextRun({ text: "\n   • The admin uses the admin panel to add and manage locations/postcodes where cleaners are available to work.\n   • These locations represent the areas where the company's workers are assigned or willing to travel.", size: 22 })
        ],
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "2. Customer Checks Availability", bold: true }),
          new TextRun({ text: "\n   • On the customer-facing page, the user sees a postcode input field (e.g., placeholder: \"E.G. SW1A 1AA\").\n   • The customer enters their postcode and clicks the CHECK button.", size: 22 })
        ],
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "3. System Response", bold: true }),
          new TextRun({ text: "\n   • The system compares the entered postcode against the list of locations defined by the admin.\n   • If the postcode matches a service area: The customer is informed that cleaning services are available in their area. They can proceed with booking.\n   • If the postcode does not match: The customer is informed that cleaning services are not currently available in their area. They cannot book at this time.", size: 22 })
        ],
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Summary: ", bold: true }),
          new TextRun({ text: "Admin sets locations → Customer enters postcode → System tells them: \"Yes, we service your area\" or \"No, we don't service your area yet.\"", italic: true, size: 22 })
        ],
        spacing: { after: 400 }
      }),
      new Paragraph({
        text: "2. Cleaner Approval Workflow",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      }),
      new Paragraph({
        text: "Overview",
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "When a new cleaner registers or applies, they appear in the admin panel with a status (e.g., \"pending\"). The admin must approve them before they can be assigned to jobs.",
            size: 22
          })
        ],
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: "How It Works",
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "1. Cleaner Applies", bold: true }),
          new TextRun({ text: "\n   • A cleaner signs up and their details (name, email, etc.) appear in the admin panel.\n   • Their status is initially set to \"pending\".", size: 22 })
        ],
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "2. Admin Approves", bold: true }),
          new TextRun({ text: "\n   • The admin reviews the cleaner's profile and changes their status from \"pending\" to \"approved\" using the dropdown/status selector.", size: 22 })
        ],
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "3. Manual Contact After Approval", bold: true }),
          new TextRun({ text: "\n   • Once approved, the admin manually contacts the cleaner (via phone, email, or other means).\n   • The admin informs the cleaner about: their approval status, where they need to go for work (location/address), and any other relevant job details.", size: 22 })
        ],
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "4. Cleaner Goes to Work", bold: true }),
          new TextRun({ text: "\n   • The cleaner receives the instructions and travels to the assigned location to perform the cleaning service.", size: 22 })
        ],
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Summary: ", bold: true }),
          new TextRun({ text: "Admin approves cleaner → Admin manually contacts cleaner → Admin tells cleaner where to go → Cleaner goes to that location for work.", italic: true, size: 22 })
        ],
        spacing: { after: 400 }
      }),
      new Paragraph({
        text: "3. All Cleaners Busy – Request Handling",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      }),
      new Paragraph({
        text: "Overview",
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Sometimes a customer makes a cleaning request, but all cleaners are already assigned to other jobs and are unavailable.",
            size: 22
          })
        ],
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: "How It Works",
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "1. Customer Makes a Request", bold: true }),
          new TextRun({ text: "\n   • A customer submits a booking or service request for their area.", size: 22 })
        ],
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "2. All Cleaners Are Busy", bold: true }),
          new TextRun({ text: "\n   • The admin checks and finds that all cleaners are already on work (assigned to other jobs).\n   • No cleaner is available to take the new request.", size: 22 })
        ],
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "3. Admin Manually Contacts Customer", bold: true }),
          new TextRun({ text: "\n   • The admin manually contacts the customer (via phone, email, or message).\n   • The admin apologizes and explains: \"Sorry, we cannot book your cleaning at this time.\" \"All our cleaners are already assigned and working elsewhere.\"\n   • The admin may offer alternatives (e.g., suggest another date or add them to a waitlist).", size: 22 })
        ],
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Summary: ", bold: true }),
          new TextRun({ text: "Customer requests cleaning → All cleaners busy → Admin manually contacts customer → Admin apologizes: \"Sorry, we can't book because our cleaners are already working elsewhere.\"", italic: true, size: 22 })
        ],
        spacing: { after: 400 }
      }),
      new Paragraph({
        text: "Quick Reference Table",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Scenario", bold: true })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Who Acts", bold: true })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Action", bold: true })] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph("Postcode check")] }),
              new TableCell({ children: [new Paragraph("Admin defines areas → Customer enters postcode")] }),
              new TableCell({ children: [new Paragraph("System says: service available or not")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph("Cleaner approval")] }),
              new TableCell({ children: [new Paragraph("Admin approves → Admin contacts cleaner")] }),
              new TableCell({ children: [new Paragraph("Cleaner is told where to go for work")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph("All cleaners busy")] }),
              new TableCell({ children: [new Paragraph("Customer requests → All cleaners on work")] }),
              new TableCell({ children: [new Paragraph("Admin manually apologizes: can't book, cleaners busy")] })
            ]
          })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "This document describes the business logic and manual workflows for the cleaning service platform.", italic: true, size: 20 })
        ],
        spacing: { before: 400 }
      })
    ]
  }]
});

const buffer = await Packer.toBuffer(doc);
const outputPath = join(process.cwd(), 'docs', 'SERVICE_LOGIC_AND_WORKFLOWS.docx');
writeFileSync(outputPath, buffer);
console.log('Created:', outputPath);
