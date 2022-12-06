const fs = require('fs')

export default function handler(req, res) {
    if(req.method === 'GET'){
        fs.readdir('/', {encoding: 'utf-8'}, (err, files) => {
            files.forEach(f => console.log(f))
            res.status(200).json({data: files})
        })
    }
}