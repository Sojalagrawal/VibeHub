import React, { useState, useEffect } from 'react';
import "../css/CreatePost.css";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Picker,{ EmojiClickData } from 'emoji-picker-react';


export default function CreatePost() {
    const navigate = useNavigate();
    const [showPicker,setShowPicker]=useState(false);
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");
    const [revealAt, setRevealAt] = useState("");
    const [dateOption, setDateOption] = useState("now");

    // Toast functions
    const notifyA = (msg) => toast.error(msg);
    const notifyB = (msg) => toast.success(msg);

    useEffect(() => {
        if (url) {
            fetch("/createPost", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    body,
                    pic: url,
                    revealAt: new Date(revealAt).toISOString(),
                })
            }).then(res => res.json())
                .then((data) => {
                    if (data.error) {
                        notifyA(data.error)
                    }
                    else {
                        notifyB("Successfully Posted");
                        navigate("/");
                    }
                }).catch(err => console.log(err));
        }
        // eslint-disable-next-line 
    }, [url]);

    const validateDateTime = (dateTimeString) => {
        const dateTimePattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
        if (!dateTimePattern.test(dateTimeString)) {
            notifyA("Invalid date format. Use YYYY-MM-DD HH:MM.");
            return false;
        }

        const [datePart, timePart] = dateTimeString.split(' ');
        const [year, month, day] = datePart.split('-').map(Number);
        const [hour, minute] = timePart.split(':').map(Number);

        const inputDate = new Date(year, month - 1, day, hour, minute);
        const currentDate = new Date();

        if (inputDate <= currentDate) {
            notifyA("The date and time must be in the future.");
            return false;
        }

        return true;
    }

    const postDetails = () => {
        if (dateOption === "custom" && !validateDateTime(revealAt)) {
            return;
        }

        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "insta-clone");
        data.append("cloud_name", "sojalcloud");
        fetch("https://api.cloudinary.com/v1_1/sojalcloud/image/upload", {
            method: "POST",
            body: data,
        }).then(res => res.json())
            .then(data => setUrl(data.url))
            .catch(err => console.log(err));
    }

    const loadfile = (event) => {
        var output = document.getElementById('output');
        output.src = URL.createObjectURL(event.target.files[0]);
        output.onload = function () {
            URL.revokeObjectURL(output.src) // free memory
        };
    };

    const handleInputChange = (e) => {
        setRevealAt(e.target.value);
    }

    useEffect(() => {
        if (dateOption === "now") {
            const now = new Date();
            const formattedNow = now.toISOString().slice(0, 16).replace('T', ' ');
            setRevealAt(formattedNow);
        } else {
            setRevealAt("");
        }
    }, [dateOption]);

    const onEmojiClick = (emojiData:EmojiClickData) => {
        setBody((ip)=>ip+emojiData.emoji);
    };

    return (
        <div className='createPost'>
            {/* header */}
            <div className="post-header">
                <h4 style={{ margin: "3px auto" }}>Create New Post</h4>
                <button id="post-btn" onClick={() => { postDetails() }}>Post</button>
            </div>
            {/* image preview */}
            <div className="main-div">
                <img id="output" alt="preview" src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-512.png" />
                <input type="file" accept="image/*" onChange={(event) => {
                    loadfile(event);
                    setImage(event.target.files[0])
                }} />
            </div>
            {/* details */}
            <div className="details">
                <div className="card-header">
                    <div className="card-pic">
                        <img src={JSON.parse(localStorage.getItem("user")).Photo ? JSON.parse(localStorage.getItem("user")).Photo : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} alt="" />
                    </div>
                    <h5>{JSON.parse(localStorage.getItem("user")).userName}</h5>
                </div>
                <div style={{display:"flex",width:"100%"}}>
                    {showPicker && <div style={{position:"absolute",bottom:"17%"}}><Picker height={320} width={320} onEmojiClick={onEmojiClick}/></div>}
                    <span className="material-symbols-outlined"  onClick={() =>{ setShowPicker(val => !val)
                    }}>
                        mood
                    </span>
                    <textarea type="text" placeholder="Write a caption" value={body} onChange={(e) => { setBody(e.target.value) }} />
                </div>
                <div style={{display:"flex",alignItems:"center",marginLeft:"5px"}}>
                    <div >Post at:</div>
                    <div className="date-option">
                        <select value={dateOption} onChange={(e) => setDateOption(e.target.value)}>
                            <option value="now">Now</option>
                            <option value="custom">Custom</option>
                        </select>
                        {dateOption === "custom" && (
                            <input
                                id="date"
                                type="text"
                                placeholder="YYYY-MM-DD HH:MM"
                                value={revealAt}
                                onChange={handleInputChange}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
