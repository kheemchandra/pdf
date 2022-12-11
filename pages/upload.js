import React, {useState, useRef} from 'react'
import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image' 
import { useRouter } from 'next/router'

import Tick from '../components/tick' 

export default function UploadPage() {
  const [file, setFile] = useState()  
  const router = useRouter()

  
  function uploadHandler(e) {
    setFile(e.target.files[0])
  }
  async function submitHandler() {
    event.preventDefault() 
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name)    

    const response = await axios.post('/api/convert/', formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })  
    setAvailable(true)
    console.log('Success!')
  } 

  // ==================START FUNCTION=========
  const [template, setTemplate] = useState()
  const [available, setAvailable] = useState(false)

  const inputRef = useRef()
  const dropRef = useRef()
  const footerRef = useRef()
  const importarRef = useRef()
  const fileRef = useRef()

  
  function handleFileSelect(evt) {
		const files = evt.target.files; // FileList object
    console.log('Hi there !', files[0])
		//files template
		let temp =  (<div ref={fileRef} className="file">
     <div className="name"><span>{files[0].name}</span></div>
     <div className="progress active"></div>
     <div className="done">
	<a href="" target="_blank">
    <Tick id="path"/>
  </a>
     </div>
    </div> )

    
		dropRef.current.classList.add("hidden");
		footerRef.current.classList.add("hasFiles");
		importarRef.current.classList.add("active"); 
    setTemplate(temp) 

    
    setTimeout(() => { 
      setAvailable(true)
      console.log('Are you alive?')
		}, 3000);

		Object.keys(files).forEach(file => {  
			setTimeout(() => {
				fileRef.current.querySelector(".progress").classList.remove("active");
				fileRef.current.querySelector(".done").classList.add("anim");
			}, 2000);
		});
	}

  function uploadFileHandler(e) {
    e.preventDefault()
    console.log('I am working!')
    inputRef.current.click()
    console.log('INput ref is ', inputRef.current)
  }     
  
  function dragLeaveHandler(e) {
    e.preventDefault()
    dropRef.current.classList.remove("active");
  }
  function dragOverHandler(e) {
    e.preventDefault()
    dropRef.current.classList.add("active");
  }
  function dragEnterHandler(e) {
    e.preventDefault()
    dropRef.current.classList.add("active");
  }
  function dropHandler(e) {
    e.preventDefault()
    inputRef.current.files = e.dataTransfer.files;
    footerRef.current.classList.add("hasFiles");
    dropRef.current.classList.remove("active");
  }

  function uploadMoreHandler(e) {
    setTemplate(null)
    footerRef.current.classList.remove("hasFiles");
		importarRef.current.classList.remove("active");
		setTimeout(() => {
			dropRef.current.classList.remove("hidden");
		}, 500);
  }

  function wrapperHandler(e) { 
    e.preventDefault()
    if(e.target === e.currentTarget){
       router.push('/')
    }
  }


  // ==================END FUNCTION==========

  return <div className="wrapper" onClick={wrapperHandler}>
  
  <div className="upload">
 <div className="upload-files">
  <header>
   <p>
    <i className="fa fa-cloud-upload" aria-hidden="true"></i>
    <span className="up">up</span>
    <span className="load">load</span>
   </p>
  </header>
  <div id="drop"
  ref={dropRef}
  onDragLeave={dragLeaveHandler}
  onDragOver={dragOverHandler}
  onDragEnter={dragEnterHandler}
  onDrop={dropHandler}
  className="body">
   <i className="fa fa-file-text-o pointer-none" aria-hidden="true"></i>
   <p className="pointer-none"><b>Drag and drop</b> files here <br /> or <a href="" id="triggerFile" onClick={uploadFileHandler}>browse</a> to begin the upload</p>
			<input ref={inputRef} onClick={() => console.log('Working fine!')} multiple type="file" onChange={handleFileSelect}/>
			{/* <input type="file" multiple="multiple" /> */}
      <label htmlFor='num'></label>
      <input id='num' type='number' />
  </div>
  <footer ref={footerRef}>
   <div className="divider">
    <span>FILE</span> 
   </div>
   <div className="list-files">{template}</div>
			<button ref={importarRef} onClick={uploadMoreHandler} className="importar">UPDATE FILES</button>
  </footer>
 </div>
</div> 

  </div>
}