const p = 'public\\static\\z4';

let fragment = new DocumentFragment();
// for (i = 1; i < 2; ++i) {
  for(i=1; i<3; ++i){
  let fr = document.createElement('iframe')
  fr.src = `${p}\\page${String(i).padStart(3, "0")}.xhtml`;
  fr.frameborder="0" 
  fr.marginheight="0" 
  fr.marginwidth="0" 
  fr.width="100%" 
  fr.height="100%" 
  fr.scrolling="no"
  fr.loading="lazy"


//   const cssLink = document.createElement("link");
//   cssLink.href = "./iframe.css";
//   cssLink.rel = "stylesheet";
//   cssLink.type = "text/css";
  
   
//   fr.addEventListener('load', (e) => {
//     e.target.contentDocument.head.appendChild(cssLink)
//   })  

  fragment.append(fr);
}

document.body.append(fragment);

