import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import * as pdfjsViewer from 'pdfjs-dist/legacy/web/pdf_viewer';
import 'pdfjs-dist/web/pdf_viewer.css';
import React, { useRef, useState } from 'react';

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

function App() {
  const containerRef = useRef(null);
  const [pdfLibBytes, setPdfLibBytes] = useState(null);

  const loadPdf = async () => {
    const res = await fetch('http://localhost:3001/pdf/load');
    const arrayBuffer = await res.arrayBuffer();

    const pdfJsBytes = arrayBuffer.slice(0);
    const pdfLibCopy = arrayBuffer.slice(0);
    setPdfLibBytes(pdfLibCopy);

    const loadingTask = pdfjsLib.getDocument({ data: pdfJsBytes });
    const pdf = await loadingTask.promise;

    const eventBus = new pdfjsViewer.EventBus();
    const pdfViewer = new pdfjsViewer.PDFViewer({
      container: containerRef.current,
      eventBus,
      enableForms: true,
    });

    pdfViewer.setDocument(pdf);
    pdfViewer.currentScaleValue = 'page-width';
  };

  const savePdf = async () => {
    if (!pdfLibBytes) return;

    const pdfDoc = await PDFDocument.load(pdfLibBytes);
    const form = pdfDoc.getForm();

    form.getFields().forEach((field) => {
      const name = field.getName();
      const fieldType = field.constructor.name;
      const el = document.querySelector(`input[name="${name}"], textarea[name="${name}"]`);

      console.log(`🔍 Field: ${name}, Type: ${fieldType}`);

      if (!el) {
        console.log(`⚠️ No HTML element found for ${name}`);
        return;
      }

      // Text Field
      if (fieldType === 'PDFTextField') {
        console.log(`✏️ Setting text for ${name} to: ${el.value}`);
        field.setText(el.value || '');
      }

      // Checkbox Field
      else if (fieldType === 'PDFCheckBox') {
        const boxes = document.querySelectorAll(`input[name="${name}"]`);
        if (boxes.length === 1) {
          const singleBox = boxes[0];
          console.log(`☑️ Single checkbox "${name}" is ${singleBox.checked ? 'checked' : 'unchecked'}`);
          singleBox.checked ? field.check() : field.uncheck();
        } else {
          // Multiple checkboxes = option group (Yes/No/Unknown/NA)
          console.log(`📦 Checkbox group for ${name}`);
          boxes.forEach((box) => {
            console.log(` - [${box.value}] is ${box.checked ? '✅ checked' : '❌ unchecked'}`);
          });
          const selected = [...boxes].find((b) => b.checked);
          if (selected) {
            try {
              console.log(`👉 Trying to select "${selected.value}" for field "${name}"`);
              field.select(selected.value);
            } catch (e) {
              console.warn(`❌ Failed to select "${selected.value}" for "${name}":`, e.message);
            }
          } else {
            console.log(`⚠️ No option selected for checkbox group "${name}"`);
          }
        }
      }

      // Optional: PDFRadioGroup support
      else if (fieldType === 'PDFRadioGroup') {
        const selected = document.querySelector(`input[name="${name}"]:checked`);
        if (selected) {
          try {
            console.log(`🎯 Selecting radio option "${selected.value}" for "${name}"`);
            field.select(selected.value);
          } catch (e) {
            console.warn(`❌ Could not select radio value "${selected.value}" for ${name}`);
          }
        } else {
          console.log(`⚠️ No radio button selected for ${name}`);
        }
      }
    });

    const pdfBytes = await pdfDoc.save();
    await fetch('http://localhost:3001/pdf/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/pdf' },
      body: pdfBytes,
    });

    alert('✅ PDF saved to server!');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <button onClick={loadPdf}>Load PDF</button>
      <button onClick={savePdf} style={{ marginLeft: '1rem' }}>
        Save PDF
      </button>
      <div
        ref={containerRef}
        id="viewerContainer"
        style={{
          position: 'absolute',
          marginTop: '2rem',
          width: '100%',
          height: '700px',
          overflow: 'auto',
          border: '1px solid #ccc',
        }}
      >
        <div className="pdfViewer"></div>
      </div>
    </div>
  );
}

export default App;
