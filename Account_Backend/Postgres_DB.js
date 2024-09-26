
const postgres = require('postgres');

let User=[];



async function QueryUserByName(UserName)          // Get User by  name
{
  const sql = postgres({
    host                 : '127.0.0.1',           // Postgres ip address[s] or domain name[s]
    port                 : 5432,                  // Postgres server port[s]
    database             : 'netshop_base',        // Name of database to connect to
    username             : 'postgres',            // Username of database user
    password             : '1410',                // Password of database user
  })
  try
  {
    const result = await sql`select * from users where email=${UserName}`.execute();

    await sql.end();
    return result;
  }
  catch(error)
  {
    console.log("Postgres connection error : ",error);
    return null;
  }
 
};


async function CreateNewUser(user_id, name, email, password, )          // Get User by  name
{
  const sql = postgres({
    host                 : '127.0.0.1',           // Postgres ip address[s] or domain name[s]
    port                 : 5432,                  // Postgres server port[s]
    database             : 'netshop_base',        // Name of database to connect to
    username             : 'postgres',            // Username of database user
    password             : '1410',                // Password of database user
  })

  const result = await sql`insert into users values(${user_id},${name},${password},${email})`.execute();

  await sql.end();
 
  return result;
};

async function getAllRecords()
{
    const result = await sql`select * from users`.execute();
    return result;

}

module.exports={
    QueryUserByName : QueryUserByName,
    getAllRecord : getAllRecords,
    CreateNewUser,
    User : User,
}