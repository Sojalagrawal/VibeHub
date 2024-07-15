import React, { useEffect, useState } from 'react'
import "../css/Home.css";
import { useNavigate,Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Picker,{ EmojiClickData } from 'emoji-picker-react';




export default function MyfollowingPost() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [comment, setComment] = useState("");
  const [key, setKey] = useState("");
  const [show,setShow]=useState(false);
  const [item ,setItem]=useState([]);
  const [showPicker,setshowPicker]=useState(false);
  const [showPicker1,setshowPicker1]=useState(false);


   

  //Toast functions
  // const notifyA=(msg)=>toast.error(msg);
  const notifyB=(msg)=>toast.success(msg);


  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("./signup");
    }


    // Fetching all posts
    fetch("http://localhost:5000/myfollowingpost", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    }).then(res => res.json())
      .then(result => {
        setData(result);
        console.log(result)
      })
      .catch(err => console.log(err));
      // eslint-disable-next-line
  }, []);

  const likePost = (id) => {
    fetch("http://localhost:5000/like", {
      method: "put",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId: id
      })
    }).then(res => res.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id === result._id) {
            return result
          }
          else {
            return posts
          }
        })
        setData(newData)
        console.log(result)
      })
  }

  const unlikePost = (id) => {
    fetch("http://localhost:5000/unlike", {
      method: "put",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId: id
      })
    }).then(res => res.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id === result._id) {
            return result
          }
          else {
            return posts
          }
        })
        setData(newData)
        console.log(result)
      })
  }

  //function to comment on post
  const makeComment = (text, id) => {
    fetch("http://localhost:5000/comment", {
      method: "put",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        text: text,
        postId: id
      })
    }).then(res => res.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id === result._id) {
            return result
          }
          else {
            return posts
          }
        })
        setData(newData)
        setComment("")
        notifyB("Comment Posted")
        setshowPicker(false);
        setshowPicker1(false);
        console.log(result)
      })
  }

  //to show and hide comments
  const toggleComment=(posts)=>{
    if(show){
      setShow(false);
    }
    else{
      setItem(posts);
      setShow(true);
    }
  }

  const onEmojiClick = (emojiData:EmojiClickData) => {
    setComment((ip)=>ip+emojiData.emoji);
  };
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      makeComment(comment,item._id);
    }
  };

  return (
    <div className='home'>
      {/* card */}
      {data.map((posts) => {
        return (
          <div className="card">
            {/* card-header */}
            <div className="card-header">
              <div className="card-pic">
                <img src="https://media.istockphoto.com/id/1308963275/photo/head-shot-portrait-smiling-businessman-wearing-suit-looking-at-camera.jpg?s=612x612&w=0&k=20&c=eS4QOT3mpBAadUKdF86JKE0EOHsg6gMQ17qD6by57qc=" alt="card-pic" />
              </div>
              <h5>
                <Link to={`/profile/${posts.postedBy._id}`}>
                   {(posts.postedBy) ? (posts.postedBy.name) : "unknown"}
                </Link>
              </h5>
            </div>

            {/* card image */}
            <div className="card-image">
              <img src={posts.photo} alt="" />
            </div>

            {/* card-content */}
            <div className="card-content">
              {
                posts.likes.includes(JSON.parse(localStorage.getItem("user"))._id) ?
                  (<span className="material-symbols-outlined material-symbols-outlined-red" onClick={() => { unlikePost(posts._id) }}>
                    favorite
                  </span>) :
                  (<span className="material-symbols-outlined" onClick={() => { likePost(posts._id) }}>
                    favorite
                  </span>)
              }
              {posts.likes.length>1?<p>{posts.likes.length} Likes</p>:<p>{posts.likes.length} Like</p>}
              <p>{posts.body}</p>
              <p style={{fontWeight:"bold",cursor:"pointer"}} onClick={()=>{toggleComment(posts)}}>View all comments</p>
            </div>

            {/* add comment */}
            <div className="add-comment">
              {showPicker && key === posts._id && <div className="emoji-palette2"><Picker height={320} width={320} onEmojiClick={onEmojiClick}/></div>}
              <span className="material-symbols-outlined"  onClick={() =>{ setshowPicker(val => !val)
                setKey(posts._id);
              }}>
                mood
              </span>
              <input type="text" placeholder='Add a comment' value={key === posts._id ? comment : ""} onChange={(e) => {
                setComment(e.target.value)
                setKey(posts._id)
              }} onKeyDown={(e)=>{
                if (e.key === 'Enter') {
                  makeComment(comment,posts._id);
                }
              }}/>
              <button className='comment' onClick={() => { makeComment(comment, posts._id) }}>Post</button>
            </div>
          </div>
        )
      })}

      {/* show comments */}
      { show &&
           <div className="showComment">
           <div className="container">
             <div className="postPic">
               <img src={item.photo} alt=""></img>
             </div>
             <div className="details">
               {/* card-header */}
               <div className="card-header" style={{ borderBottom: "1px solid #00000029" }}>
                 <div className="card-pic">
                   <img src={item.photo} alt="card-pic" />
                 </div>
                 <h5>{item.postedBy.name}</h5>
               </div>
   
   
               {/* commentSection */}
               <div className="comment-section" style={{ borderBottom: "1px solid #00000029" }}>
                 {item.comments.map((comment)=>{
                   return(
                     <p className='comm'>
                       <span className='commenter' style={{ fontWeight: "bolder" }}>{comment.postedBy.name}   </span>
                       <span className='commentText'>{comment.comment}</span>
                     </p>
                   )
                 })}
                 
               </div>
   
   
               {/* card-content */}
               <div className="card-content">
                 <p>{item.likes.length} Likes</p>
                 <p>{item.body}</p>
               </div>
               {/* add comment */}
               <div className="add-comment">
                  {showPicker1 && <div className="emoji-palette3"><Picker height={320} width={320} onEmojiClick={onEmojiClick}/></div>}
                  <span className="material-symbols-outlined"  onClick={() =>{ setshowPicker1(val => !val)}}>
                      mood
                  </span>
                 <input type="text" placeholder='Add a comment' value={comment} onChange={(e) => { setComment(e.target.value) }} onKeyDown={handleKeyPress}/>
                 <button className='comment' onClick={() => {
                    makeComment(comment, item._id);
                    toggleComment();
                    }}
                    >Post</button>
               </div>
             </div>
           </div>
           <div className='close-comment'>
             <span class="material-symbols-outlined material-symbols-outlined-comment" onClick={()=>{toggleComment()}}>
               close
             </span>
           </div>
           </div>  
      }   
    </div>
  )
}

