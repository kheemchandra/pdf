const fs = require('fs')
const path = require('path')

let files = []

function ThroughDirectory(Directory) {
    fs.readdirSync(Directory).forEach(File => {
        if(File.includes('node_modules'))return;
        if(File.startsWith('.'))return;
        const Absolute = path.join(Directory, File);
        if (fs.statSync(Absolute).isDirectory()) return ThroughDirectory(Absolute);
        else return files.push(Absolute);
    });
}



export default function handler(req, res) {
    if(req.method === 'GET'){
        // fs.readdir('/', {encoding: 'utf-8'}, (err, files) => {
        //     files.forEach(f => console.log(f))
        //     res.status(200).json({data: files})
        // })

        ThroughDirectory('/')
        console.log('files are ', files)
        res.status(200).json({message: 'Success!', files: files})
    }
}