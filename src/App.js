import './App.css';
import fb from './config/firebaseConfig';
// import firebase from 'firebase';
// import { fileName } from './fileName';

// var storageRef = firebase.storage().ref();

const onSubmit = async (e) => {
  e.preventDefault();
  const textToConvert = e.target.textToConvert.value;
  if (!textToConvert) {
    return;
  }

    const textConverter = fb.functions().httpsCallable('GetReadyTextToSpeechCloudFuntion');
    textConverter({ text: textToConvert })
    .then((result) => {
      console.log(result.data);
    });
}


// function displayImage(ref) {
//   ref.getDownloadURL().then(function(url) {
//     url=url.split('?')[0];
//     console.log(url);
//     if(url===`https://firebasestorage.googleapis.com/v0/b/turnkey-charter-317009.appspot.com/o/${file}`){
//       console.log('duplicate');
//       console.log(`https://storage.googleapis.com/turnkey-charter-317009.appspot.com/${file}`);
//       flag=1;
//       return;
//     }
//   }).catch(function(error) {
//     console.error(error);
//   });
// }



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
