const dragArea = document.querySelector('.drag-area');
const dragText = document.querySelector('.header-dnd');
let button = document.querySelector('.button');
let input = document.querySelector('input');
let file;
let model;
loadModel();

async function loadModel() {
    try {
        model = await tf.loadLayersModel('https://raw.githubusercontent.com/183Patchanon/AIproject2/main/tfjs_Dense_model256_02_20/model.json');
        // console.log(model);
        console.log('Model loaded successfully');
        // You can return the model or perform other operations here.

    } catch (error) {
        console.error('Error loading the model:', error);
    }
}

button.onclick = () => {
    input.click();
};

//when browser 
input.addEventListener('change', function () {
    file = this.files[0];
    dragArea.classList.add('active');
    displayFile();
})

//when file is inside the drag area
dragArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    dragText.textContent = 'Release to Upload'
    dragArea.classList.add('active');

    //console.log('File is inside the drag area');
});

//when file leaves the drag area
dragArea.addEventListener('dragleave', () => {
    dragText.textContent = 'Drag & Drop';
    dragArea.classList.remove('active');

    //console.log("File left the drag area");
});

dragArea.addEventListener('drop', (event) => {
    event.preventDefault();
    file = event.dataTransfer.files[0];;
    
    //console.log(file);
    
    displayFile();
    
});


function displayFile() {
    let fileTypes = file.type;
    console.log(fileTypes);
    let validExtensions = ['image/jpeg', 'image/jpg', 'image/png'];

    if (validExtensions.indexOf(fileTypes) === -1) {
        console.log('This file is not an Image');
        dragArea.classList.remove('active');
    } else {
        console.log('This file is an Image');
        let fileReader = new FileReader();

        fileReader.onload = () => {
            let fileURL = fileReader.result;
            let imgTag = `<img src="${fileURL}" alt="">`;
            dragArea.innerHTML = imgTag;
            
            // สร้าง HTMLImageElement เพื่อโหลดรูปภาพ
            const imgElement = new Image();
            imgElement.src = fileURL;
            
            // เมื่อรูปภาพโหลดเสร็จสิ้น
            imgElement.onload = () => {
                useModel(imgElement)
            };
        };

        fileReader.readAsDataURL(file);
    }
}
async function useModel(image) {
    // เตรียมรูปภาพเพื่อใช้ในโมเดล
    const imgTensor = tf.browser.fromPixels(image);
    
    // ปรับขนาดรูปภาพเพื่อให้มีขนาดที่ถูกต้อง (224x224)
    const resizedImgTensor = tf.image.resizeBilinear(imgTensor, [224, 224]);
    
    // เพิ่มมิติที่สี่
    const expandedImgTensor = resizedImgTensor.expandDims(0);
    //console.log(resizedImgTensor);
    
    // ส่งข้อมูลรูปภาพไปให้โมเดล
    const predictions = model.predict(expandedImgTensor);
    
    // แสดงผลลัพธ์ที่ได้
    console.log(predictions);
    classLabels(predictions);
}

function classLabels(isLabel) {
    const labels = ['MildDemented', 'ModerateDemented', 'NonDemented','VeryMildDemented'];
    /*const predictionsData = isLabel.dataSync();
    // console.log(predictionsData);
        
    const maxPrediction = Math.max(predictionsData); // ค่าการคาดการณ์สูงสุด*/
        // console.log('Max prediction:', maxPrediction);
    let maxPrediction = tf.argMax(isLabel, 1).dataSync()[0]
    console.log(maxPrediction);
    console.log(labels[maxPrediction]);
}