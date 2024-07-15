import React, { useEffect, useState } from 'react'
import {Link } from 'react-router-dom';
import "../css/Search.css"

export default function Search() {
    const [Username,setUsername]=useState("");
    const [Users,setUsers]=useState([]);

    useEffect(()=>{
        var abc = document.getElementById("abc"); 
        console.log(abc);
        
        if(Username){
            fetch(`/searchUser/${Username}`,{
                method:"get",
                headers:{
                    "Content-Type":"application/json",
                    "authorization":"Bearer "+localStorage.getItem("jwt")
                },
            }).then(res => res.json())
            .then((result)=>{
                setUsers(result);
                console.log(Users);
                abc.style.visibility="visible";
            })
        }
        else{
            setUsers([]);
            abc.style.visibility="hidden";

        }
    },[Username])
  return (
    <>
    <div className='outside'>
        <div className='userSearch'>
            <div className='input_user'>
                <input type="text" placeholder="Enter Username" value={Username} onChange={(e)=>{setUsername(e.target.value)}}></input>
            </div>
            <div id="abc" className='user_display'>
                {Users && Users.map((user)=>{
                    return <div className='user_info'>
                        <img className="user_pic" src={user.Photo?user.Photo:"https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} ></img>
                        <div><Link to={`/profile/${user._id}`}>{user.userName}</Link></div>
                    </div> 
                })}
            </div>
        </div>
    </div>
    </>
  )
}
