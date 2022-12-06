const fs = require('fs')

let text = `
<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Document</title></head><body> <h1>Hello there how are you?</h1></body></html>
`

export default function handler(req, res){
    if(req.method === 'GET'){
        console.log('Hooray! yay')
        fs.writeFile('./public/pdf1/msg.html', text, err => {
            if(err){
                throw err 
            }
            console.log('Success!')
        })
        res.status(200).json({message: 'Good'})
    }
}

