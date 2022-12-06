const fs = require('fs')

import path from 'path';

let files = []
 



export default function handler(req, res) {
    fs.readdir(process.cwd(), {encoding: 'utf-8'}, (err, files) => {
        if(err){
            return res.status(500).json({error: err.message || 'Something went wrong'})
        }
        files.forEach(f => {
            if(!f.includes('public'))return;
            fs.readdir(path.join(process.cwd(), 'public/pdf'), {encoding: 'utf-8'}, (err, f1) =>{
                if(err){
                    return res.status(500).json({error: err.message || 'Something went wrong'})
                }

                return res.status(200).json({data: f1})
            })
        })
    })
  
}