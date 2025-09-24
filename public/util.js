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


//渲染大批量数据
function renderLargeData(data,chunkSize,selector){
  const container = document.querySelector(selector);
  let index = 0;
  function renderChunk() {
    const chunkEnd = Math.min(index + chunkSize.data.length);
    for(;chunkEnd; index++){
      const div =document.createElement('div');
      div.textContent = data[index];
      container.appendChild(div);
    }
    if(index<data.length){
      requestAnimationFrame(renderChunk);
    }
  }
  renderChunk()
}