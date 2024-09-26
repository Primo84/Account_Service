const fs = require('fs');
const path = require('path');


/*

-------------------------Function intentend for view a main page single witch is logged


*/

function loadUserMainPage(user_id, res)
{

   fs.readFile(path.join(__dirname, user_id, "index.html"),(err,buffer)=>{
        if(err)
        {
            console.log("Read File Error",err)
            res.writeHead(200,{'conten-type' : 'text/html',
                'Access-Control-Allow-Origin' : '*',
                    // 'Access-Control-Allow-Credentials' : true,
                // 'Location' : 'https://www.wp.pl'
        
                });
            res.end("<h1>Hello Main Page...</h1>");
            return false;
        }
            res.writeHead(200,{'conten-type' : 'text/html; charset = ISO-8859-2',
            'Access-Control-Allow-Origin' : '*',
                // 'Access-Control-Allow-Credentials' : true,
            // 'Location' : 'https://www.wp.pl'
    
            });

            res.end(buffer);

        return true;

   })
}


/*

-------------------------Function intentend for view a main page single witch is logged


*/

function SendUserRequestFile(user_id, res, fileName)
{

    if(fileName.endsWith('.png'))
    {
        res.writeHead(200,{'conten-type' : 'image/png',
            'Access-Control-Allow-Origin' : '*',
                // 'Access-Control-Allow-Credentials' : true,
            // 'Location' : 'https://www.wp.pl'
    
            });
        
    }
    else if(fileName.endsWith('.jpg'))
        {
            res.writeHead(200,{'conten-type' : 'image/jpg',
                'Access-Control-Allow-Origin' : '*',
                    // 'Access-Control-Allow-Credentials' : true,
                // 'Location' : 'https://www.wp.pl'
        
                });
            
        }
    

   fs.readFile(path.join(__dirname, user_id, fileName),(err,buffer)=>{
        if(err)
        {
            console.log("Read File Error",err)
            // res.writeHead(200,{'conten-type' : 'text/html',
            //     'Access-Control-Allow-Origin' : '*',
            //         // 'Access-Control-Allow-Credentials' : true,
            //     // 'Location' : 'https://www.wp.pl'
        
            //     });
            res.end("<h1>Hello Main Page...</h1>");
            return false;
        }

            res.end(buffer);

        return true;

   })
}



module.exports = {
    loadUserMainPage,
    SendUserRequestFile
}