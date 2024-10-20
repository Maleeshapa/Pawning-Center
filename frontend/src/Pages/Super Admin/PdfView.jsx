import React, { useState } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import Pdf from "./Pdf";

function PdfView() {
  const [showPDF, setShowPDF] = useState(false);

  const handleViewPDF = () => {
    setShowPDF(true);
  };

  return (
    <div>
      <button onClick={handleViewPDF}>View PDF</button>
      {showPDF && (
        <div style={{ height: "100vh", marginTop: "20px" }}>
          <PDFViewer width="100%" height="100%">
            <Pdf />
          </PDFViewer>
        </div>
      )}
    </div>
  );
}

export default PdfView;
