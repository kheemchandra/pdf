import path from 'path'
import Script from 'next/script'
import * as React from 'react'

 
export default function Welcome(props) {  
    return <> 
    <Script src='static/utils1.js'></Script>
    
    </>
}

// import {} from '../../public/pdf/'
export async function getServerSideProps(context) {
    let p = path.join(process.cwd(), 'public', 'pdf')
    // p = '/pdf/'
    p = 'https://pdf-hazel.vercel.app/pdf' // 1
    p = ''
    p = 'https://pdf-production.up.railway.app/pdf' // 1
    // p = 'http://localhost:3000/public/pdf' // 2
    const htmls = [`${p}/cover.xhtml`, `${p}/page002.xhtml`]
    return {
      props: {
        files: {
            html: htmls,
            // css: './static/z4/iframe.css'

        }
      }, // will be passed to the page component as props
    }
  }