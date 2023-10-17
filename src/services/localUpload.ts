import multer from 'multer';
// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: `${process.env.LS_STATIC_PATH}`, // Ruta donde deseas almacenar los archivos
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Renombrar el archivo para evitar conflictos de nombres.
  },
});

export const uploadLS = multer({ storage: storage });

export const getImageUrl = (req) => {
  console.log(req.protocol)
  return `${req.protocol}://${req.hostname}:${process.env.APP_PORT}/repository/images/${req.file.filename}`;
}

