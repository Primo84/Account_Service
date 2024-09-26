const Login = require('./Login/Login.js');
const RouteFunctions = require('./RouteFunctions.js');
const Http = require('http');
const colors = require('colors');
const fs = require('fs');
const path = require('path');
const Config = require('./Config.js');

console.log('NetShop is starting......');



// const keyPem = fs.readFileSync(path.join(__dirname,"Cert", "key.pem")).toString();
// const certPem = fs.readFileSync(path.join(__dirname,"Cert", "cert.pem")).toString();

// const Server = Http.createServer({
//             key: keyPem,
//             cert: certPem
//         },
// (req,res)=>{

const Server = Http.createServer((req,res)=>{

    console.log("Request incomming.... ");

    if(req.url.startsWith('/User'))
    {
        if(req.method == 'GET')
            RouteFunctions.SetCookieAndRedirect(req,res);
        else RouteFunctions.SendMainResponse(res);
    }
    else if(req.url.startsWith('/VerifyAccount'))
    {
        if(req.method == 'GET')
            RouteFunctions.CreateNewUser(req,res);
        else RouteFunctions.SendMainResponse(res);
    }
    else
        switch(req.url)
        {
            case '/':

            console.log("Main Page Execute...");

                if(req.method == 'GET')
                    RouteFunctions.SendMainPage(req,res);
                else RouteFunctions.SendMainResponse(res);

                break;
    
            case '/Login':

                if(req.method == 'POST')
                    Login.Login(req, res);
                else if(req.method == "OPTIONS")
                    {
                        res.writeHead(200,{'conten-type' : 'text/html',
                            'Access-Control-Allow-Origin' : '*',
                            'Access-Control-Allow-Methods' : '*',
                            'Access-Control-Allow-Headers': '*'
                                // 'Access-Control-Allow-Credentials' : true,
                            // 'Location' : 'https://www.wp.pl'
                        
                            });
                        
                            res.end();
                    }
                else RouteFunctions.SendMainResponse(res);

                break;

            case '/Logout':

                if(req.method == 'GET')
                    RouteFunctions.Logout(req, res);
                else if(req.method == "OPTIONS")
                {
                    res.writeHead(200,{'conten-type' : 'text/html',
                        'Access-Control-Allow-Origin' : '*',
                        'Access-Control-Allow-Methods' : '*',
                        'Access-Control-Allow-Headers': '*'
                            // 'Access-Control-Allow-Credentials' : true,
                        // 'Location' : 'https://www.wp.pl'
                    
                        });
                    
                        res.end();
                }
                else RouteFunctions.SendMainResponse(res);

                break;

            case '/Signup':

                if(req.method == 'POST')
                    Login.Signup(req, res);
                else if(req.method == "OPTIONS")
                    {
                        res.writeHead(200,{'conten-type' : 'text/html',
                            'Access-Control-Allow-Origin' : '*',
                            'Access-Control-Allow-Methods' : '*',
                            'Access-Control-Allow-Headers': '*'
                                // 'Access-Control-Allow-Credentials' : true,
                            // 'Location' : 'https://www.wp.pl'
                        
                            });
                        
                            res.end();
                    }
                else RouteFunctions.SendMainResponse(res);

                break;

            default : 
            {   
                if(req.method == 'GET')
                    RouteFunctions.SendRequestFile(req, res);
                else RouteFunctions.SendMainResponse(res);

                break;
            }

        }             
    }
    
).listen(Config.Port,()=>{console.log(`Server is listening at port ${Config.Port}`.green)}); 
