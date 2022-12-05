const fs = require('fs')

export default function handler(req, res){
    if(req.method === 'GET'){
        console.log('Hooray! yay')
        fs.writeFile('public/static/msg.txt', 'Kheem da ', err => {
            if(err){
                throw err 
            }
            console.log('Success!')
        })
        res.status(200).json({message: 'Good'})
    }
}

