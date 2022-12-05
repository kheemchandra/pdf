const fs = require('fs')

export default function handler(req, res){
    if(req.method === 'GET'){
        console.log('Hooray! yay')
        fs.writeFile('/tmp/msg.txt', 'Kheem da kaise ho', err => {
            if(err){
                throw err 
            }
            console.log('Success!')
        })
        res.status(200).json({message: 'Good'})
    }
}

