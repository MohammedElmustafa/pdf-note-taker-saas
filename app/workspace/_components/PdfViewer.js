import React from 'react'

function PdfViewer({fileUrl}){
    console.log(fileUrl);
  return (
    //<div className="border rounded-lg shadow p-4 bg-white">
    <div>
        <iframe src={fileUrl+"#toolbar=0"} height="90vh" width='100%' className='h-[90vh]'/>
    </div>
  )
}

export default PdfViewer