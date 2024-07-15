import React,{useContext} from 'react'
import logo from "../img/logo.png"
import "../css/Navbar.css"
import {Link} from "react-router-dom"
import { LoginContext } from './context/LoginContext'
import { useNavigate } from 'react-router-dom'



export default function Navbar({login}) {
  const navigate=useNavigate();
  const {setModalOpen}=useContext(LoginContext);
  
  const loginStatus=()=>{
    const token=localStorage.getItem("jwt");
    if(token || login){
      return[
        <>
          <li style={{marginLeft:"20px"}}><Link to="/followingpost">My Following</Link></li>
          <li><Link to="/search">Search</Link></li>
          <li><Link to="/createPost">Create Post</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to={""}><button className='primaryBtn' onClick={()=>setModalOpen(true)}>LogOut</button></Link></li>

        </>
      ]
    }
    else{
        return [
          <>
            <li><Link to="/signup">SignUp</Link></li>
            <li><Link to="/signin">SignIn</Link></li>
          </>
        ]
    }
  };
  const loginStatusMobile = () => {
    const token = localStorage.getItem("jwt");
    if (token || login) {
      return [
        <>
          <li><Link to="/"><span class="material-symbols-outlined">
            home
          </span></Link></li>
          <li><Link to="/search"><span class="material-symbols-outlined">
            search
          </span></Link></li>
          <li><Link to="/profile"><span class="material-symbols-outlined">
            account_circle
          </span></Link></li>
          <li><Link to="/createPost"><span class="material-symbols-outlined">
            note_add
          </span></Link></li>
          <li style={{ marginLeft: "20px" }}><Link to="/followingpost"><span class="material-symbols-outlined">
            explore
          </span></Link></li>
          <li><Link to={""}><li onClick={() => setModalOpen(true)}><span class="material-symbols-outlined">
            logout
          </span></li></Link></li>

        </>
      ]
    }
    else {
      return [
        <>
          <li><Link to="/signup">SignUp</Link></li>
          <li><Link to="/signin">SignIn</Link></li>
        </>
      ]
    }
  }
  
  return (
    <div className="navbar">
        <img src={logo} id="insta-logo" alt="logo" onClick={()=>{navigate("/")}}/>
        <ul className='nav-menu'>
            {/* <li><a href="/signup">SignUp</a></li>
            <li><a href="/signin">SignIn</a></li> */}
            {/* <li><a href="/profile">Profile</a></li> */}

            {loginStatus()}
            



        </ul>
        <ul className='nav-mobile'>{loginStatusMobile()}</ul>
    </div>
  )
}
