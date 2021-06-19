const config = {
  MAX_WIDTH : 200,
  MAX_HEIGHT : 200,
  preview : true,
}
const fInput = document.querySelector('input[type=file]');
let preview = undefined;


class PreviewMode{
  constructor(){
    this.previewNode = document.createElement('div');
    this.previewNode.setAttribute('id', 'preview')
    this.emptyPreview();

    const controlsNode = document.querySelector('.controls')
    document.body.insertBefore(this.previewNode, controlsNode);
  }
  addElement(canvas, file, dataURL){
      const elemNode = document.createElement('div');

      elemNode.setAttribute('class', 'element');
      elemNode.appendChild(canvas);
      this.displayImage(elemNode, dataURL);
      elemNode.title = file.name;
      this.previewNode.appendChild(elemNode);

  }

  displayImage(node, dataURL){
    const a = document.createElement('a');
    a.setAttribute('href', dataURL);
    const img = document.createElement('img');
    img.setAttribute('src', dataURL);
    a.appendChild(img);
    node.appendChild(a);
  }

  emptyPreview(){
    this.previewNode.innerHTML = `
      <span>Не выбрано изображений</span>
    `;
  }
  cleanPreview(){
    this.previewNode.innerHTML = '';
  }
  remove(){
    this.previewNode.remove();
  }
}

function squeezeImages(e, cb){
  const b64Images = [];
  
  if (config.preview) preview.cleanPreview();
  
  Array.from(e.target.files).forEach(computeImage);

  cb(b64Images);

  function computeImage(file){
    squeeze(file, config.MAX_WIDTH, config.MAX_HEIGHT)
  }

  function squeeze(file, maxWidth, maxHeight){
    const image = new Image();
    image.onload = ()=>{
      const size = computeImageSize(image, maxWidth, maxHeight);
      
      const canvas = document.createElement('canvas');
      canvas.width = size.width;
      canvas.height = size.height;
      
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, size.width, size.height);
      const dataURL = canvas.toDataURL('image/png');      
      const b64 = dataURL.split(',').slice(-1)[0];
      b64Images.push(b64);


      if (config.preview) preview.addElement(canvas, file, dataURL);
    }

    let dataURL = URL.createObjectURL(file);
    image.src=dataURL;
  }


  function computeImageSize(image, maxWidth, maxHeight){
    const aspectRatio = image.height / image.width;
    const preHeight = Math.min(image.height, maxHeight)
    const preWidth = preHeight / aspectRatio;
    const height = (preWidth <= maxWidth) ? preHeight : maxWidth * aspectRatio;
    const width = preWidth <= maxWidth ? preWidth : maxWidth;
    return { width, height };
  }


  
}






fInput.addEventListener('change', e=>{squeezeImages(e, processImages)});

function processImages(data){
  console.log(data)
}








const previewToggleNode = document.querySelector('input[type=checkbox][name=preview]')
const maxHeightNode = document.querySelector('input[name=maxHeight]')
const maxWidthNode = document.querySelector('input[name=maxWidth]')
initControls();

previewToggleNode.addEventListener('change', updatePreview);
updatePreview();
function updatePreview(){
  config.preview = previewToggleNode.checked;
  fInput.value = '';
  if (previewToggleNode.checked){
    preview = new PreviewMode();
  } else {
    preview.remove();
    preview = undefined;
  }
}

maxWidthNode.addEventListener('change', updateMaxWidth)
maxWidthNode.addEventListener('input', updateMaxWidth)
maxHeightNode.addEventListener('change', updateMaxHeight)
maxHeightNode.addEventListener('input', updateMaxHeight)

function updateMaxHeight(){
  config.MAX_HEIGHT = maxHeightNode.value;
}
function updateMaxWidth(){
  config.MAX_WIDTH = maxWidthNode.value;
}

function initControls(){
  maxHeightNode.value = config.MAX_HEIGHT;
  maxWidthNode.value = config.MAX_WIDTH;
  previewToggleNode.checked = config.preview;
}