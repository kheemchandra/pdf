import React, { useState, useContext, useEffect } from 'react'
import Link from "next/link";

import Upload from "../components/upload";
import Two from '../components/two';
import { sendFormData } from '../utils/utils'

export default function HomePage() {
  const [overlay, setOverlay] = useState(false)  
  const [file, setFile] = useState()
  const [done, setDone] = useState(false)

  const overlayHandler = (e) => {
    e.preventDefault()
    setOverlay(p => !p)
  }

  async function convertHandler(e) {
    e.preventDefault() 
    const response = await sendFormData(file)
    console.log('Success!')
    setDone(true)
  } 

  useEffect(() => {
    if(done){
      setOverlay(false)
    }
  }, [done])

  useEffect(() => {
    if(file){
      setDone(false)
    }
  }, [file])
   

  return  <>
    <header className="header container">
      <a href="" className="logo">
        pdf<Two />&#160;&#xa0;&#xa0;html 
      </a>
      <nav>
        <a href="">HOME</a>
        <a href="">ABOUT</a>
        <a href="">SERVICES</a>
        <a href="">CONTACT</a>
      </nav>
    </header>
    <div className="container">
      <div className="intro"> 
        <h1 className="intro-title">
        PDF <br/>to HTML <br/> Conversion
        </h1>
        <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam
        numquam laborum ipsum, omnis soluta deserunt. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam
          numquam laborum ipsum, omnis soluta deserunt.
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam
        numquam laborum ipsum, omnis soluta deserunt. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam
          numquam laborum ipsum, omnis soluta deserunt.
        </p>
        <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam
        numquam laborum ipsum, omnis soluta deserunt. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam
          numquam laborum ipsum, omnis soluta deserunt.
        </p>
        <br />
        <div className="controls">
            <a href="" className="btn" onClick={overlayHandler}>
            Upload file
            </a> 
           {file && !done && <a href="" className="btn" onClick={convertHandler}>
            Convert
            </a>}
            {done && <Link href="/pdfs" className="btn" target="_blank">
            View pdf
            </Link>}
        </div>
      </div>
    </div>
    {overlay && <Upload onOverlay={overlayHandler} onSetFile={setFile} onSetDone={setDone}/>} 
  </>;
}
