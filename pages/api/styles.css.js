import fs from "fs";
import path from "path";

let d = `
h1{
  color: red;
}
`

export default function handler(req, res) {
    let  p;
    p = path.join(process.cwd(), 'public/pdf1/styles.css')
    
    // p = path.join(process.cwd(), 'public/pdf/t.xhtml')
    fs.writeFileSync(p, d)
    fs.readFile(p, (err, data) => {
    if(err){
        return res.status(500).json({error: err.message})
    }
    res.setHeader("Content-Type", "text/css");
    // console.log('Data is ', data.toString())
    return res.send(data);
  })
}