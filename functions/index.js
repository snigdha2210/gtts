
const functions = require('firebase-functions');

const convertTextToFileName=(word)=>{
  let myWordFile = word.replace(/ /g,"_"); 
  myWordFile = myWordFile + '.mp3';
  console.log('file name generated');
  return myWordFile;
};

async function uploadSpeechFile(speechBase64Array,fileName,googleCloudFolderPath){
  // copied from https://cloud.google.com/blog/products/gcp/use-google-cloud-client-libraries-to-store-files-save-entities-and-log-data
  const {Storage} = require('@google-cloud/storage');
  const storage = new Storage();
  const bucket = storage.bucket('turnkey-charter-317009.appspot.com');
console.log('in the upload function');
  var stream = require('stream');
  var bufferStream = new stream.PassThrough();
  bufferStream.end(Buffer.from(speechBase64Array.audioContent, 'base64'));

  var file = bucket.file(`${googleCloudFolderPath}/${fileName}`);
  //Pipe the 'bufferStream' into a 'file.createWriteStream' method.
  bufferStream.pipe(file.createWriteStream({
      metadata: {
        contentType: 'audio/mp3',
        metadata: {
          source: 'Google Text-to-Speech',
        }
      },
      public: true
    }))
    .on('error', function(err) {
      console.error(err);
    })
    .on('finish', function() {
      // The file upload is complete.
      console.log('file uploaded');

      file.exists().then(function(data) {
        console.log("File in database exists ");
      });
        
      const config = {
        action: 'read',
        expires: '01-01-2026',
      };
        
      // Get the link to that file
      file.getSignedUrl(config, function(err, url) {
        if (err) {
          console.error(err);
          return;
        }
        console.log("Url is : " + url);
        return url;
      });
    });
    //   file
    // .exists()
    // .then((exists) => {
    //       if (exists[0]) {
    //         console.log("File exists");
    //         return exists[0];
    //       } else {
    //         console.log("File does not exist");
    //         return null;
    //       }
    //    })
    // });
    
    // const config = {
    //   action: 'read',
    // };
      
    // // Get the link to that file
    // file.getSignedUrl(config, function(err, url) {
    //   if (err) {
    //     console.error(err);
    //     return;
    //   }
        
    //   // The file is now available to
    //   // read from this URL
    //   console.log("Url is : " + url);
    //   return url;
    // });
}

async function checkFileNameInDirectory(fileName, googleCloudFolderPath,bucket){
  
  var file = bucket.file(`${googleCloudFolderPath}/${fileName}`);
  file
    .exists()
    .then((exists) => {
          if (exists[0]) {
            console.log("File exists");
            return 1;
          } else {
            console.log("File does not exist");
            return 0;
            
          }
       })
    
  // const config = {
  //   action: 'read',
  //   // A timestamp when this link will expire
  //   expires: '01-01-2026',
  // };
    
  // // Get the link to that file
  // fileRef.getSignedUrl(config, function(err, url) {
  //   if (err) {
  //     console.error(err);
  //     return;
  //   }
      
    // The file is now available to
    // read from this URL
    // console.log("Url is : " + url);
  // });

  // fetch(`https://storage.googleapis.com/turnkey-charter-317009.appspot.com/${googleCloudFolderPath}/${fileName}`, { method: 'HEAD' })
  //   .then(res => {
  //       if (res.ok) {
  //         check=1;
  //           console.log('file exists.');
  //           return check;
  //       } else {
  //           return check;
  //       }
  //   }).catch(err => console.log('Error:', err));

  // var http = new XMLHttpRequest();

  // http.open('HEAD', `https://storage.googleapis.com/turnkey-charter-317009.appspot.com/${googleCloudFolderPath}/${fileName}`, false);
  // http.send();
  // var check=0;
  //   check= (http.status !== 404);
  // return check;


  // Lists files in the bucket
  // const [files] = await bucket.getFiles({ prefix: googleCloudFolderPath});
  // var obj={
  //   url:'',
  //   check:0
  // };
  // const index = files.findIndex(x => x.name ===fileName);
  // if(index!==(-1)){
  //   obj.url=`https://storage.googleapis.com/turnkey-charter-317009.appspot.com/${files[index].name}`;
  //   obj.check=1;
  //   return obj; 
  // }else{
  //   return obj;
  // }

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
  const [response] = await client.synthesizeSpeech(request);
    console.log('textConverted');
    return [response];

  
}

async function GetReadyTextToSpeech(textToConvert) 
    {
                
                var myWordFile = convertTextToFileName(textToConvert); //returns name of the file
                const {Storage} = require('@google-cloud/storage');

                // Creates a client
                const storage = new Storage();
                const bucket = storage.bucket('turnkey-charter-317009.appspot.com');
                  // Lists files in the bucket
                  // const [files] = await bucket.getFiles();
                
                  // const index = files.findIndex(x => x.name ===myWordFile);
                  // if(index!==(-1)){
                  //   console.log(index+' duplicate');
                  //   return `https://storage.googleapis.com/turnkey-charter-317009.appspot.com/${files[index].name}`; 
                  // }
                // copied from https://cloud.google.com/blog/products/gcp/use-google-cloud-client-libraries-to-store-files-save-entities-and-log-data
                // const {Storage} = require('@google-cloud/storage');
                // const storage = new Storage();
                // const bucket = storage.bucket('turnkey-charter-317009.appspot.com');
                
                var check= checkFileNameInDirectory(myWordFile,'',bucket).then(()=>{
                  console.log(check);
                if(check===1){
                  console.log('duplicate');
                  return 'duplicate';
                }
                })
                
                               
  
                  // const [response] = await client.synthesizeSpeech(request);
                  const [response]= await textToSpeech(textToConvert);
                  const url=uploadSpeechFile(response,myWordFile,''); //upload file to google cloud storage
                  return url;                
    } 

    exports.GetReadyTextToSpeechCloudFuntion = functions.https.onCall((change, context) => {
     
          if (change.text !== undefined) 
          {
            const url = GetReadyTextToSpeech(change.text);
            return url;
          } 


    });