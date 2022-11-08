import multer from "multer";
import filters from "./fileFilters.js";
import storageEngine from "./storageEngine.js";

const MulterFileUpload = (path,ALLOWED_EXTENSIONS,options)=>{
    const size = 1024 * 1024 * 100000; // limit file size to 10GBs by default
    return multer({
    storage:storageEngine(path,options?.fileNameLength,options?.fileName),
    limits:{fileSize: options?.size || size},
    fileFilter:filters(ALLOWED_EXTENSIONS)
});
}
export default MulterFileUpload