const PORT = 8000
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
require('dotenv').config()
const fs = require('fs')
const multer = require('multer')
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/images', async (req, res) => {
  try {
    const response = await openai.createImage({
      prompt: req.body.message,
      n: 3,
      size: "1024x1024",
    });
    console.log(response)
    res.send(response.data.data)
  } catch (err) {
    console.error(err)
  }
})

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public')
  },
  filename: (req, file, cb) => {
    console.log('file', file)
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage: storage}).single('file')
let filePath

app.post('/upload', async (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err)
    } else if (err) {
      return res.status(500).json(err)
    }
    filePath = req.file.path
  })
  res.send({message: 'image upload succeeded!'})
})

app.post('/variations', async (req, res) => {
  console.log('filePath', filePath)
  try {
    const response = await openai.createImageVariation(
      fs.createReadStream(filePath),
      3,
      "1024x1024"
    );
    console.log('response', response)
    res.send(response.data.data)
  } catch (err) {
    console.error(err)
  }

})

app.listen(PORT, () => console.log('Server is running on port', PORT))
