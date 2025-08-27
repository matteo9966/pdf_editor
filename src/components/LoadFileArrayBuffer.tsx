
interface Props {
    onLoad:(arrayBuffer:ArrayBuffer|null)=>void
}
export const LoadFileArrayBuffer = (props:Props)=>{
return <input
          type="file"
          id="pdf-input"
        
          onChange={async (event) => {
            const file = event.target.files?.[0];
            const fileNotPDF = file?.type !== "application/pdf";
            if (!file || fileNotPDF) {
              alert("Inserire un file PDF");
              return;
            }
            const readPDFAsArrayBufferPromise = new Promise<ArrayBuffer | null>(
              (res, rej) => {
                const reader = new FileReader();
                reader.readAsArrayBuffer(file);
                reader.onload = () => {
                  if (reader.result instanceof ArrayBuffer) {
                    res(reader.result);
                  } else {
                    rej(new Error("Invalid format of reader.result"));
                  }
                };
                reader.onerror = () => {
                  rej(reader.error);
                };
              }
            );

            try {
              const arrayBufferPdf = await readPDFAsArrayBufferPromise;
              if (arrayBufferPdf instanceof ArrayBuffer) {
                props.onLoad(arrayBufferPdf)

              } else {
              props.onLoad(null)
              }
            } catch (error) {
              alert(error);
            }
          }}
        />

}