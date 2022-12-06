import path from 'path'
import Script from 'next/script'

export default function Welcome(props) {  
    return <> 
    <Script src='static/utils.js'></Script>
    
    </>
}

// import {} from '../../public/pdf/'
export async function getServerSideProps(context) {
    let p = path.join(process.cwd(), 'public', 'pdf')
    p = '/pdf/'
    const htmls = [`${p}/cover.xhtml`, `${p}/page002.xhtml`]
    return {
      props: {
        files: {
            html: htmls,
            css: './static/z4/iframe.css'

        }
      }, // will be passed to the page component as props
    }
  }