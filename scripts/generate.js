const path = require("path");
const glob = require("glob");
const sharp = require("sharp");
const fs = require("fs");

function generatePreviewImageFiles() {
  glob("**/photos/**/*.jpg", (error, files) => {
    if (error) {
      console.error(error);
      return;
    }

    files.forEach(async (file) => {
      const fileName = file.split("/").pop();
      const filePath = file.replace(fileName, "");
      const fileNameWithoutExtension = fileName.split(".jpg")[0];

      const inputFilePath = path.join(__dirname, "../", file);
      const outputFilePath = path.join(
        __dirname,
        "../",
        filePath,
        `${fileNameWithoutExtension}.webp`
      );

      if (fs.existsSync(outputFilePath)) {
        return;
      }

      await sharp(inputFilePath)
        .resize({
          width: 800,
          height: 800,
          fit: sharp.fit.inside,
        })
        .webp({ quality: 70, nearLossless: true })
        .toFile(outputFilePath);

      console.log("Created:", outputFilePath);
    });
  });
}

function isFileSizeTooBig(filePath) {
  const FILE_SIZE_LIMIT_IN_MEGABYTES = 1;

  const stats = fs.statSync(filePath);
  const fileSizeInBytes = stats.size;
  const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);

  return fileSizeInMegabytes >= FILE_SIZE_LIMIT_IN_MEGABYTES;
}

function reduceJpgImageFileSize() {
  glob("**/photos/**/*.jpg", (error, files) => {
    if (error) {
      console.error(error);
      return;
    }

    files.forEach(async (file) => {
      const fileName = file.split("/").pop();
      const filePath = file.replace(fileName, "");
      const fileNameWithoutExtension = fileName.split(".jpg")[0];

      const inputFilePath = path.join(__dirname, "../", file);
      const outputFilePath = path.join(
        __dirname,
        "../",
        filePath,
        `${fileNameWithoutExtension}.reduced-quality.jpg`
      );

      if (!isFileSizeTooBig(inputFilePath)) {
        return;
      }

      await sharp(inputFilePath)
        .resize({
          width: 2500,
          height: 2500,
          fit: sharp.fit.inside,
        })
        .jpeg({ quality: 90 })
        .toFile(outputFilePath);

      // Delete original file
      fs.unlinkSync(inputFilePath);

      // Rename file
      fs.renameSync(outputFilePath, inputFilePath);

      console.log("Reduced JPG file size:", file);
    });
  });
}

function main() {
  // generatePreviewImageFiles();
  reduceJpgImageFileSize();
}

main();
