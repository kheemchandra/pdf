import React, { useState, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script"; 

import Tick from "./tick";
import { sendFormData } from '../utils/utils' 


export default function Upload(props) {
  const [file, setFile] = useState()
  const [template, setTemplate] = useState()
  
  const inputRef = useRef();
  const dropRef = useRef();
  const footerRef = useRef();
  const importRef = useRef();
  
  const fileRef = useRef(); 
 
  async function submitHandler() {  
    const response = await sendFormData(file)
    console.log('Success')
    props.onSetDone(true)
  } 

  function handleFileSelect(evt) {
    const files = evt.target.files;
    setFile(files[0]);
    props.onSetFile(files[0])

    let temp = (
      <div ref={fileRef} className="file">
        <div className="name">
          <span>{files[0].name}</span>
        </div>
        <div className="progress active"></div>
        <div className="done">
          <a href="" target="_blank">
            <Tick />
          </a>
        </div>
      </div>
    );

    dropRef.current.classList.add("hidden");
    footerRef.current.classList.add("hasFiles");
    importRef.current.classList.add("active");

    setTemplate(temp);

    setTimeout(() => {
      fileRef.current.querySelector(".progress").classList.remove("active");
      fileRef.current.querySelector(".done").classList.add("anim");
    }, 1000);
  }

  function uploadFileHandler(e) {
    e.preventDefault();
    inputRef.current.click();
  }

  function dragLeaveHandler(e) {
    e.preventDefault();
    dropRef.current.classList.remove("active");
  }
  function dragOverHandler(e) {
    e.preventDefault();
    dropRef.current.classList.add("active");
  }
  function dragEnterHandler(e) {
    e.preventDefault();
    dropRef.current.classList.add("active");
  }
  function dropHandler(e) {
    e.preventDefault();
    inputRef.current.files = e.dataTransfer.files;
    setFile(e.dataTransfer.files[0])
    props.onSetFile(e.dataTransfer.files[0])
    footerRef.current.classList.add("hasFiles");
    dropRef.current.classList.remove("active");
  }

  function uploadMoreHandler1(e) {
    setTemplate(null);
    footerRef.current.classList.remove("hasFiles");
    importRef.current.classList.remove("active");
    setTimeout(() => {
      dropRef.current.classList.remove("hidden");
    }, 500);
  }

  function wrapperHandler(e) { 
    if(e.target === e.currentTarget){
      props.onOverlay(e)
    } 
  }

  return (
    <div className="wrapper" onClick={wrapperHandler}>
      <div className="upload" >
        <div className="upload-files">
          <header>
            <p>
              <i className="fa fa-cloud-upload" aria-hidden="true"></i>
              <span className="up">up</span>
              <span className="load">load</span>
            </p>
          </header>
          <div
            id="drop"
            ref={dropRef}
            onDragLeave={dragLeaveHandler}
            onDragOver={dragOverHandler}
            onDragEnter={dragEnterHandler}
            onDrop={dropHandler}
            className="body"
          >
            <i className="fa fa-file-text-o pointer-none" aria-hidden="true"></i>
            <p className="pointer-none">
              <b>Drag and drop</b> files here <br /> or{" "}
              <a href="" id="triggerFile" onClick={uploadFileHandler}>
                browse
              </a>{" "}
              to begin the upload
            </p>
            <input
              ref={inputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
            />
            {/* <input type="file" multiple="multiple" /> */}
          </div>
          <footer ref={footerRef}>
            <div className="divider">
              {/* <span>OK!</span> */}
            </div>
            <div className="list-files">{template}</div>
            <button
              ref={importRef}
              onClick={submitHandler}
              className="importar"
            >
              CONVERT
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}
