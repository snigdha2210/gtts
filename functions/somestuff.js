
// const functions = require('firebase-functions');
// const admin = require('firebase-admin');

// const firebaseConfig = {
//   apiKey: "AIzaSyBLiBWDFdarxlu30vHKgnjBpxRrQwgh7j0",
//   authDomain: "turnkey-charter-317009.firebaseapp.com",
//   projectId: "turnkey-charter-317009",
//   storageBucket: "turnkey-charter-317009.appspot.com",
//   messagingSenderId: "750798661246",
//   appId: "1:750798661246:web:b59a5f371f192f72245a2f",
//   measurementId: "G-TP99L22646"
// };
// const firebase=require('firebase');
// const fb = firebase.initializeApp(firebaseConfig);
// // // Create and Deploy Your First Cloud Functions
// // // https://firebase.google.com/docs/functions/write-firebase-functions
// //
// // exports.helloWorld = functions.https.onRequest((request, response) => {
// //  response.send("Hello from Firebase!");
// // });
// function dataURItoBlob(dataURI) {
//   // convert base64 to raw binary data held in a string
//   // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
//   const atob=require('atob');
//   var byteString = atob(dataURI.split(',')[1]);

//   // separate out the mime component
//   var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

//   // write the bytes of the string to an ArrayBuffer
//   var ab = new ArrayBuffer(byteString.length);
//   var ia = new Uint8Array(ab);
//   for (var i = 0; i < byteString.length; i++) {
//       ia[i] = byteString.charCodeAt(i);
//   }

//   //Old Code
//   //write the ArrayBuffer to a blob, and you're done
//   //var bb = new BlobBuilder();
//   //bb.append(ab);
//   //return bb.getBlob(mimeString);

//   //New Code
//   return new Blob([ab], {type: mimeString});


// }

// async function textToSpeechRequest(change) 
//     {
//       try{
//                 const word = change.text; // the text
//                 console.log("reached textToSpeechRequest function");
//                 const audioFormat = '.mp3';
                
//                 //const fs = require('fs');
//                 // const path = require('path');
//                 // const os = require('os');
//                 // console.log(os.tmpdir());
//                 // copied from https://cloud.google.com/text-to-speech/docs/quickstart-client-libraries#client-libraries-usage-nodejs
//                 //const util = require('util');
//                 const textToSpeech = require('@google-cloud/text-to-speech'); // Imports the Google Cloud client library
//                 const client = new textToSpeech.TextToSpeechClient(); // Creates a client

//                 let myWordFile = word.replace(/ /g,"_"); // replace spaces with underscores in the file name
//                 myWordFile = myWordFile.toLowerCase(); // convert the file name to lower case
//                 myWordFile = myWordFile + audioFormat; // append .mp3 to the file name;

//                 // copied from https://cloud.google.com/blog/products/gcp/use-google-cloud-client-libraries-to-store-files-save-entities-and-log-data
//                 // const {Storage} = require('@google-cloud/storage');
//                 // const storage = new Storage();
//                 // const bucket = storage.bucket('turnkey-charter-317009.appspot.com');
//                 //const fb=require('firebase/storage');
//                 let storageRef = fb.storage.ref();
//                 let metadata = {
//                     contentType: 'audio/mp3',
//                 };
//                 let filePath = `${myWordFile}`;
                
                

//                 const request = { // Construct the request
//                   input: {text: word},
//                   // Select the language and SSML Voice Gender (optional)
//                   voice: {languageCode: 'en-GB', ssmlGender: 'FEMALE'},
//                   // Select the type of audio encoding
//                   audioConfig: {audioEncoding: 'MP3'},
//                 };

//                 const options = { // construct the file to write
//                   metadata: {
//                     contentType: 'audio/mpeg',
//                     metadata: {
//                       source: 'Google Text-to-Speech'
//                     }
//                   }
//                 };

//                 // copied from https://cloud.google.com/text-to-speech/docs/quickstart-client-libraries#client-libraries-usage-nodejs
//                 const [response] = await client.synthesizeSpeech(request);
                
//                 // Write the binary audio content to a local file
//                 // const writeFile = util.promisify(fs.writeFile);
//                 // await writeFile(`output.mp3`, response.audioContent, 'binary');
//                 // console.log(`Audio content written to file: output.mp3`)
//                 // response.audioContent is the downloaded file


//                 const fileContents = new Buffer(response.audioContent, 'base64');
               
//                   let voiceRef = storageRef.child(`${myWordFile}`).putString(fileContents, fb.storage.StringFormat.DATA_URL);
//                   voiceRef.on(fb.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
//                     console.log("uploading");
//                   }, (e) => {
//                     console.error(e);
//                     console.log(JSON.stringify(e, null, 2));
//                   }, () => {
//                     var downloadURL = voiceRef.snapshot.downloadURL;
//                     console.log(downloadURL);
//                   });
                
//                 // const sendBlob=new Blob([fileContents], {type: 'audio/mpeg'});
//                 // await bucket.upload(sendBlob,{
//                 //   destination: myWordFile,
//                 // }).then(() => {
//                 //     console.log("File written to Cloud Storage.");
//                 //     return;
//                 //   })
//                 //   .catch((error) => {
//                 //     console.error(error);
//                 //   });


//                 // return await file.save(response.audioContent, options)
//                 // .then(() => {
//                 //   console.log("File written to Firebase Storage.")
//                 //   return;
//                 // })
//                 // .catch((error) => {
//                 //   console.error(error);
//                 // });
//       }
//       catch(err){
//         console.error(err);
//       }
           
//     } // close async function declaration

//     exports.Google_T2S = functions.https.onCall((change, context) => {
//       console.log("reached cloud function");
//           if (change.text !== undefined) 
//           {
//             console.log("reached if inside cloud function");
//             textToSpeechRequest(change);
//             console.log("reached after if inside cloud function");
//           } // close if


//     }); // close Google_T2S