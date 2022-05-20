const express = require('express')
const router = express.Router()
const multer = require('multer')
const multerS3 = require('multer-s3')
const aws = require('aws-sdk')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
let fileHelper = ""
aws.config.region = 'us-east-1' // settes i heroku config variabel

const dir_name = './public'
// Kilde: https://morioh.com/p/5c99be0fb5aa

//Fungerer både for bilder og andre filer.
/**
 * Storage spesifications based on multerS3 for storage to aws S3 database
 */
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

//solution https://stackoverflow.com/questions/10183291/how-to-get-the-full-url-in-express
/**
 * Sets and returns filename so it can be sent back to the client for storage in mongodb
 * @param {*} filename 
 * @returns filename
 */
function helper(filename) {
    let fixedFilename = uuidv4()+ '-' + filename.toLocaleLowerCase().split(' ').join('-')
    fileHelper = fixedFilename
    return  fixedFilename
}

/**
 * Specifies storage to be used and a file filter for images
 * Based on multer
 */
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

/**
 * Specifies storage to be used and a file filter for files
 * Based on multer
 */
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

/**
 * Uploads an image to aws s3 database
 */
router.post("/image", uploadImageS3.single('image'), (req, res) => {
    
    const returnData = {
        url: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${req.file}`
    };

    res.json({imageUrl: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${fileHelper}`})
})

/**
 * Delets spesified objects from the aws s3 database
 * by using the aws.sdk
 */
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
                })
                
            }
        }
    })
})

/**
 * Uploads a file to aws s3 database
 */
router.post("/file", uploadFileS3.single('file'), (req, res) => {
    const returnData = {
        url: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${req.file}`
    };

    res.json({fileUrl: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${fileHelper}`})
})

module.exports = router