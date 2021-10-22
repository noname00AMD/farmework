// site
process.env.HOST_NAME = 'localhost';
process.env.PROTOCOL = 'http';
process.env.SITE_URL = 'http://localhost';
process.env.NODE_ENV = 'development';
process.env.SITE_NAME = '365 portal';
process.env.SITE_DESCRIPTION = '365 portal';
process.env.HOME = 'mongodb://localhost:27017/';
// comment
process.env.COMMENT_STATUS = true;
// notificatiom
process.env.NOTIFICATION = true;
// mail
process.env.EMAIL = true;


// DB
// process.env.MONGO_URL = 'mongodb://localhost:27017/';



// ------------------------------------------!!! remove in production enviroment !!!-------------------------------------//

// DB
process.env.MONGO_URL = 'mongodb+srv://admin:admin@cluster0.gmmv9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

// ADMIN
process.env.ADMIN_EMAIL = 'mongodb://localhost:27017/';
process.env.ADMIN_PASS = 'mongodb://localhost:27017/';

// mail
process.env.EMAIL_SERVER_URL = 'mail.google.com';
process.env.EMAIL_SERVER_LOGIN = "noname00.1994@gmail.com";
process.env.EMAIL_SERVER_PASS = "";
process.env.EMAIL_SERVER_PORT = 2365;
// console.log(process.env);

