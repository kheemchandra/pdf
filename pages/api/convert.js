// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import path from 'path'
const { pdf2html } = require('../../core/pdf2html');

import middleware from '../../middleware/middleware';
import { createRouter} from 'next-connect';
import nextConnect from 'next-connect';   


const outputPath = path.join(process.cwd(), 'public', 'pdf');


const handler = nextConnect()
handler.use(middleware)

handler.post(async (req, res) => { 
  const path = req.files.file[0].path 

  try {
    await pdf2html(path, outputPath)
    res.status(200).json({message: 'Success!', path: path})
  } catch (error) {
    res.json(500).json({message: 'Something went wrong!'})
  }
 
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default handler