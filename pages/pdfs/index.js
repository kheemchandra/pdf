import fs from 'fs'
import path from 'path'
import Script from 'next/script'


export default function Welcome({files}) {
  const {html} = files 
  if(html.length === 0){
    return <h2 style={{textAlign: 'center', marginTop: '250px'}}>Please upload a pdf!!</h2>
  } 
    return <> 
      <Script src='static/utils.js'></Script>    
    </>
}


export async function getServerSideProps({req, res}) { 
  const pre = '/api/pdf';
  
  const xhtmlFiles = []
  

  try{
    const data = fs.readdirSync(path.join(process.cwd(), 'public/pdf'), {encoding: 'utf-8'})

    data.forEach(f => {
      if(f.includes('.xhtml')){
        xhtmlFiles.push(`${pre}/${f}`)
      }
    }) 
  }catch(e){
    
  }
  finally{
      return { 
        props: {
          files: {
            html: xhtmlFiles
          }
        } 
    }
  }

  
  

}