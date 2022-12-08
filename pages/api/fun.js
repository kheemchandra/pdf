import fs from "fs";
import path from "path";

export default function handler(req, res) {
  // console.log('Request is ' , req)
    let  p;
    p = path.join(process.cwd(), 'public/pdf/page002.xhtml')
    
    // p = path.join(process.cwd(), 'public/pdf/t.xhtml')
    // fs.writeFileSync(p, '<p>This is working</p>')
    fs.readFile(p, (err, data) => {
    if(err){
        return res.status(500).json({error: err.message})
    }
    res.setHeader("Content-Type", "text/html");
    // console.log('Data is ', data.toString())
    return res.send(data);
  })
}

// /api/pdf/css/FontSrc.css
// /api/pdf/css/Styles.css
// /api/pdf/images/bg002_00.jpg
// /api/pdf/css/FontSrc.css
// /api/pdf/css/Styles.css