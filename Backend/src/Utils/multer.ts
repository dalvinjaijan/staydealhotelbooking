import multer from 'multer'

// const storage = multer.diskStorage({

  
//     destination: (req, file, cb) => {
//       cb(null, './src/Utils/uploads/'); // Directory where the files will be stored
//     },
//     filename: (req, file, cb) => {
//       cb(null, `${Date.now()}-${file.originalname}`); // File name format
//     }
//   });

//   const storage1 = multer.diskStorage({

  
//     destination: (req, file, cb) => {
//       cb(null, './src/Utils/uploads/'); // Directory where the files will be stored
//     },
//     filename: (req, file, cb) => {
//       cb(null, `${Date.now()}-${file.fieldname}`); // File name format
//     }
//   });
  
//   // Initialize multer with the storage configuration
//  export const upload = multer({ storage });
//  export const upload1 = multer({ storage:storage1 });


const storage = multer.memoryStorage()
const upload = multer({ storage: storage });

export default upload
