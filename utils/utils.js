import axios from "axios";

export function sendFormData(file) { 
    if(!file){
        throw new Error('No file object is provided!')
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);

    return axios.post("/api/convert/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }); 
}