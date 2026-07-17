import multer from "multer";
import path from "path";
import fs from "fs";

const folder = "uploads";

if (!fs.existsSync(folder)) {
    console.log(file);
    fs.mkdirSync(folder);

}

const storage = multer.diskStorage({

    destination(req, file, cb) {

        cb(null, "uploads");

    },

    filename(req, file, cb) {

        const ext = path.extname(file.originalname);

       cb(
    null,
    `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
);

    }

});

export default multer({

    storage

});