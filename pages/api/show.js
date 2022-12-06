import { readFileSync } from 'fs';
import path from 'path';

let files = []
 



export default function handler(req, res) {
    const file = path.join(process.cwd(), 'public/static/', 'msg.txt');
    const data = readFileSync(file, 'utf8');
  
    return res.status(200).json({data: data})
}