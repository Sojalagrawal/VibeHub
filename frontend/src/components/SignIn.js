import React,{useState,useContext} from 'react';
import '../css/SignIn.css'
import logo from "../img/logo.png"
import {Link,useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';
import { LoginContext } from './context/LoginContext';





export default function SignIn() {
  const {setUserLogin}=useContext(LoginContext);
  const navigate=useNavigate();
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");

   //Toast functions
   const notifyA=(msg)=>toast.error(msg);
   const notifyB=(msg)=>toast.success(msg);

  const postData=()=>{
    fetch("/signin",{
         method:"post",
         headers:{
              "Content-Type":"application/json"
         },
         body:JSON.stringify({
              email:email,
              password:password

         })
         //key value no deni pdegi jb server pr bhejinge
    }).then(res=>res.json())
    .then(data=>{
         if(data.error){
              notifyA(data.error);
         }else{
              notifyB(data.message);
              localStorage.setItem("jwt",data.authtoken);
              localStorage.setItem("user",JSON.stringify(data.user));
              setUserLogin(true);
              navigate("/profile");
         }
    })
}


  return (
    <div className='signIn'>
      <div className='login'>
        <div className="loginForm">
          <img className="signInLogo" src={logo} alt="logo" />
          <div>
            <input type="email" name="email" id="email" placeholder='Email' value={email} onChange={(e)=>{setEmail(e.target.value)}} />
          </div>
          <div>
            <input type="password" name="password" id="password" placeholder='Password' value={password} onChange={(e)=>{setPassword(e.target.value)}} />
          </div>
          <div>
            <input type="submit" id="login-btn" value="Sign In" onClick={()=>{postData()}}/>
          </div>
        </div>
        <div className="loginForm2">
          Don't have an account ?
          <Link to="/signup">
            <span style={{ color: "blue", cursor: "pointer" }}>Sign Up</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
