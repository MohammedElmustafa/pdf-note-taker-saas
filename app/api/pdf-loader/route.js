import { NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

//const pdfUrl="https://acoustic-dolphin-224.convex.cloud/api/storage/1b665c90-268b-419c-8766-b6c110c046a1"

export async function GET (req) {
    
    const reqUrl=req.url;
    const {searchParams} = new URL(reqUrl);
    const pdfUrl = searchParams.get('pdfUrl');
    console.log(pdfUrl);
    //1. Load the PDF File
        const response=await fetch (pdfUrl);
        const data=await response.blob () ;
        const loader=new WebPDFLoader(data);
        const docs=await loader.load();

        let pafTextContent='';
        docs.forEach (doc=> {
            pafTextContent = pafTextContent + doc.pageContent;
        })

    //2. Split the Text into Small Chunks
        const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
        });
        const output = await splitter.createDocuments([pafTextContent]);
        let splitterList= [];
        output.forEach (doc=>{
            splitterList.push (doc.pageContent) ;
        })


    return NextResponse.json({result:splitterList})

}