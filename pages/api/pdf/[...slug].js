import path from 'path'
import fs from 'fs'

export default function handler(req, res) { 
    
    let mimeType
    let  pth = req.url.replace('/api', 'public')
    let p = path.join(process.cwd(), pth)
    let ext = path.extname(p)
    switch (ext) {
        case '.xhtml':
            mimeType = 'application/xhtml+xml'
            break;        
        case '.jpg':
            mimeType = 'image/jpg'
            break;
        case '.css':
            mimeType = 'text/css'
            break;
                
        default:
            break;
    }
    
    fs.readFile(p, (err, data) => {
    if(err){
        return res.status(500).json({error: err.message})
    }
    if(mimeType)res.setHeader("Content-Type", mimeType);
    
    return res.status(200).send(data)
  })
}