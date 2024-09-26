const uuid4 = require('uuid4');
const Users = require('../Users/User.js');
const Base = require('.././Postgres_DB.js');
const mailValidator = require('email-validator');
const Config = require('.././Config.js');

var nodemailer = require('nodemailer');

let i;

let Logged_Users = [];          // array for all logged users. Retain a user id and key session and last acction datatime 

let Signup_Users = [];          // array for all signin users intended for wating for verification by link in email massage.  

/*

-------------------------Function intentend for logon a single user to hia account


*/

function Login(req,res){

    let UserName = "";
    let Password = "";
    let user_password = "";


    res.writeHead(200,{'conten-type' : 'text/html; charset ="iso-8859-2"',
        'Access-Control-Allow-Origin' : '*',
        }
    );

    req.on('data',async (buffer)=>{

            const message = buffer.toString();
            
            let indeks = message.search("User");

            if(indeks > 0)
            {

                for(i=indeks+9; message.charAt(i)!='\r';i++)            // Get user name from FormData
                {
                    UserName += message.charAt(i);
                
                }

            }

            indeks = message.search("Password");

            if(indeks > 0)
            {

                for(i=indeks+13; message.charAt(i)!='\r';i++)           // Get user password from FormData
                {
                    Password += message.charAt(i);
                
                }

            }

            if(UserName!="" && Password!="")                        // Password check
            {

                if(mailValidator.validate(UserName))                // Eamil validation
                {
                    const result = await Base.QueryUserByName(UserName);

                    if(result && result.length == 1)
                    {
                        user_password = await result[0].password;

                        if(Password == user_password)
                        {

                            console.log("Login execute....");
                            const RemoteIp = req.headers['x-forwarded-for'] || res.socket.remoteAddress
                            console.log("IP:" + RemoteIp);

                        let Logged = Logged_Users.find((User)=>{
                                if(User['ip'] === res.socket.remoteAddress && User['user_id'] === result[0].user_id)
                                {
                                    return true;
                                }
                            });

                            if(Logged)
                            {
                                const uid = {uid : Logged['s_key']};
                                res.end(JSON.stringify(uid));

                                return;
                                
                            }
                        
                            const uid = {uid : uuid4()};
                            const date = new Date();

                            Logged_Users.push({
                                user_id : result[0].user_id, 
                                s_key : uid['uid'],
                                ip : RemoteIp,
                                lastRequest : date
                            });

                            res.end(JSON.stringify(uid));
                        
                            return;
                        }
                    }
                }

            }

            const uid = {uid : 'NULL'};
            res.end(JSON.stringify(uid));

        }

    )
};


/*

-------------------------Function intentend for add new user


*/


function Signup(req, res)
{

    console.log("Signup execute....")


    req.on('data', async (buffer)=>{

        const UserData = JSON.parse(buffer);

        if(mailValidator.validate(UserData.username))                //Email validation
        {

            const result = await Base.QueryUserByName(UserData.username);

            if(result.length == 1)
            {

                const resp = {response : 'EXIST'};

                res.writeHead(200,{'conten-type' : 'application/json',
                    'Access-Control-Allow-Origin' : '*',
                
                    });
            
                res.end(JSON.stringify(resp));

                return;
            }

            const uid = uuid4();

            var transporter = nodemailer.createTransport({
                host: 'serwer2486383.home.pl',
                secure: true,
                auth: {
                  user: 'netshop@piccante.opole.pl',
                  pass: 'BazanT1312#'
                }
              });
              
              var mailOptions = {
                from: 'netshop@piccante.opole.pl',
                to: UserData.username,
                subject: 'Veryfi your NetShop account',
                html: `<h3>Hello<br>To verify your account please click in link below<br><br>
                <a href = "${Config.Server_Url}/VerifyAccount?uid=${uid}">VeryficationLink_${uid}</a></h3>`
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });


            const date = new Date();

            Signup_Users.push({
                s_key : uid,
                Login : UserData.username,
                Password : UserData.password,
                Name : UserData.name,
                ip : res.socket.remoteAddress,
                createdTime : date,
            });

            const resp = {response : 'MAIL'};

            res.writeHead(200,{'conten-type' : 'application/json',
                'Access-Control-Allow-Origin' : '*',
            
                });
        
            res.end(JSON.stringify(resp));

            return;


        }



       const resp = {response : 'NULL'};

       res.writeHead(200,{'conten-type' : 'application/json',
           'Access-Control-Allow-Origin' : '*',
       
           });
   
       res.end(JSON.stringify(resp));

    })

}


module.exports = {
    Login,
    Signup,
    Logged_Users,
    Signup_Users
}