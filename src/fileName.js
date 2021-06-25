export const fileName=(word)=>{
    let myWordFile = word.replace(/ /g,"_"); 
    myWordFile = myWordFile + '.mp3';
    return myWordFile;
}