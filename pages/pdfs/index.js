import Script from 'next/script'

export default function Welcome(props) {  
    return <> 
    <Script src='static/utils.js'></Script>
    
    </>
}


export async function getServerSideProps(context) {
    const htmls = ['tmp/cover.xhtml', 'tmp/page002.xhtml']
    return {
      props: {
        files: {
            html: htmls,
            css: './static/z4/iframe.css'

        }
      }, // will be passed to the page component as props
    }
  }