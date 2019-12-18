var express = require('express'); //initializes express to set up web server
var myParser = require("body-parser"); //initializes body-parser to set up web server
var filename = 'user_data.json' //Defines the user_data.json array as an object
var app = express(); //Executes Express
var qs = require('querystring'); //Needs querystring in order to initiate functions
var cookieParser = require('cookie-parser');
var session = require('express-session');
fs = require('fs');
data = fs.readFileSync(filename, 'utf-8'); //Reads the file and returns back with data and then continues with code as requested.
users_reg_data = JSON.parse(data);


fs = require('fs'); //Use the file system module 
app.use(myParser.urlencoded({ extended: true }));
//returns a boolean (true or false) (Opens file only if it exists)
if (fs.existsSync(filename)) {
    stats = fs.statSync(filename) //gets the stats of your file


    data = fs.readFileSync(filename, 'utf-8'); //Reads the file and returns back with data and then continues with code as requested.

    users_reg_data = JSON.parse(data); //Parses data in order to turn string into an object
}


//************************ COOKIES LOGIN ***************************

app.get("/login", function (request, response) {
    if(typeof request.cookies.username != 'undefined'){
        response.send(`Welcome back ${request.cookies.username}!` + '<br>'
        + `you last logged in on ${request.cookies.last_login}`);
    }
    // Give a simple login form (responds by generating a login page)
    str = `
<body>
<form action="" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
 });

//GETS TO POINTS PAGE


// Process login form POST and redirect to Total Points Page. If incorrect login info is inputted, show error
app.post("/login.html", function (request, response) {
    the_username = request.body.username; //makes username 
    //Validate login data
    if (typeof users_reg_data[the_username] != 'undefined') {   //To check if the username exists in the json data
        if (users_reg_data[the_username].password == request.body.password) {

            response.redirect('/Total_ptpg.html?' + `&username=${the_username}`); //Adds username to Total Points Page
        }

        else {
            response.send('Invalid Login: Please hit the back button and try again'); //if password isn't equal to password existing in jsonn data, show error message

        }


    }

});




app.post("/webmasterLogin.html", function (request, response) {
    the_username = request.body.username; //makes username 

    console.log("Username=" + the_username);
    //Validate login data
    if (typeof users_reg_data[the_username] != 'undefined') {   //To check if the username exists in the json data
        the_usertype = users_reg_data[the_username].usertype;
        if (the_usertype == 'Webmaster') {   //To check if the username exists in the json data 

            response.redirect('/master_mainpg.html?' + `&username=${the_username}`);
        }
    }
});

app.post("/ptsadditionpage.html", function (request, response) {
    the_username = request.body.username; //makes username 
    errors = {};

    //Validate login data
    if (Object.keys(errors).length == 0) {
        users_reg_data[the_username].username = request.body.username
        console.log("1");
        users_reg_data[the_username].points = request.body.points
        response.send(users_reg_data[the_username].points);

        fs.writeFileSync(filename, JSON.stringify(users_reg_data)); //Writes registration info into the userdata json file
        console.log("3");
        response.redirect("/Total_ptpg.html?"); //If all good, send to the invoice page with username/quantity info
    }
}
);


//DISPLAY GK MEMBER LIST
app.post("/Total_ptpg.html", function (request, response) {
    the_username = request.body.username; //makes username 
    str = `<table border=1>`;
    for (i = 0; i < users_reg_data.length; i++) {
        str += '<table>';
        str += `<tr><td>${users_reg_data[i].email}</td ></tr > `;
        str += `<tr><td>${users_reg_data[i].fullname}</td ></tr > `;
        str += `<tr><td>${users_reg_data[i].points}</td ></tr > `;
        str += '</table>';
        response.send(str);
    }
});

//*************************** COOKIES REGISTER *******************
app.get("/register", function (request, response) {
    // Give a simple register form
    str = `
<body>
    <form action="" method="POST">
        <input type="text" name="username" size="40" placeholder="enter username" ><br />
        <input type="password" name="password" size="40" placeholder="enter password"><br />
        <input type="password" name="repeat_password" size="40" placeholder="enter password again"><br />
        <input type="email" name="email" size="40" placeholder="enter email"><br />
        <input type="submit" value="Submit" id="submit">
    </form>
</body>
    `;
    response.send(str);
 });

 
//*************************** REGISTER NEW USER *******************
app.post("/registration.html", function (request, response) {
    // process a simple register form
    username = request.body.username;//retrieves the username data
    errors = {};//Checks to see if username already exists

    //Username Validation
    if (typeof users_reg_data[username] != 'undefined') {
        errors.username_error = "Username is Already in Use"; //if username is in json file, say username is already in use
    }
    if ((/[a-z0-9]+/).test(request.body.username) == false) { //only allows numbers and letters for the username
        errors.username_error = "Only numbers/letters";
    }
    if ((username.length > 10) == true) {
        errors.username_error = "Please make your username shorter"; //if length is more than 10, show error to make the username shorter
    }
    if ((username.length < 4) == true) {
        errors.username_error = "Please make your username longer"; //if length is less than 4, show error to make the username longer
    }




    //Fullname Validation // got help for the first fullname validation from Mr. Port
    fullname = request.body.fullname;//retrieves the fullname data
    if ((/[a-zA-Z]+[ ]+[a-zA-Z]+/).test(request.body.fullname) == false) {
        errors.fullname_error = "Only use letters and a space";
    }

    if ((fullname.length > 30) == true) {
        errors.fullname_error = "Please make your full name shorter. 30 characters max"; //if length is greater than 30, send error that 30 characters are max
    }


    //Email Validation//
    if ((/[a-z0-9._]+@[a-z0-9]+\.[a-z]+/).test(request.body.email) == false) {
        errors.email_error = "Please enter proper email";
    }




    console.log(errors, users_reg_data);
    //If there are 0 errors, request all registration info
    if (Object.keys(errors).length == 0) {
        users_reg_data[username] = {};
        users_reg_data[username].username = request.body.username
        users_reg_data[username].password = request.body.password;
        users_reg_data[username].email = request.body.email;
        users_reg_data[username].fullname = request.body.fullname;

        fs.writeFileSync(filename, JSON.stringify(users_reg_data)); //Writes registration info into the userdata json file

        response.redirect("/Total_ptpg.html?" + `& username=${username} `); //If all good, send to the total point page with username/quantity info
    } else {
        qstring = qs.stringify(request.body) + "&" + qs.stringify(errors);
        response.redirect('/registration.html?' + qstring); //if there are errors, send back to registration page to retype
    }

});


//********************** COOKIES *************************** 
app.get('/use_session', function (request, response) {
    response.send('Welcome your session ID is ${request.session.id}');
})

app.get('/set_cookie', function (request, response) {
    response.cookie('myname', 'Jayla Kaita', { maxAge: 5 * 60000 }).send('cookie set');
});

app.get('/use_cookie', function (request, response) {
    output = "No cookie with myname";
    if (typeof request.cookies.myname != 'underfined') {
        output = `Welcome to the Use Cookie page ${request.cookies.myname}`;
        response.send(output);
    }
});




app.listen(8080, () => console.log(`listening on port 8080`));
app.use(cookieParser());
app.use(session({ secret: "ITM352 rocks!" }));

app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path); //respond to HTTP request by sending type of request and the path of request
    next(); //calls the middleware function
});
app.use(express.static('./public')); //sets up a request to respond to GET and looks for the file from public (sets up static web server)
app.listen(8080, () => console.log(`listening on port 8080`)); //listens on Port 8080




