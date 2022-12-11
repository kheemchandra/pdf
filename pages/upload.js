import React, { useState, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import {useRouter} from "next/router"

import Tick from "../components/tick";

export default function HomePage() {
  const [file, setFile] = useState();
  const router = useRouter()

  function uploadHandler(e) {
    setFile(e.target.files[0]);
  }
  async function submitHandler() {
    event.preventDefault();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);

    const response = await axios.post("/api/convert/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setAvailable(true);
    console.log("Success!");
  }
  async function showText() {
    const response = await fetch("api/content", {
      method: "GET",
    });

    const data = await response.json();
    console.log("Data is ", data);
    setText(data.message);
  }

  // ==================START FUNCTION=========
  const [template, setTemplate] = useState();

  const inputRef = useRef();
  const dropRef = useRef();
  const footerRef = useRef();
  const importarRef = useRef();
  const fileRef = useRef();

  function handleFileSelect(evt) {
    const files = evt.target.files;

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
    importarRef.current.classList.add("active");

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
    footerRef.current.classList.add("hasFiles");
    dropRef.current.classList.remove("active");
  }

  function uploadMoreHandler(e) {
    setTemplate(null);
    footerRef.current.classList.remove("hasFiles");
    importarRef.current.classList.remove("active");
    setTimeout(() => {
      dropRef.current.classList.remove("hidden");
    }, 500);
  }

  function wrapperHandler(e) { 
    if(e.target === e.currentTarget){
      router.push('/')
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
              <span>FILE</span>
            </div>
            <div className="list-files">{template}</div>
            <button
              ref={importarRef}
              onClick={uploadMoreHandler}
              className="importar"
            >
              UPDATE FILES
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}
