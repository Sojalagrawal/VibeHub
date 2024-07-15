import React, { useState,useContext } from 'react'
import logo from "../img/logo.png"
import '../css/SignUp.css';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { LoginContext } from './context/LoginContext';



export default function SignUp() {
     const {setUserLogin}=useContext(LoginContext);
     const navigate = useNavigate();
     const [name, setName] = useState("");
     const [email, setEmail] = useState("");
     const [userName, setUserName] = useState("");
     const [password, setPassword] = useState("");

     //Toast functions
     const notifyA = (msg) => toast.error(msg);
     const notifyB = (msg) => toast.success(msg);


     const postData = () => {
          fetch("/signup", {
               method: "post",
               headers: {
                    "Content-Type": "application/json"
               },
               body: JSON.stringify({
                    name: name,
                    userName: userName,
                    email: email,
                    password: password

               })
               //key value no deni pdegi jb server pr bhejinge
          }).then(res => res.json())
               .then(data => {
                    if (data.error) {
                         const s = data.error;
                         s.forEach(element => {
                              notifyA(element.msg);
                         });
                    }
                    else {
                         notifyB(data.message);
                         navigate("/signin");
                    }
                    console.log(data)
               })
     }
     
     const continueWithGoogle=(credentialResponse)=>{
          console.log(credentialResponse);
          const jwt_detail=jwtDecode(credentialResponse.credential);
          console.log(jwt_detail);
          fetch("/googleLogin",{
               method: "post",
               headers: {
                    "Content-Type": "application/json"
               },
               body: JSON.stringify({
                    name: jwt_detail.name,
                    userName: jwt_detail.name,
                    email: jwt_detail.email,
                    email_verified:jwt_detail.email_verified,
                    clientId:credentialResponse.clientId,
                    Photo:jwt_detail.picture

               })
               //key value no deni pdegi jb server pr bhejinge
          }).then(res => res.json())
          .then(data => {
               if(data.error){
                    notifyA(data.error);
               }else{
                    notifyB(data.message);
                    localStorage.setItem("jwt",data.authtoken);
                    localStorage.setItem("user",JSON.stringify(data.user));
                    setUserLogin(true);
                    navigate("/");
               }
          })
     }

     return (
          <div className='signUp'>
               <div className='form-container'>
                    <div className="form">
                         <img className="signUpLogo" src={logo} alt="logo" />
                         <p className='loginpara'>
                              Sign up to see photos and videos<br /> from your friends
                         </p>
                         <div>
                              <input type="email" name="email" id="email" placeholder='Email' value={email} onChange={(e) => { setEmail(e.target.value) }} />
                         </div>
                         <div>
                              <input type="text" name="name" id="name" placeholder='Full name' value={name} onChange={(e) => { setName(e.target.value) }} />
                         </div>
                         <div>
                              <input type="text" name="username" id="username" placeholder='Username' value={userName} onChange={(e) => { setUserName(e.target.value) }} />
                         </div>
                         <div>
                              <input type="password" name="password" id="password" placeholder='Password' value={password} onChange={(e) => { setPassword(e.target.value) }} />
                         </div>
                         <p className='loginpara' style={{ fontSize: "12px", margin: "10px 0px" }}>
                              By signing up,you agree to out Terms,<br />privacy policy and cookies policy
                         </p>
                         <input type="submit" id="submit-btn" value="Sign Up" onClick={() => {
                              postData()
                         }} />
                         <hr/>
                         <GoogleLogin
                              onSuccess={credentialResponse => {
                                   continueWithGoogle(credentialResponse);
                              }}
                              onError={() => {
                                   console.log('Login Failed');
                              }}
                         />
                    </div>
                    <div className="form2">
                         Already have an account ?
                         <Link to="/signin">
                              <span style={{ color: "blue", cursor: "pointer" }}> SignIn</span>
                         </Link>
                    </div>

               </div>
          </div>
     )
}
