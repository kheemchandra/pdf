// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs';
import path from 'path';
import { createRouter} from 'next-connect';
import nextConnect from 'next-connect';   

import middleware from '../../middleware/middleware';
const { pdf2html } = require('../../core/pdf2html');


const isDirExist = async path => await fs.promises.access(path).then(()=>true).catch(()=>false);


const outputPath = path.join(process.cwd(), 'public', 'pdf');


const handler = nextConnect()
handler.use(middleware)

handler.post(async (req, res) => { 
  const path = req.files.file[0].path 

  const exist = await isDirExist(outputPath)

  if(exist){
    fs.rmdirSync(outputPath)
  }

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