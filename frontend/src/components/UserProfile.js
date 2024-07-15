import React,{useEffect,useState} from 'react';
import "../css/Profile.css";
import PostDetail from './PostDetail';
import { useParams } from 'react-router-dom';

export default function UserProfile() {
  const {userid}=useParams();
  const [user,setUser]=useState("");
  const [posts,setPosts]=useState([]);
  const [isFollow,setIsFollow]=useState(false);

  useEffect(()=>{
      fetch(`/user/${userid}`,{
        headers:{
          Authorization:"Bearer "+localStorage.getItem("jwt")
        },
        
      })
      .then(res=>res.json())
      .then((result)=>{
          setUser(result.user)
          setPosts(result.post) 
          console.log(result);
          if(result.user.followers.includes((JSON.parse(localStorage.getItem("user")))._id)){
            setIsFollow(true);
          }
      })
  },[isFollow])
 //isfollow dala useeffect me taaki jese hi me change kroon user ke data me to state jo h user post ki vo change hojaye

 const mainFn=()=>{
  
 }

  //to follow user
  const followUser=(userId)=>{
      fetch("/follow",{
        method:"put",
        headers:{
          "Content-Type":"application/json",
          Authorization:"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
          followId:userId
        })
      })
      .then((res)=>res.json()) // mene (res)=>{res.json()} likh rkha tha undefined aarha tha jese hi { } htaye vese hi object aagya
      .then((data)=>{
        console.log(data)
        setIsFollow(true);
      })
  }



  //to unfollow user
  const unfollowUser=(userId)=>{
    fetch("/unfollow",{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        Authorization:"Bearer "+localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        followId:userId
      })
    })
    .then((res)=>res.json())
    .then((data)=>{
      console.log(data)
      setIsFollow(false);
    })    
}

  return (
    <div className='profile'>
      {/* profile-frame */}
       <div className="profile-frame">
        {/* profile-pic */}
          <div className="profile-pic">
             <img src={user.Photo?user.Photo:"https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} alt=""/>
          </div>
          {/* profile-data */}
          <div className="profile-data">
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <h1>{user.name}</h1>
                <button className='followBtn' onClick={()=>{
                    if(isFollow){
                      unfollowUser(user._id)
                    }
                    else{
                      followUser(user._id)
                    }
                    }
                  }>
                  {isFollow? "Unfollow":"Follow"}
                </button>
              </div>
              <div className="profile-info" style={{display:"flex"}}>
                <p>{posts.length} posts</p>
                <p>{user.followers?user.followers.length:"0"} followers</p>
                <p>{user.following?user.following.length:"0"} following</p>
              </div>
          </div>
          
       </div>  
       <hr style={{width:"100%",margin:"25px auto",opacty:0.8}}/>

        {/* Gallery */}
       <div className="gallery">
          {posts.map((pics)=>{
              return <img key={pics._id} style={{border:"1px solid black"}} src={pics.photo}className='item'></img>
          })}
       </div>
       
    </div>

    
  )
}
