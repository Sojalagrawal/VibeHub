import React,{useState,useEffect,useRef} from 'react'

export default function ProfilePic({changeProfile}) {
    const hiddenFileInput=useRef(null);
    const[image,setImage]=useState("");
    const[url,setUrl]=useState("");


    const postPic=()=>{
        fetch("/uploadProfilePic",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                pic:url
            })
        }).then(res => res.json())
        .then((data)=>{
           console.log(data);
           changeProfile();
           window.location.reload();
        }).catch(err=>console.log(err));
    }


    const handleClick=()=>{
        hiddenFileInput.current.click()
    }


    const postDetails=()=>{
        //posting image to cloudinary
        const data=new FormData();
        data.append("file",image);
        data.append("upload_preset","insta-clone");
        data.append("cloud_name","sojalcloud");
        fetch("https://api.cloudinary.com/v1_1/sojalcloud/image/upload",{
            method:"POST",
            body:data,
        }).then(res=>res.json())
        .then(data=>setUrl(data.url))
        .catch(err=>console.log(err));

        // when you try fetch data from a server, it will send you a RESPONSE which contains tons of irrelevant information. To target only the BODY part of the response and to convert it from JSON to javascript, you use res. json().
    }


    useEffect(()=>{
        if(image){
            postDetails();
        }
    },[image])


    useEffect(()=>{
        if(url){
            postPic();
        }
    },[url])

    


  return (
    <div className='profilePic darkBg'>
        <div className="changePic centered">
            <div>
                <h2>Change Profile Pic</h2>
            </div>
            <div style={{borderTop:"1px solid #00000030"}}>
                <button className="upload-btn" style={{color:"#1EA1F7"}} onClick={handleClick}>
                    Upload photo
                </button>
                <input type="file" accept="image/*" ref={hiddenFileInput} style={{display:"none"}} onChange={(e)=>{setImage(e.target.files[0])}}/>
            </div>
            <div style={{borderTop:"1px solid #00000030"}}>
                <button className='upload-btn' style={{color:"#ED4956"}} onClick={()=>{
                    setUrl(null);
                    postPic();//hmne alag se run kyu kiya use effect me hi chl jata -->use effect me jb chlta jb url null na hota vha if(url) ki condition h
                }}>Remove Current Photo</button>
            </div>
            <div style={{borderTop:"1px solid #00000030"}}>
                <button style={{background:"none",border:"none",cursor:"pointer",fontSize:"15px"}} onClick={changeProfile}>Cancel</button>
            </div>
        </div>
    </div>
  )
}
