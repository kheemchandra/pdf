const {html, css} = window.__NEXT_DATA__.props.pageProps.files


let fragment = new DocumentFragment();
  let len = html.length
for(i=0; i<len; ++i){
  let fr = document.createElement('iframe')
  // if(i == 0)fr.src = 'pdf/cover.xhtml';
  if(i == 1)fr.src = '/api/fun';
  else fr.src = html[i] 
  fr.frameborder="0" 
  fr.marginheight="0" 
  fr.marginwidth="0" 
  fr.width="100%" 
  fr.height="100%" 
  fr.scrolling="no"
  fr.loading="lazy"


  const cssLink = document.createElement("link");
  cssLink.href = '/static/iframe.css';
  
  cssLink.rel = "stylesheet";
  cssLink.type = "text/css";
  
   
  fr.addEventListener('load', (e) => {
    e.target.contentDocument.head.appendChild(cssLink)
    e.target.style.height=(e.target.contentWindow.document.body.scrollHeight)+'px' 
  })  

  fragment.append(fr);
}

document.body.append(fragment);

