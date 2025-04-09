// import {
//   Controller,
//   Get,
//   Post,
//   Req,
//   Res,
// } from '@nestjs/common';
// import { Request, Response } from 'express';
// import * as fs from 'fs';
// import * as path from 'path';

// @Controller('pdf')
// export class PdfController {
//   @Get('load')
//   getPdf(@Res() res: Response) {
//     const filePath = path.join(__dirname, '..', 'pdfs', 'example.pdf');
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Length', fs.statSync(filePath).size.toString());
//     res.setHeader('Cache-Control', 'no-store');

//     const stream = fs.createReadStream(filePath);
//     stream.pipe(res);
//   }

//   @Post('save')
//   async savePdf(@Req() req: Request, @Res() res: Response) {
//     const filePath = path.join(__dirname, '..', 'pdfs', 'example-updated.pdf');
//     const chunks: Buffer[] = [];

//     req.on('data', (chunk) => chunks.push(chunk));
//     req.on('end', () => {
//       const buffer = Buffer.concat(chunks);
//       fs.writeFileSync(filePath, buffer);
//       res.json({ message: '✅ PDF saved successfully' });
//     });
//   }
// }


//Below is updated 09/04/25
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

@Controller('pdf')
export class PdfController {
  @Get('load')
  getPdf(@Res() res: Response) {
    const filePath = path.join(__dirname, '..', 'pdfs', 'example.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="example.pdf"');
    res.setHeader('Cache-Control', 'no-store');
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  }
  
  @Post('save')
  async savePdf(@Req() req: Request, @Res() res: Response) {
    const filePath = path.join(__dirname, '..', 'pdfs', 'example.pdf');
    const chunks: Buffer[] = [];

    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      const buffer = Buffer.concat(chunks);
      fs.writeFileSync(filePath, buffer);
      res.json({ message: '✅ PDF saved successfully' });
    });
  }
}
