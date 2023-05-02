const express = require('express')
const app = express()
const port = process.env.PORT || 8001
const path = require('path')
const {Storage} = require("@google-cloud/storage")
const storage = new Storage();

app.use(express.static(path.join(__dirname, "public")))

const bucketName = 'profile-web-dicoding-bucket';
const imagePaths = ['profile-photo.png', 'email.png', 'linkedin.png','instagram.png'];
// Add more image paths as needed

app.get('/picture/:id', async (req, res) => {
  try {
    const imageIndex = req.params.id - 1;

    if (imageIndex >= 0 && imageIndex < imagePaths.length) {
      const bucket = storage.bucket(bucketName);
      const file = bucket.file(imagePaths[imageIndex]);

      // Create a read stream for the image file
      const stream = file.createReadStream();

      // Set the appropriate content type for the response
      res.contentType('image/png');

      // Pipe the image stream to the response
      stream.pipe(res);
    } else {
      res.sendStatus(404); // Image not found
    }
  } catch (error) {
    console.error('Error retrieving image:', error);
    res.sendStatus(500);
  }
});
var server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})