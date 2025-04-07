// import {
//   Controller,
//   Get,
//   Post,
//   Res,
//   Req,
// } from '@nestjs/common';
// import { Response, Request } from 'express';
// import * as fs from 'fs';
// import * as path from 'path';

// @Controller('pdf')
// export class PdfController {
//   @Get('load')
//   getPdf(@Res() res: Response) {
//     const filePath = path.join(__dirname, '..', 'pdfs', 'example.pdf');

//     // ✅ Correct way: Send as raw binary, not as downloadable or inline
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Length', fs.statSync(filePath).size.toString());
//     res.setHeader('Cache-Control', 'no-store');

//     const fileStream = fs.createReadStream(filePath);
//     fileStream.pipe(res);
//   }

//   @Post('save')
//   savePdf(@Req() req: Request, @Res() res: Response) {
//     const filePath = path.join(__dirname, '..', 'pdfs', 'example-updated.pdf');
//     const chunks: Buffer[] = [];

//     req.on('data', (chunk) => {
//       chunks.push(chunk);
//     });

//     req.on('end', () => {
//       const buffer = Buffer.concat(chunks);
//       fs.writeFileSync(filePath, buffer);
//       res.json({ message: 'PDF saved successfully' });
//     });
//   }
// }

import {
  Controller,
  Get,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import {
  PDFCheckBox,
  PDFDocument,
  PDFTextField,
} from 'pdf-lib';

@Controller('pdf')
export class PdfController {
  @Get('load')
  getPdf(@Res() res: Response) {
    const filePath = path.join(__dirname, '..', 'pdfs', 'example.pdf');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', fs.statSync(filePath).size.toString());
    res.setHeader('Cache-Control', 'no-store');

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }

  @Post('save')
  async savePdf(@Req() req: Request, @Res() res: Response) {
    const chunks: Buffer[] = [];

    req.on('data', (chunk) => chunks.push(chunk));

    req.on('end', async () => {
      try {
        const raw = Buffer.concat(chunks);
        const body = JSON.parse(raw.toString());

        const pdfPath = path.join(__dirname, '..', 'pdfs', 'example.pdf');
        const originalPdf = fs.readFileSync(pdfPath);

        const pdfDoc = await PDFDocument.load(originalPdf);
        const form = pdfDoc.getForm();

        const fields = form.getFields();

        console.log('🧾 Incoming fields:', body.fields);

        for (const fieldData of body.fields) {
          const matchingField = fields.find(
            (f) => f.getName().trim().toLowerCase() === fieldData.name.trim().toLowerCase()
          );

          if (!matchingField) {
            console.warn(`⚠️ Field "${fieldData.name}" not found in PDF`);
            continue;
          }

          // 🧠 Type-safe setting
          if (fieldData.type === 'PDFTextField' && 'setText' in matchingField) {
            (matchingField as PDFTextField).setText(fieldData.value ?? '');
          }

          if (fieldData.type === 'PDFCheckBox' && 'check' in matchingField) {
            const checkbox = matchingField as PDFCheckBox;
            fieldData.value === 'Yes' ? checkbox.check() : checkbox.uncheck();
          }
        }

        const savedPdf = await pdfDoc.save();
        const savePath = path.join(__dirname, '..', 'pdfs', 'example-updated.pdf');
        fs.writeFileSync(savePath, savedPdf);

        return res.json({ message: '✅ PDF saved successfully' });
      } catch (err) {
        console.error('❌ Failed to save PDF:', err);
        return res.status(500).json({ error: 'Failed to save PDF' });
      }
    });
  }
}
