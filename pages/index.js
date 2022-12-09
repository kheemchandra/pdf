import React, {useState, useRef} from 'react'
import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'



export default function HomePage() {
  const [file, setFile] = useState()  
  const [available, setAvailable] = useState(false)
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
  async function showText() {
    const response = await fetch('api/content', {
      method: 'GET'
    })

    const data = await response.json()
    console.log('Data is ', data)
    setText(data.message)
  } 

  // ==================START FUNCTION=========
  const [template, setTemplate] = useState()
  
  const inputRef = useRef()
  const dropRef = useRef()
  const footerRef = useRef()
  const importarRef = useRef()

  // let template
  function handleFileSelect(evt) {
		const files = evt.target.files; // FileList object
    console.log('Hi there !')
		//files template
		let temp =  (<div className="file">
     <div className="name"><span>{files[0].name}</span></div>
     <div className={`progress ${!available ? 'active': ''}`}></div>
     <div className={`done ${available ? 'anim': ''}`}>
	<a href="" target="_blank">
      <img src="/icons/tick.svg"/>
						</a>
     </div>
    </div> )

    
		dropRef.current.classList.add("hidden");
		footerRef.current.classList.add("hasFiles");
		importarRef.current.classList.add("active");
		setTimeout(() => {
			// $(".list-files").innerHTML = template;
      setTemplate(temp)
		}, 1000);

    setTimeout(() => {
			// $(".list-files").innerHTML = template;
      setAvailable(true)
		}, 2000);

		Object.keys(files).forEach(file => {
      /*** NOT SOLVED YET!! */
			let load = 2000 + (file * 2000); // fake load
			// setTimeout(() => {
			// 	$(`.file--${file}`).querySelector(".progress").classList.remove("active");
			// 	$(`.file--${file}`).querySelector(".done").classList.add("anim");
			// }, load);
		});
	}

  function uploadFileHandler(e) {
    e.preventDefault()
    console.log('I am working!')
    inputRef.current.click()
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
    footerRef.current.classList.add("active");
    dropRef.current.classList.remove("active");
  }

  function uploadMoreHandler(e) {
    setTemplate([])
    footerRef.current.classList.remove("hasFiles");
		importarRef.current.classList.remove("active");
		setTimeout(() => {
			dropRef.current.classList.remove("hidden");
		}, 500);
  }


  // ==================END FUNCTION==========

  return <>
  
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
			<input ref={inputRef} type="file" multiple onChange={handleFileSelect}/>
			{/* <input type="file" multiple="multiple" /> */}
  </div>
  <footer ref={footerRef}>
   <div className="divider">
    <span><>FILES</></span> 
   </div>
   <div className="list-files">{template}</div>
			<button ref={importarRef} onClick={uploadMoreHandler} className="importar">UPDATE FILES</button>
  </footer>
 </div>
</div>
{/* <Script src='/static/upload.js'></Script> */}

  </>

  // ===================== CODE-END =====================

  return <div>
    <Image style={{border: '1px solid red', borderRadius: '10px'}} src='/static/dog.png' width={250} height={150} alt='Good Doggy'/>
    <form onSubmit={submitHandler}>
      <div>
        <label htmlFor="pdf">Select a pdf</label>
        <input id="pdf" type="file" onChange={uploadHandler} required/>
      </div>
      <button type='submit'>Convert</button>
    </form> 
    <br/>  
    <Link classNameName={styles['pdf']} href="/pdfs" target="_blank">
      View pdf
    </Link> 
     
  </div>
}
 