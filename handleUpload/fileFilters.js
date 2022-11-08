const filters = (ALLOWED_EXTENSIONS = []) =>{
    return  (req,file,cb)=>{
        if(ALLOWED_EXTENSIONS.length == 0){
            return cb(null,true);
        }
        const {mimetype} = file;
        const extension =mimetype.split('/')[1];
        const isAllowed = ALLOWED_EXTENSIONS.includes(extension);
        if(!isAllowed){
            return cb(new Error("file extensions is not allowed"),false);
        } 
        return cb(null,true);
}   
}


export default filters