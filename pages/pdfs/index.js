import path from 'path'
import Script from 'next/script'
import * as React from 'react'

 
export default function Welcome(props) {  
    return <> 
    <Script src='static/utils.js'></Script>
    
    </>
}

// import {} from '../../public/pdf/'
export async function getStaticProps() {
  let p;
  p = 'https://pdf-hazel.vercel.app/pdf' // 1
  p = ''
  p = 'https://pdf-production.up.railway.app/pdf' // 1
  p = path.join(process.cwd(), 'public', 'pdf')
  p = './pdf'
    // p = 'http://localhost:3000/public/pdf' // 2
    const htmls = [`${p}/cover.xhtml`, `${p}/page002.xhtml`]
    return {
      props: {
        files: {
            html: htmls,
            // css: './static/z4/iframe.css'

        }
      }, // will be passed to the page component as props
      revalidate: 10,
    }
  }