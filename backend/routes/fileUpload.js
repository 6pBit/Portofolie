const { response } = require('express');
const express = require('express');
const { route } = require('express/lib/application');
const dbo = require("../db/index.js");
const router = express.Router()
const multer = require('multer')
const multerS3 = require('multer-s3')
const aws = require('aws-sdk')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
const path = require('path');
const filepath = path.join(__dirname, '..', '..', 'public', 'images', '/')
let fileHelper = ""
aws.config.region = 'us-east-1'

const dir_name = './public'
// Kilde: https://morioh.com/p/5c99be0fb5aa

//Fungerer både for bilder og andre filer.
const storageForAwsS3 = multerS3({
    s3: s3 = new aws.S3(), 
    bucket: process.env.S3_BUCKET_NAME,
    acl: 'public-read',
    metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname})
    },
    key: function (req, file, cb) {
        console.log(file)
        cb(null, helper(file.originalname))
    }
})

//veldig fix løsning https://stackoverflow.com/questions/10183291/how-to-get-the-full-url-in-express
function helper(filename) {
    let fixedFilename = uuidv4()+ '-' + filename.toLocaleLowerCase().split(' ').join('-')
    fileHelper = fixedFilename
    return  fixedFilename
}

const uploadImageS3 = multer({
    storage: storageForAwsS3,
    fileFilter: (req, file, cb) => {
        if(file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
            cb(null, true)
        } else {
            cb(null, false) 
            return cb(new Error("Vennligst benytt en av følgende filetyper: PNG, JPG, JPEG"))
        }
    }
})

const uploadFileS3 = multer({
    storage: storageForAwsS3,
    fileFilter: (req, file, cb) => {
        if(file.mimetype == "application/pdf" || file.mimetype == "application/docx" || file.mimetype == "application/doc") {
            cb(null, true)
        } else {
            cb(null, false) 
            return cb(new Error("Vennligst benytt en av følgende filetyper: PDF, DOCX, DOC"))
        }
    }
})

router.post("/image", uploadImageS3.single('image'), (req, res) => {
    
    const returnData = {
        url: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${req.file}`
    };

    /* kan fungere ved heroku host
    const returnData = {
        url: req.protocol + '://' + req.get('host') + req.file.filename
    }
    */
    res.json({imageUrl: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${fileHelper}`})
})

router.post("/delete/fromAws", (req, res) => {
    let s3 = new aws.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        Bucket: process.env.S3_BUCKET_NAME
    })
    req.body.filePaths.forEach(element => {
        if(element !== "") {
            let temp = element.toString().split('s3.amazonaws.com/').pop()
            if(temp !== "") {
                s3.deleteObject({Bucket: process.env.S3_BUCKET_NAME, Key: temp}, (err, data) => {
                    if(err) throw err
                    console.log(data + " slettet")
                })
                
            }
        }
    })
})


router.post("/file", uploadFileS3.single('file'), (req, res) => {
    //evt ekstra retur data
    const returnData = {
        url: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${req.file}`
    };

    res.json({fileUrl: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${fileHelper}`})
})

module.exports = router

//Gammel kode for lokal lagring.

/*
const storageImage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, dir_name + '/images')
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLocaleLowerCase().split(' ').join('-')
        cb(null, uuidv4() + '-' + 'image-' + fileName)
    }
})

const storageFile = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, dir_name + "/files")
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLocaleLowerCase().split(' ').join('-')
        cb(null, uuidv4() + '-' + "file-" + fileName)
    }
})


const uploadImage = multer({
    storage: storageImage,
    fileFilter: (req, file, cb) => {
        if(file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
            cb(null, true)
        } else {
            cb(null, false) 
            return cb(new Error("Vennligst benytt en av følgende filetyper: PNG, JPG, JPEG"))
        }
    }
})

*/
/*
router.post("/delete/images", (req, res) => {
    //må finne lengden på body.filePaths
    console.log(req.body.filePaths + " filepaths fra body i delete/images")
    req.body.filePaths.forEach(element => {
        if(element !== "") { //fiks?
            console.log(element.toString().split('images/').pop())
            let temp = element.toString().split('images/').pop()
            if(temp !== "") {
                fs.unlinkSync(`${filepath}${temp}`, (err) => { //fjernet /public/images/ før temp
                    if(err) console.log("Fant ikke filen") // får eror her, men trenger ikke håndtere den kanskje? heheheheh
                    console.log("Slettet: " + temp)
                })
            }
        }
    })
    //fs.unlinkSync(req.body.filepath)
    //res.json("Sletting vellykket!")
    console.log("Nå slettet jeg bilder lokalt")
})
*/

/*
router.post("/file", uploadFile.single('file'), (req, res) => {
    const file_url = req.protocol + '://' + req.get('host')
    const fileToUpload = {
        fileurl: file_url + '/public/files/' + req.file.filename
    }
    console.log(fileToUpload.fileurl + " dette sendes som filepath for pdf filen")
    res.json({file: file_url + '/public/files/' + req.file.filename})
})
*/

/*
router.post("/image", uploadImage.single('image'), (req, res) => {
    //console.log(req.baseUrl + " fileUpload route image")
    const image_url = req.protocol + '://' + req.get('host')
    const imageToUpload = {
       imageurl: image_url + '/public/images/' + req.file.filename
    }

    console.log(image_url + " kun url fra route")
    console.log(imageToUpload.imageurl + " imageurl inne i imagetoupload i route")

    res.json({imageUrl: image_url + '/public/images/' + req.file.filename})
})
*/