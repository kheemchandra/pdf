import React, { useState } from 'react'

import Link from "next/link";

import Upload from "../components/upload";

export default function HomePage() {
  const [overlay, setOverlay] = useState(false)

  const overlayHandler = (e) => {
    e.preventDefault()
    setOverlay(p => !p)
  }

  return  <>
    <header className="header container">
      <a href="" className="logo">
        pdf2html
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
            <a href="" className="btn">
            Convert
            </a>
            <Link href="/pdfs" className="btn" target="_blank">
            View pdf
            </Link>
        </div>
      </div>
    </div>
    {overlay && <Upload onOverlay={overlayHandler}/>} 
  </>;
}
