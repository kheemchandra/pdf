import fs from "fs";
import path from "path";

let d = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="styles.css"/>
  <title>Document</title>
</head>
<body>
  <h1>Hello there how are you?</h1> 
</body>
</html>`

export default function handler(req, res) {
    let  p;
    p = path.join(process.cwd(), 'public/pdf1/z.html')
    
    // p = path.join(process.cwd(), 'public/pdf/t.xhtml')
    fs.writeFileSync(p, d)
    fs.readFile(p, (err, data) => {
    if(err){
        return res.status(500).json({error: err.message})
    }
    res.setHeader("Content-Type", "text/html");
    // console.log('Data is ', data.toString())
    return res.send(data);
  })
}