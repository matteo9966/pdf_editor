import { useState } from "react";
// import pdfFile from "./assets/editable-pdf.pdf";
// import viteLogo from "/vite.svg";
import "./App.css";
import { PDFDocument, PDFForm } from "pdf-lib";
import { LoadFileArrayBuffer } from "./components/LoadFileArrayBuffer";
import { GeneratePDFFROMJSON } from "./components/GeneratePDFFromJSON";

function App() {
  const [formValue, setFormValue] = useState<PDFForm | null>(null);
  const [fileArrayBuffer, setFileArrayBuffer] = useState<ArrayBuffer | null>(
    null
  );
  const [pdfDoc,setPdfDoc] = useState<PDFDocument|null>(null)
  return (
    <div>
      <div>
        <h1>Carica Il File PDF:</h1>
        <LoadFileArrayBuffer
          onLoad={async (arrayBuffer) => {
            if (arrayBuffer) {
              try {
                setFileArrayBuffer(arrayBuffer);
                const pdfDocument = await PDFDocument.load(arrayBuffer);
                setPdfDoc(pdfDocument)
                const form = pdfDocument.getForm();
                setFormValue(form);
                
              } catch (error) {
                console.error("errore caricamento:",error)
              }
            }
          }}
        ></LoadFileArrayBuffer>
      </div>

      <h1>Esempio di form con valori da AcroFrom</h1>

      {fileArrayBuffer ? (
        <GeneratePDFFROMJSON
          arrayBuffer={fileArrayBuffer}
          pdfDoc={pdfDoc}
        ></GeneratePDFFROMJSON>
      ) : null}

      <h1>Esempio di lettura di un documento caricato con ACRO_FORM</h1>
      <div></div>
      {formValue ? (
        <div>
          <table>
            <caption>Contenuto del documento</caption>
            <thead>
              <tr>
                <th>Campo</th>
                <th>Valore</th>
              </tr>
            </thead>
            <tbody>
              {formValue.getFields().map((field, i) => {
                return (
                  <tr key={i}>
                    <th>{field.getName()}</th>
                    <td>{formValue.getTextField(field.getName()).getText()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}

export default App;
