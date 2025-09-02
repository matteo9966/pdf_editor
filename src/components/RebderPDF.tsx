import { pdfjs, Document, Page } from "react-pdf";
import { useMemo, useRef, useState } from "react";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import type { PDFDocumentProxy} from 'pdfjs-dist';
import { useResizeObserver } from "../utils/useResizeObserver";

export const RenderPDF = () => {
//   const [containerRef,setContainerRef] = useState<HTMLElement|null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [numPages] = useState<number>();
  const [pageNumber] = useState<number>(1);
  const [pdfProxy,setPdfProxy] = useState<PDFDocumentProxy|null>(null);
 
  const objURL = useMemo(() => {
    if (!selectedFile) return null;
    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);
  
  const {width} = useResizeObserver({ref:ref,box:'border-box'})
  

  
 

  return (
    <div>
      <input
        type="file"
        id="pdf-toload"
        onChange={async (e) => {
          const file = e?.target?.files?.[0];
          const isPDF = file?.type?.includes?.("pdf");
          if (!isPDF || !file) {
            return;
          }
          setSelectedFile(file);
        }}
      />
      <div ref={ref}>
      {selectedFile ? (
        <Document file={objURL} onLoadSuccess={(pdf)=>{
            setPdfProxy(pdf);
            pdf.getFieldObjects().then(fields=>console.log({fields}));
            pdf.getData().then(data=>console.log({data}))
            pdf.saveDocument().then(data=>console.log(data));
            console.log(pdf)
        
        }} >
            {
                Array.from(new Array(numPages),(_el,index)=>(
                    <Page 
                     key={`page_${index+1}`}
                     pageNumber={index+1}
                     renderForms
                     renderAnnotationLayer
                     width={width}
                    ></Page>
                ))
            }
        </Document>
      ) : null}

      </div>
      <p>
        Page {pageNumber} of {numPages}
      </p>
      <div>
        <button onClick={async ()=>{
            if(!pdfProxy){
                alert("Qualcosa è andato storto :(");
                return
            }
try {
    const fields =await pdfProxy.getFieldObjects();
    const data:Record<string,any> = {}
    for(let name of Object.keys(fields||{})){
        const value = (document.getElementsByName(name).values().next().value as HTMLInputElement)?.value ||"";
        data[name]=value;

    }
    alert(JSON.stringify(data,null,2))
   console.log(data); 
} catch (error) {
    console.error(error);
}
       
        }}>SAVE PDF</button>
      </div>
    </div>
  );
};
