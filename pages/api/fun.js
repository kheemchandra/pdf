import fs from "fs";
import path from "path";

export default function handler(req, res) {
    let p = path.join(process.cwd(), 'public/pdf/page002.xhtml')
    p = path.join(process.cwd(), 'public/pdf/t.xhtml')
    fs.writeFileSync(p, '<p>This is working</p>')
    fs.readFile(p, (err, data) => {
    if(err){
        res.status(500).json({error: err.message})
    }
    res.setHeader("Content-Type", "text/html");
    console.log('Data is ', data.toString())
    return res.send(data);
  })
}