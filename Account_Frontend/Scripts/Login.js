let FormID;

async function formLogin()
{
    let Val = "";
    let RespData = "";

    const EL=$('#user');

    //  FormID = $('#LoginForm');
    // const Formid = document.querySelector("#LoginForm")

    // let formData = new FormData(Formid);

    let formData = new FormData();

    Val = $('#user').val();
    formData.append("User",Val);

    Val = $('#password').val();
    formData.append("Password",Val);

    try {
        const response = await fetch(`${Server_Url}/Login`, {
          method: "POST",
          // credentials : "include",

          // Set the FormData instance as the request body
          body: formData,
        });
        RespData = await response.json();
      } catch (e) {
        console.error(e);
      }


    console.log(RespData);

    if(RespData['uid'] == 'NULL')
    {

      $('#Password_Error_Text').show();
    }
    else
    {
      window.location.href=`${Server_Url}/User?uid=${RespData['uid']}`;

    }


}

function signup()
{
  window.location.href="signup.html";
}

function formCancel()
{
  window.location.href= Server_Url;
}

async function formSignin()
{
  const user = $('#user').val();
  const password_1 = $('#password').val();
  const password_2 = $('#password_retype').val();
  const name = $('#name').val();

  if(user != "" && password_1 != "" && password_2 != "" && name != "")
  {

    if(password_1 != password_2)
    {
      $('#Password_Error_Text').show();
      $('#Email_Error_Text').hide();
      $('#Email_Error_Text_1').hide();
    }
    else
    {
      $('#Password_Error_Text').hide();
      $('#Email_Error_Text').hide();
      $('#Email_Error_Text_1').hide();

      const Response = await fetch(`${Server_Url}/Signup`,{

        method : "POST",
        body: JSON.stringify({ username: user, password : password_1, name: name }),

      });

      const RespData = await Response.json();

      if(RespData.response == "EXIST")
      {
        $('#Password_Error_Text').hide();
        $('#Email_Error_Text').show();
        $('#Email_Error_Text_1').hide();
      }
      else if(RespData.response == "NULL")
      {
        $('#Password_Error_Text').hide();
        $('#Email_Error_Text').hide();
        $('#Email_Error_Text_1').show();
      }

      else if(RespData.response == "MAIL")
        {
          $('#Password_Error_Text').hide();
          $('#Email_Error_Text').hide();
          $('#Email_Error_Text_1').hide();
          window.location.href = "verifyLink.html"
        }

    }

  }
  else
  {
    $('#Password_Error_Text').hide();
    $('#Email_Error_Text').hide();
    $('#Email_Error_Text_1').hide();
  }

}

$(document).ready(()=>
{
    console.log("document ready");
    FormID = document.querySelector("#LoginForm");
})