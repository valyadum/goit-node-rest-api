import multer from "multer";
import path from "path";

const tempDir = path.resolve("temp");


const multerConfig = multer.diskStorage({
    destination: tempDir,
    filename:(req, file, cb)=> {
        cb(null, file.originalname);
    }
})
export const upload = multer({
    storage: multerConfig
})
