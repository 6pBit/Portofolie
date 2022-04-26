const { response } = require('express');
const express = require('express');
const { route } = require('express/lib/application');
const dbo = require("../db/index.js");
const router = express.Router()
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')


const dir_name = './public'
// Kilde: https://morioh.com/p/5c99be0fb5aa

const storageImage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, dir_name + '/images')
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLocaleLowerCase().split(' ').join('-')
        cb(null, uuidv4() + '-' + 'image' + fileName)
    }
})

const storageFile = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, dir_name + "/files")
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLocaleLowerCase().split(' ').join('-')
        cb(null, uuidv4() + '-' + "file" + fileName)
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

const uploadFile = multer({
    storage: storageFile
})

router.post("/image", uploadImage.single('image'), (req, res) => {
    //console.log(req.baseUrl + " fileUpload route image")
    const image_url = req.protocol + '://' + req.get('host')
    const imageToUpload = {
       imageurl: image_url + '/public/images/' + req.file.filename
    }

    console.log(image_url + " kun url fra route")
    console.log(imageToUpload.imageurl + " imageurl inne i imagetoupload i route")

    res.json({image: image_url + '/public/images/' + req.file.filename})
})

router.post("/file", uploadFile.single('file'), (req, res) => {
    const file_url = req.protocol + '://' + req.get('host')
    const fileToUpload = {
        fileurl: file_url + '/public/files/' + req.file.filename
    }
    console.log(fileToUpload.fileurl + " dette sendes som filepath for pdf filen")
    res.json({file: file_url + '/public/files/' + req.file.filename})
})

module.exports = router