import multer from "multer";
const storageEngine = (path,fileNameLength = 26,fileName)=>{
    const letters = [1,2,3,4,5,6,7,8,9,0,'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

    return  multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path);
    },
    filename:(req,file,cb)=>{
        if(fileName){
            return cb(null,fileName);
        }
         return cb(null,`${generateUniqueName(letters,fileNameLength)}.${file.originalname}`);
    }
});
}

const generateUniqueName = (letters,length)=>{
    let name = ''
    for(let i = 0; i < length; i++){
       const index = Math.floor(Math.random() * letters.length-1);
       const letter = letters[index];
       name += letter
    }
    return name;

}
export default storageEngine