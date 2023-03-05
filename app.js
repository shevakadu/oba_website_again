// this whole thing sucks so i much i hate it
// i was forced to make another copy of this website
// right when i started rewriting it (this file)

const express    = require('express')
const bodyparser = require('body-parser')
const cors       = require('cors')
const fs         = require('fs')
const path       = require('path')
const mysql      = require('mysql2')

const app        = express()
const port       = 3000

// const connection = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "root",
//     database: "the_great_database"
// })

const connection = mysql.createConnection({
    host: "sql7.freemysqlhosting.net",
    user: "sql7603041",
    password: "NMIa5mfRpt",
    database: "sql7603041"
})

console.log("start: Step 2 - Connect MySQL")
connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    console.log("start: Step 2 - Succesful!")

    console.log(`
    ================================================
    ------------------------------------------------
    WELCOME TO THE OBA SERVER SOFTWARE CONSOLE PANEL
    WELCOME TO THE OBA SERVER SOFTWARE CONSOLE PANEL
    WELCOME TO THE OBA SERVER SOFTWARE CONSOLE PANEL
    ------------------------------------------------

    If you see this, this means that the server has
    succesfully started.
    You can make requests to this host and some
    requests will be displayed here.

    Information to assist you:
    (make sure not to share it!)

    ------------------------------------------------
    PASSWORDS:
    Moderator tools authentification dialog
    credentials ----- (without quotes)
    Login      ;9y83!KkKLG:/
    Password   )g<-]7V#,W^8rFQZmxY
    ------------------------------------------------
    The server is running at:
    __dirname          ${__dirname}
    process.cwd()      ${process.cwd()}
    ./                 ${path.resolve("./")}
    filename           ${__filename}
    ------------------------------------------------
    ================================================
    `)

    // connection.query("SELECT * FROM submittors_accounts", function (err, result, fields) {
    //     if (err) throw err;
    //     console.log(result);
    // });
});

// We are using our packages here
app.use(bodyparser.json());       // to support JSON-encoded bodies

app.use(bodyparser.urlencoded({     // to support URL-encoded bodies
 extended: true}));

app.use(cors())

// Serve the index.html page.
app.get("/", (request, response) => {
    response.writeHead(200, {"Content-Type": "text/html"})
    response.write(fs.readFileSync('index.html'))
    response.end()
})

// Serve index.html's parts.
app.get("*index_stuff*", (request, response) => {
    if (path.extname(request.originalUrl) == '.js') {
        response.writeHead(200, {"Content-Type": "application/javascript"})
    } else if (path.extname(request.originalUrl) == '.css') {
        response.writeHead(200, {"Content-Type": "text/css"})
    } else if (path.extname(request.originalUrl) == '.png') {
        response.writeHead(200, {"Content-Type": "image/png"})
    } else if (path.extname(request.originalUrl) == '.jpg') {
        response.writeHead(200, {"Content-Type": "image/jpeg"})
    } else if (path.extname(request.originalUrl) == '.svg') {
        response.writeHead(200, {"Content-Type": "image/svg+xml"})
    }
    response.write(fs.readFileSync(__dirname + request.originalUrl))
    response.end()
})

// Serve static pages and their parts if requested.
app.get("*static_pages*", (request, response) => {
    if (path.extname(request.originalUrl) == '.html') {
        response.writeHead(200, {"Content-Type": "text/html"})
    } else if (path.extname(request.originalUrl) == '.css') {
        response.writeHead(200, {"Content-Type": "text/css"})
    } else if (path.extname(request.originalUrl) == '.png') {
        response.writeHead(200, {"Content-Type": "image/png"})
    } else if (path.extname(request.originalUrl) == '.jpg') {
        response.writeHead(200, {"Content-Type": "image/jpeg"})
    } else if (path.extname(request.originalUrl) == '.svg') {
        response.writeHead(200, {"Content-Type": "image/svg+xml"})
    }
    try {
        response.write(fs.readFileSync(__dirname + request.originalUrl))
    } catch (error) {
        response.write(fs.readFileSync("404.html"))
        console.log(error)
    }
    response.end()
})

// Serve active pages and their parts if requested.
app.get("*active_pages*", (request, response) => {
    if (path.extname(request.originalUrl) == '.html') {
        response.writeHead(200, {"Content-Type": "text/html"})
    } else if (path.extname(request.originalUrl) == '.css') {
        response.writeHead(200, {"Content-Type": "text/css"})
    } else if (path.extname(request.originalUrl) == '.png') {
        response.writeHead(200, {"Content-Type": "image/png"})
    } else if (path.extname(request.originalUrl) == '.jpg') {
        response.writeHead(200, {"Content-Type": "image/jpeg"})
    } else if (path.extname(request.originalUrl) == '.svg') {
        response.writeHead(200, {"Content-Type": "image/svg+xml"})
    }
    try {
        response.write(fs.readFileSync(__dirname + request.originalUrl))
    } catch (error) {
        response.write(fs.readFileSync("404.html"))
        console.log(error)
    }
    response.end()
})

// If requested, check if a submittor account exists.
app.post('/check_submittor_account', (req, res) => {
    console.log("Request body??????????????")
    console.log(req.body)

    var sql = `SELECT * FROM submittors_accounts WHERE email = '${req.body.email}'`
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
        if (result.length != 1) {
            res.writeHead(200, { 'Content-Type':'text/plain'});
            res.end("Login-Denied:Incorrect-Email"); 
        } else {
            console.log("Email exists!")
            console.log("Checking if password matches...")
            var sql = `SELECT * FROM submittors_accounts WHERE password = '${req.body.password}'`
            connection.query(sql, function (err, result) {
                if (err) throw err;
                console.log(result);
                if (result.length != 1) {
                    console.log("Nope!")
                    res.writeHead(200, { 'Content-Type':'text/plain'});
                    res.end("Login-Denied:Incorrect-Password"); 
                } else {
                    console.log("Yay! They match!!!")
                    res.writeHead(200, { 'Content-Type':'text/plain'});
                    // res.writeHead(200, { 'Content-Type':'text/html'});
                    // html = fs.readFileSync('./voting.html');
                    res.end("Login-Allowed:Submit"); 
                }
            });
        }
    })
})

// Create submittor accounts.
app.post('/create_submittor_account', (req, res) => {
    var sql = `SELECT * FROM submittors_accounts WHERE email = '${req.body.email}'`
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
        if (result.length > 0) {
            res.writeHead(200, { 'Content-Type':'text/plain'});
            res.end("Register-Denied:Exists"); 
        } else {
            var sql = `INSERT INTO submittors_accounts (agency, email, phone, fullname, password) VALUES ('${req.body.agency}', '${req.body.email}', '${req.body.phonenumber}', '${req.body.fullname}', '${req.body.password}')`;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
                res.writeHead(200, { 'Content-Type':'text/plain'});
                res.end("Register-Complete:Submit"); 
            });
        }
    })
})

// Submit a work.
app.post('/submit_work', (req, res) => {
    var sql = `INSERT INTO submissions (
        branding_category,
        industry,
        description,
        brand_name,
        brand_idea,
        brand_exityear,
        brand_audience,
        project_goal,
        project_meters_before,
        project_meters_after,
        brand_success,
        metering,
        market_state,
        market_obstacles,
        brand_communication,
        success_factors,
        brand_philosophy,
        surname,
        name,
        father_name,
        job,
        videourl,
        email
    ) VALUES (
        '${req.body['branding-category']}',
        '${req.body['industry']}',
        '${req.body['description']}',
        '${req.body['brand-name']}',
        '${req.body['brand-idea']}',
        '${req.body['brand-exityear']}',
        '${req.body['brand-audience']}',
        '${req.body['project-goal']}',
        '${req.body['project-meters-before']}',
        '${req.body['project-meters-after']}',
        '${req.body['brand-success']}',
        '${req.body['metering']}',
        '${req.body['market-state']}',
        '${req.body['market-obstacles']}',
        '${req.body['brand-communication']}',
        '${req.body['success-factors']}',
        '${req.body['brand-philosophy']}',
        '${req.body['surname']}',
        '${req.body['name']}',
        '${req.body['father-name']}',
        '${req.body['job']}',
        '${req.body['videourl']}',
        '${req.body['email']}'
    )`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.writeHead(200, { 'Content-Type':'text/plain'});
        res.end("Submission-Complete:Submit"); 
    });
})

// Verify moderator credentials (HARD CODED!).
app.post('/check_moderator_account', (req, res) => {
    if (req.body.username == ";9y83!KkKLG:/") {
        if (req.body.password == ")g<-]7V#,W^8rFQZmxY") {
            res.writeHead(200, { 'Content-Type':'text/plain'});
            res.end("ModLogin-Allowed:Select");
        } else {
            res.writeHead(200, { 'Content-Type':'text/plain'});
            res.end("ModLogin-Denied:Incorrect-Key");
        }
    } else {
        res.writeHead(200, { 'Content-Type':'text/plain'});
        res.end("ModLogin-Denied:Incorrect-Key");
    }
})

app.post('/get_all_submissions', (req, res) => {
    if (req.body.username == ";9y83!KkKLG:/") {
        if (req.body.password == ")g<-]7V#,W^8rFQZmxY") {
            var sql = "SELECT * FROM submissions"
            connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                console.log(result)
                res.writeHead(200, { 'Content-Type':'application/json'});
                res.end(JSON.stringify(result)); 
            });
        } else {
            res.writeHead(200, { 'Content-Type':'text/plain'});
            res.end("ModLogin-Denied:Incorrect-Key");
        }
    } else {
        res.writeHead(200, { 'Content-Type':'text/plain'});
        res.end("ModLogin-Denied:Incorrect-Key");
    }
})


console.log("start: Step 1 - Start server")
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
    console.log("start: Step 1 - Succesful!")

    console.log("The server is running at:")
    console.log("__dirname     : ", __dirname)
    console.log("process.cwd() : ", process.cwd())
    console.log("./            : ", path.resolve("./"))
    console.log("filename      : ", __filename)
})