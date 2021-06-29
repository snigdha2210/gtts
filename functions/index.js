
const functions = require('firebase-functions');
const admin = require('firebase-admin');
// const firebase = require('firebase');
admin.initializeApp(functions.config().firebase);

const convertTextToFileName=(word)=>{
  let myWordFile = word.replace(/ /g,"_"); 
  myWordFile = myWordFile + '.mp3';
  console.log('file name generated');
  return myWordFile;
};

async function uploadSpeechFile(speechBase64Array,fileName,googleCloudFolderPath){
  return new Promise((resolve, reject) => {
    // copied from https://cloud.google.com/blog/products/gcp/use-google-cloud-client-libraries-to-store-files-save-entities-and-log-data
  var bucket = admin.storage().bucket();
  // var storage=admin.storage();
  const options = { metadata: { contentType: "audio/mp3" } }

  var file = bucket.file(`${googleCloudFolderPath}/${fileName}`);
  //  const ref = firebase.storage().ref().child(`${googleCloudFolderPath}/${fileName}`);
  // const storageRef = admin.storage().ref();
console.log('in the upload function');
var returnUrl='new file uploaded';

var message = speechBase64Array.audioContent;
file.save(message, options).then(stuff => {
  console.log(stuff);
  file.getSignedUrl({
    action: 'read',
    expires: '01-01-2500'
  })
})
.then(urls => {
const url = urls[0];
console.log(`Image url = ${url}`)
returnUrl=url;
resolve(returnUrl);
})
.catch(err => {
  console.log(`Unable to upload MP3 ${err}`)
  reject(err);
})
}).catch(err=>{
  console.error(err);

// resolve(returnUrl);


})
}

async function checkFileNameInDirectory(fileName, googleCloudFolderPath,bucket){
  return new Promise((resolve, reject) => {
    var file = bucket.file(`${googleCloudFolderPath}/${fileName}`);
    file.exists().then((exists) => {
            if (exists[0]) {
              console.log("File exists");
              console.log(exists[0]);
              resolve(1);
            } else {
              console.log("File does not exist");
              resolve(0);          
            }
         }).catch((err)=>{
           reject(err);
           console.error(err);
         })
  } )
 
  
}

async function textToSpeech(text){
  const tts = require('@google-cloud/text-to-speech'); // Imports the Google Cloud client library
  const client = new tts.TextToSpeechClient(); // Creates a client

  const request = { // Construct the request
    input: {text: text},
    // Select the language and SSML Voice Gender (optional)
    voice: {languageCode: 'en-GB', ssmlGender: 'FEMALE'},
    // Select the type of audio encoding
    audioConfig: {audioEncoding: 'MP3'},
  };

  // copied from https://cloud.google.com/text-to-speech/docs/quickstart-client-libraries#client-libraries-usage-nodejs
  return client.synthesizeSpeech(request)
  // .then(([response])=>{
    // console.log('textConverted');
    // console.log(response);
    // return response;
  // });
    
  
}

async function GetReadyTextToSpeech(textToConvert) 
    {
      return new Promise((resolve, reject) => {
        var myWordFile = convertTextToFileName(textToConvert); //returns name of the file
                var bucket = admin.storage().bucket();
                 var url='';
                checkFileNameInDirectory(myWordFile,'',bucket).then((exists)=>{
                  console.log('after checkFileNameInDirectory function');
                  console.log(exists);
                  if(exists){
                    console.log('duplicate');
                    url='duplicate';
                    resolve(url);
                  }else{
                    textToSpeech(textToConvert).then(([response])=>{
                      uploadSpeechFile(response,myWordFile,'').then((returnUrl)=>{
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
      } )
                
                             
    } 

    exports.GetReadyTextToSpeechCloudFuntion = functions.https.onCall((change, context) => {
      return textToSpeech(change.text);
  //     return new Promise((resolve, reject) => {
  //     if (change.text !== undefined){
  //     try {
  //           textToSpeech(change.text).then(([response])=>{
  //             console.log(response);
  //           resolve(response);
  //           }).catch ((error) =>{
  //             console.log(error);
  //             reject(error);
  //           });
            
  //     } catch (error) {
  //       console.log(error);
  //       reject( 'tts didnt work');
  //     }
  //   }  
  // })

    });