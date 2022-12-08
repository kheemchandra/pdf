import path from 'path'
import Script from 'next/script'
import * as React from 'react'

 
export default function Welcome(props) {  
    return <> 
    <Script src='static/utils.js'></Script>
    
    </>
}

// import {} from '../../public/pdf/'
export async function getServerSideProps() {
  let p = '/api/pdf';
    // p = 'http://localhost:3000/public/pdf' // 2
    const htmls = [`${p}/cover.xhtml`, `${p}/page002.xhtml`]
    return {
      props: {
        files: {
            html: htmls,
            // css: './static/z4/iframe.css'

        }
      } 
    }
  }