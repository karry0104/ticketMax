import multer, { FileFilterCallback, DiskStorageOptions } from "multer";
import { fileURLToPath } from "url";
import path from "path";
import { nanoid } from "nanoid";
import { Request } from "express";

export const uploadToBuffer = multer({ storage: multer.memoryStorage() });

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagePath = path.join(__dirname, `../../uploads/`);

const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    callback: DestinationCallback
  ) => {
    callback(null, imagePath);
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    callback: FileNameCallback
  ) => {
    callback(null, `${nanoid(7)}${path.extname(file.originalname)}`);
  },
});

export const fileFilter = (
  request: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
): void => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

export const uploadToDisk = multer({ storage, fileFilter });
