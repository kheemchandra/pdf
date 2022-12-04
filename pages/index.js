import React, {useState} from 'react'
import axios from 'axios'
import Link from 'next/link'


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

    console.log('Response is ', response)
    setAvailable(true)
  }

  return <div>
    <form onSubmit={submitHandler}>
      <div>
        <label htmlFor="pdf">Select a pdf</label>
        <input id="pdf" type="file" onChange={uploadHandler} required/>
      </div>
      <button type='submit'>Convert</button>
    </form>
    <br/>
    <Link href="/pdfs" disabled={available} target="_blank">View pdf</Link>
  </div>
}
 