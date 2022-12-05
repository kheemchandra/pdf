const fs = require('fs')

export default function handler(req, res) {
    if(req.method === 'GET'){
        fs.readdir('/tmp', {encoding: 'utf-8'}, (err, files) => {
            console.log('Files are, ', files)
        })
        fs.readFile('/tmp/msg.txt', {encoding: 'utf-8'}, (err, data) => {
            if(err){
                res.status(500).json({err: err.message || 'Something went wrong!'})
                throw err 
            }
        })
        res.status(200).json({message: data})
    }
}