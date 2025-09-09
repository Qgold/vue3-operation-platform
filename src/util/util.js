//转换图片格式
function compressImage(inputImage, quality) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = inputImage.naturalWidth;
    canvas.height = inputImage.naturalHeight;
    ctx.drawImage(inputImage, 0, 0, canvas.width, canvas.height);
    const compressedImage = new Image();
    compressedImage.src = canvas.toDataURL('image/webp', quality);
    compressedImage.onload = () => {
      resolve(compressedImage);
    };
  });
}
