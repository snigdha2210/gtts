import './App.css';
import fb from './config/firebaseConfig';
import 'firebase/storage';
// import firebase from 'firebase/app';

// var storageRef = fb.storage().ref();
// var storage = fb.storage();

var textConverter = fb.functions().httpsCallable('GetReadyTextToSpeechCloudFuntion');

const convertTextToFileName=(word)=>{
  let myWordFile = word.replace(/ /g,"_"); 
  myWordFile = myWordFile + '.mp3';
  console.log('file name generated');
  return myWordFile;
};

async function checkFileNameInDirectory(fileName, googleCloudFolderPath){
  return new Promise((resolve, reject) => {
    const file = fb.storage().ref().child(`${googleCloudFolderPath}/${fileName}`);
   
    file.getDownloadURL().then((response)=>{
      resolve(1);
    }).catch((err)=>{
       resolve(0);
    })
    
  } )
 
  
}

async function uploadSpeechFile(speechBase64Array,fileName,googleCloudFolderPath){
  return new Promise((resolve, reject) => {
    // copied from https://cloud.google.com/blog/products/gcp/use-google-cloud-client-libraries-to-store-files-save-entities-and-log-data
  var storage = fb.storage();
  // var storage=admin.storage();
  const options = { metadata: { contentType: "audio/mp3" } }
console.log(speechBase64Array);
  var file = storage.ref().child(`${googleCloudFolderPath}/${fileName}`);
  //  const ref = firebase.storage().ref().child(`${googleCloudFolderPath}/${fileName}`);
  // const storageRef = admin.storage().ref();
console.log('in the upload function');
var returnUrl='new file uploaded';

var message = speechBase64Array.data[0].audioContent;
console.log(message);
let binary='';
for (const key in message) {
  binary += String.fromCharCode(message[key]);
}
const arrayBase64= window.btoa(binary);
console.log(arrayBase64);
file.putString(arrayBase64,'base64',options).then(snapshot => {
  snapshot.ref.getDownloadURL().then((downloadURL)=>{
    returnUrl=downloadURL;
    resolve(returnUrl);
  }).catch((err)=>{
    console.error(err);
    reject(err);
  })
})
.catch(err => {
  console.log(`Unable to upload MP3 ${err}`)
  reject(err);
})
})
}

const getURL=(fileName, googleCloudFolderPath)=>{
  return new Promise((resolve, reject) => {
    const file = fb.storage().ref().child(`${googleCloudFolderPath}/${fileName}`);
   
    file.getDownloadURL().then((response)=>{
      console.log(response);
      resolve(response);
    }).catch((err)=>{
      console.error(err);
      reject('error');
    })
    
  } )
}

const onSubmit = async (e) => {
  e.preventDefault();
  const textToConvert = e.target.textToConvert.value;
  if (!textToConvert) {
    return;
  }
  // var storage = firebase.storage().bucket('gs://turnkey-charter-317009.appspot.com');
  var url = '';
  
  return new Promise((resolve, reject) => {
  const fileName= convertTextToFileName(textToConvert);
  checkFileNameInDirectory(fileName,'audio').then((exists)=>{
    console.log('after checkFileNameInDirectory function');
    console.log(exists);

    if(exists){
      console.log('duplicate');
      url=getURL(fileName,'audio');

      resolve(url);
    }
    else{
      
      console.log(textConverter);
      const tts=textConverter({ text: textToConvert });
      console.log(tts);
      tts.then((response)=>{
        console.log(response);
          uploadSpeechFile(response,fileName,'audio').then((returnUrl)=>{
            url=returnUrl;
            console.log("url: ",url);
            resolve(url);
          }).catch((err)=>{
            reject(err);
            console.error(err);
        })
        }).catch((err)=>{
          reject(err);
          console.error(err);
      })
    }                      
  }).catch((err)=>{
      console.error(err);
  })    
  })
}


function App() {
  return (
    <>
      <form onSubmit={onSubmit}>
          <input type="text" name="textToConvert" placeholder="TEXT" />
        <button>Submit</button>
      </form>
    </>
  );
}

export default App;
