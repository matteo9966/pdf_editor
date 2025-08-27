import download from "downloadjs";
import { PDFDocument, PDFForm } from "pdf-lib";
// import { useEffect, useState } from "react";

interface Props {
  arrayBuffer: ArrayBuffer;
  pdfDoc: PDFDocument | null;
}

export const GeneratePDFFROMJSON = (props: Props) => {
  // const [form, setFormValue] = useState<PDFForm | null>(null);

  // useEffect(() => {
  //   async function loadPDForm() {
  //     if (props.arrayBuffer) {
  //       const pdfDoc = await PDFDocument.load(props.arrayBuffer);
  //       // const formPDF = pdfDoc.geùtForm();
  //       // setFormValue(formPDF);
  //     }
  //   }
  //   loadPDForm();
  // }, [props.arrayBuffer]);

  function mapFormToInputs(form: PDFForm) {
    return form.getFields().map((field, i) => {
      return (
        <div key={i} className="field">
          <label htmlFor="">{field.getName()}</label>
          <input
            name={field.getName()}
            type="text"
            defaultValue={form.getTextField(field.getName()).getText()}
          />
        </div>
      );
    });
  }

  // use the file and create the form from the fields
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        for (let key of formData.keys()) {
          const value = formData.get(key)?.toString();

          console.log([key, value]);
          const form = props.pdfDoc?.getForm();
          if (!form) return;
          const textField = form.getTextField(key);
          console.log({ textField });

          textField.setText(value);
          // textField.updateAppearances()
        }
        const pdfBytes = await props.pdfDoc?.save();
        if (pdfBytes) {
          download(
            pdfBytes,
            "pdf-lib_modification_example.pdf",
            "application/pdf"
          );
        } else {
          alert("Documento generato non valido!");
        }
      }}
      className="form"
    >
      {props.pdfDoc?.getForm() ? mapFormToInputs(props.pdfDoc.getForm()) : null}
      <div className="action-area">
        <button
          type="submit"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          GENERATE PDF
        </button>
      </div>
    </form>
  );
};
