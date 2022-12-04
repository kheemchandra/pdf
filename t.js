const { createRouter } = require("next-connect");
import multer from "multer";

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "public")
        },
        filename: (req, file, cb) => cb(null, file.originalname)
    })
});

const apiRouter = createRouter();

apiRouter.use(upload.single("file"))
    .post((req, res) => {
    console.log(req.file)
    res.send();
});

export default apiRouter.handler({
    onError: (err, req, res) => {
        console.error(err.stack);
        res.status(500).end("Something broke!");
    },
    onNoMatch: (req, res) => {
        res.status(404).end("Page is not found");
    }
});

export const config = {
    api: {
        bodyParser: false
    }
}