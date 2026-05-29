import multer from "multer";
import fs from "fs";

const carpeta = "uploads/documentos_clinicos";

if (!fs.existsSync(carpeta)) {
    fs.mkdirSync(carpeta, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, carpeta);
    },

    filename: (req, file, cb) => {
        const nombreArchivo =
            Date.now() +
            "-" +
            file.originalname.replace(/\s+/g, "_");

        cb(null, nombreArchivo);
    }
});

const uploadDocumentos = multer({
    storage
});

export default uploadDocumentos;