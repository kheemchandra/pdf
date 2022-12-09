import React, {useState} from 'react'
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
  let a = true;

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
  <div className="body" id="drop">
   <i className="fa fa-file-text-o pointer-none" aria-hidden="true"></i>
   <p className="pointer-none"><b>Drag and drop</b> files here <br /> or <a href="" id="triggerFile">browse</a> to begin the upload</p>
			<input type="file" multiple="multiple" />
  </div>
  <footer>
   <div className="divider">
    <span><>FILES</></span> 
   </div>
   <div className="list-files"> 
   </div>
			<button className="importar">UPDATE FILES</button>
  </footer>
 </div>
</div>
<Script src='/static/upload.js'></Script>

  </>

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
 