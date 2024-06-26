const multer = require('multer')
const path = require('path')

// Almacenamiento de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let folder = 'uploads/'
  
      // Asigna carpeta destino según el archivo
      switch (file.fieldname) {
        case 'profile':
          folder += 'profiles/'
          break
        case 'product':
          folder += 'products/'
          break
        case 'document':
          folder += 'documents/'
          break
        default:
          folder += 'others/'
          break
      }
  
      cb(null, folder)
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
  })

const upload = multer({ storage: storage })

module.exports = upload