const fs = require('fs')

import path from 'path';

let files = []
 



export default function handler(req, res) {
    fs.readdir(process.cwd(), {encoding: 'utf-8'}, (err, files) => {
        if(err){
            return res.status(500).json({error: err.message || 'Something went wrong'})
        }
        

        return res.status(200).json({data: files})
    
        
    })
  
}