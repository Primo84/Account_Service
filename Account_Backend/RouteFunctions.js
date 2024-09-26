const cookiesParse = require('cookie-parse');
const Users = require('./Users/User.js');
const Login = require('./Login/Login.js');
const fs = require('fs');
const uuid4 = require('uuid4');
const path = require('path');
const Base = require('./Postgres_DB.js');
const Config = require('./Config.js')

const veryfyAccountLinkTime = 3600;
const latRequestTime = 300;

/*

-------------------------Function check dates and return differents in miliseconds


*/


function checkDates(priorDate, laterDate)
{

    const diff = (laterDate.getTime() - priorDate.getTime()) / 1000;

    return diff;

}




/*

-------------------------Function send cookie sesion key to client


*/

function SetCookieAndRedirect(req,res)
{
    const paramStr = req.url.slice(6,req.url.length);
    const urlParams = new URLSearchParams(paramStr);

    if(urlParams.has('uid'))
    {
        res.setHeader('Set-Cookie',[`L_Key=${urlParams.get('uid')}`]);

    }

    res.writeHead(302,{'Conten-Type' : 'text/html',
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Credentials' : true,
    'Location' : Config.Server_Url
    });

    res.end();
}


/*

-------------------------Function create new usef after veryfication process


*/

function CreateNewUser(req,res)
{
    const paramStr = req.url.slice(14,req.url.length);
    const urlParams = new URLSearchParams(paramStr);

    if(urlParams.has('uid'))
    {
        let SigninIndex = -1;

        SigninIndex = Login.Signup_Users.findIndex((sUser)=>{
            return sUser.s_key === urlParams.get('uid');
        })
    
        if(SigninIndex >= 0)
        {
            const date = new Date();

            const timeElipsed = checkDates(Login.Signup_Users[SigninIndex].createdTime, date);

            if(timeElipsed > veryfyAccountLinkTime)
            {
                Login.Signup_Users.splice(SigninIndex,1);
                SendMainResponse(res);
                return;
            }

            const SigninUser = Login.Signup_Users.splice(SigninIndex,1);

            if(!SigninUser)
            {
                SendMainResponse(res);
                return;

            }

            const uuid = uuid4();

            fs.readFile(path.join(__dirname, 'Users', 'MainUserHtmlCode.html'), 'utf8', (err,buff)=>{
                if(err)
                {
                    console.log('Error: ',err)
                    SendMainResponse(res);
                    return;
                }
                else
                {
                    fs.mkdir(path.join(__dirname, 'Users', uuid, ),(err)=>{
                        if(err)
                        {
                            console.log('Error: ',err);
                            SendMainResponse(res);
                            return;
                        }
                        else
                        {
                        
                            fs.mkdir(path.join(__dirname, 'Users', uuid, 'Image'),(err)=>{
                                if(err)
                                {
                                    console.log('Error: ',err);
                                    SendMainResponse(res);
                                    return;
                                }
                                else
                                {
                                    const replacedBuffer = buff.replace('NetShop@gmail.com', SigninUser[0].Login);

                                    // const encodeBuffer = legacyEncoder.encode(replacedBuffer,'iso_8859-2', {'mode': 'html'});

                                    fs.writeFile(path.join(__dirname, 'Users', uuid, 'index.html'), replacedBuffer, (err)=>{
                                        if(err)
                                        {
                                            console.log('Error :',err);
                                            SendMainResponse(res);
                                            return;
                                        }
                                        else
                                        {
                                            fs.copyFile(path.join(__dirname, 'Users', 'Larva.png'), path.join(__dirname, 'Users', uuid, 'Image', 'Larva.png'), async (err)=>{
                                                
                                                if(err)
                                                {
                                                    console.log('Error Copy Larva.png',err)
                                                    SendMainResponse(res);
                                                    return;
                                                }
                                                else
                                                {

                                                    const resp =  await  Base.CreateNewUser(uuid, SigninUser[0].Name, SigninUser[0].Login, SigninUser[0].Password);

                                                    if(resp)
                                                    {
                                                        const date = new Date();

                                                        Login.Logged_Users.push({
                                                            user_id : uuid, 
                                                            s_key : urlParams.get('uid'),
                                                            ip : res.socket.remoteAddress,
                                                            lastRequest : date
                                                        });
                                                    
                                                        res.setHeader('Set-Cookie',[`L_Key=${urlParams.get('uid')}`]);

                                                        res.writeHead(302,{'Conten-Type' : 'text/html',
                                                            'Access-Control-Allow-Origin' : '*',
                                                            'Access-Control-Allow-Credentials' : true,
                                                            'Location' : Config.Server_Url
                                                            });

                                                        res.end();
                                                    }
                                                    else
                                                        SendMainResponse(res);
                                                    return;

                                                }

                                            });

                                        } //copy larva.png and write index.html
                                    });     //Write index.html

                                }       //mkdir user/image
                            });         //fs.mkdir user/image

                        }
                    });             //mkdir users


                }
            });

        }
        else
            SendMainResponse(res);
    }
    else
        SendMainResponse(res);

}


/*

-------------------------Function send main page to client


*/


function SendMainResponse(res)
{
    res.writeHead(200,{'conten-type' : 'text/html',
        'Access-Control-Allow-Origin' : '*',
    
        });
    
        res.end("<h1>Hello Main Page...</h1>");
}


/*

-------------------------Function send main page to client


*/

function SendMainPage(req,res)
{
    console.log("Main Page execute....");

    const cookies = req.headers['cookie'];

    if(cookies)
    {
        cookieObj = cookiesParse.parse(cookies);

        if(cookieObj.hasOwnProperty('L_Key'))
        {
            let LoggedUserIndex = -1;

            const CurrentUser = Login.Logged_Users.find((User, index)=>{
                    if(User.s_key === cookieObj.L_Key)
                    {
                        LoggedUserIndex = index;
                        return true;
                    }
                })

            if(CurrentUser)
            {
                const newData = new Date();

                const timeElipsed = checkDates(CurrentUser.lastRequest , newData);

                if(timeElipsed < latRequestTime) 
                {

                    delete CurrentUser.lastRequest;
                    CurrentUser.lastRequest = newData;

                    Users.loadUserMainPage(CurrentUser.user_id, res);
                }
                else
                {

                    Login.Logged_Users.splice(LoggedUserIndex, 1);

                    res.setHeader('Set-Cookie', 'L_Key=deleted; Max-Age=0');
                    
                    res.writeHead(302,{'Conten-Type' : 'text/html',
                    'Access-Control-Allow-Origin' : '*',
                    'Access-Control-Allow-Credentials' : true,
                    'Location' : Config.Server_Url
                    });

                    res.end("");

                }

                return;    
            }
        }
    }
    
    SendMainResponse(res);

}


/*

-------------------------Function intentend for logon a single user to his account


*/

function Logout(req,res)
{

    console.log("Logout execute....");

    const cookies = req.headers['cookie'];

    if(cookies)
    {
        cookieObj = cookiesParse.parse(cookies);

        if(cookieObj.hasOwnProperty('L_Key'))
        {
            let CurrentUser = -1;

            CurrentUser = Login.Logged_Users.findIndex((User)=>{
                return User.s_key === cookieObj.L_Key})

            if(CurrentUser >=0)
            {
                Login.Logged_Users.splice(CurrentUser, 1);

                res.setHeader('Set-Cookie', 'L_Key=deleted; Max-Age=0');
                
                res.writeHead(302,{'Conten-Type' : 'text/html',
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Credentials' : true,
                'Location' : Config.Server_Url
                });

                res.end("");

                return;    
            }
        }
    }

    SendMainPage(req,res);

}


/*

-------------------------Function send request file  to client


*/

function SendRequestFile(req,res)
{
    console.log("Send Request File....");

    if(req.url.endsWith('favicon.ico'))
    {
        res.end();
        // SendMainResponse(res);
        return;
    }

    const cookies = req.headers['cookie'];

    if(cookies)
    {
        cookieObj = cookiesParse.parse(cookies);

        if(cookieObj.hasOwnProperty('L_Key'))
        {
            const CurrentUser = Login.Logged_Users.find((User)=>{
                return User.s_key === cookieObj.L_Key})

            if(CurrentUser)
            {
                if(req.url.endsWith('.png') || req.url.endsWith('.jpg')|| req.url.endsWith('.js'))
                {
                    const fileName = req.url.slice(1,req.url.length);

                    Users.SendUserRequestFile(CurrentUser.user_id, res, fileName);

                    return;
                } 
            }
        }
    }
    
    SendMainResponse(res);
}

module.exports ={
    SetCookieAndRedirect,
    SendMainPage,
    SendMainResponse,
    Logout,
    SendRequestFile,
    CreateNewUser
}