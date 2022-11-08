# cutomized file uploading using multers

## note

this packge use the modern javascript feature i.e ES6 syntax in the server side. if you are using common js you may not be able to use this package

## environment setup

1. install multer in you working project
2. copy past the package inside you project. you can paste it on the root of you project (recommended) or anywhere inside your project
3. navigate to your api routes and import the index.js file.
4. The return value of is a function which you have to pass atleast on arguement which is the path to the folder that you want to upload files.
5. the function can also take a second arguement which is an array of file extensions to allow for upload.if the array is no provided, you can upload all file extension
6. the function can also take a third arguement which is an object of options.in this object you can limit the file size you want to upload by passing the size property equal to the value in Bytes.by default it will allow up to a maximum of 10gb of data .you can alse specify the name of the file that you want by passing a fileName to this options object. by default if fileName is not given, the package will generate a unique name for the file. it will generate 26 charactors and combine them with the file original name. you can change the value of the default fileName length by passing a fileNameLength property to the options object
7. the file return an object which you can assign to a varaible and call any multer function like single or multiple
