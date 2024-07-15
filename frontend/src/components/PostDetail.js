import React, { useEffect, useRef, useState } from 'react';
import '../css/PostDetail.css';
// import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Picker, { EmojiClickData } from 'emoji-picker-react';

export default function PostDetail({ item, setItem, allposts, setAllposts, user, toggleDetails }) {
    // const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(null);
    const [comment, setComment] = useState("");
    const [showPicker, setShowPicker] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newCaption, setNewCaption] = useState(item.body);
    const [showCaptionPicker, setShowCaptionPicker] = useState(false);
    const captionInputRef = useRef(null);

    useEffect(() => {
        if (item.revealAt) {
            const timer = setInterval(() => {
                const now = new Date();
                const revealTime = new Date(item.revealAt);
                const timeDifference = revealTime - now;

                if (timeDifference <= 0) {
                    clearInterval(timer);
                    setTimeLeft('');
                } else {
                    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
                    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

                    setTimeLeft(`Posting in: ${hours}h ${minutes}m ${seconds}s`);
                }
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [item.revealAt]);

    const notifyB = (msg) => toast.success(msg);

    const onEmojiClick = (emojiData: EmojiClickData) => {
        setComment((ip) => ip + emojiData.emoji);
    };

    const onCaptionEmojiClick = (emojiData) => {
        setNewCaption(prevCaption => prevCaption + emojiData.emoji);
    };

    const removePost = (postId) => {
        fetch(`http://localhost:5000/deletePost/${postId}`, {
            method: "delete",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            },
        }).then((res) => res.json())
            .then((result) => {
                setAllposts(allposts.filter(post => post._id !== postId));
                console.log(result);
                toggleDetails();
                notifyB(result.message);
            })
    }

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
                setItem(result);
                setComment("");
                notifyB("Comment Posted");
                setShowPicker(false);
            })
    }

    const updateCaption = (newBody, postId) => {
        fetch(`http://localhost:5000/editCaption/${postId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({ body: newBody })
        }).then(res => res.json())
            .then((result) => {
                setItem(result);
                setNewCaption(newBody);
                setIsEditing(false);
                setAllposts(allposts.map(post => (post._id === postId ? result : post)));
                notifyB("Caption Updated");
            });
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            makeComment(comment, item._id);
        }
    };
    
    
    const handleKeyPress1 = (event) => {
        if (event.key === 'Enter') {
            updateCaption(newCaption, item._id);
        }
    };

    const handleCaptionEdit = () => {
        setIsEditing(true);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (captionInputRef.current && !captionInputRef.current.contains(event.target)) {
                setIsEditing(false);
                setNewCaption(item.body);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [captionInputRef]);

    return (
        <div className="showComment">
            <div className="container">
                <div className="postPic">
                    <img src={item.photo} alt=""></img>
                </div>

                <div className="details">
                    {/* card-header */}
                    <div className="card-header" style={{ borderBottom: "1px solid #00000029" }}>
                        <div className="card-pic" style={{ display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "1px" }}>
                            <img src={user.Photo ? user.Photo : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} alt="card-pic" />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "0px", padding: "0px" }}>
                            <div style={{ alignSelf: "flex-start" }}>
                                <h5 style={{ margin: "0px", padding: "0px", marginLeft: "0px" }}>{user.name}</h5>
                            </div>
                            {timeLeft && (
                                <div className="reveal-timer" style={{ margin: "0px", padding: "0px" }}>
                                    <p style={{ fontWeight: "bold", margin: "0px", padding: "0px", fontSize: "10px" }}>{timeLeft}</p>
                                </div>
                            )}
                        </div>
                        <div className="deletePost">
                            <span className="material-symbols-outlined" onClick={() => {
                                removePost(item._id)
                            }}>
                                delete
                            </span>
                        </div>
                    </div>

                    {/* commentSection */}
                    <div className="comment-section" style={{ borderBottom: "1px solid #00000029" }}>
                        {item.comments.map((comment) => {
                            return (
                                <p className='comm' key={comment._id}>
                                    <span className='commenter' style={{ fontWeight: "bolder" }}>{comment.postedBy.name}   </span>
                                    <span className='commentText'>{comment.comment}</span>
                                </p>
                            )
                        })}
                    </div>

                    {/* card-content */}
                    <div className="card-content">
                        {item.likes.length>1?<p>{item.likes.length} Likes</p>:<p>{item.likes.length} Like</p>}
                        {isEditing ? (
                            <div ref={captionInputRef}>
                                {showCaptionPicker && <Picker height={300} width={250} onEmojiClick={onCaptionEmojiClick} />}
                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <span className="material-symbols-outlined" onClick={() => { setShowCaptionPicker(val => !val) }}>
                                        mood
                                    </span>
                                    <input style={{ borderRadius: "4px", height: "10px", borderColor: "grey" }}
                                        type="text"
                                        value={newCaption}
                                        onChange={(e) => setNewCaption(e.target.value)}
                                        onKeyDown={handleKeyPress1}
                                    />
                                </div>
                            </div>
                        ) : (
                            <p onClick={handleCaptionEdit}>{newCaption === "" ? <div style={{ color: "grey" }}>No caption</div> : newCaption}</p>
                        )}
                    </div>

                    {/* add comment */}
                    <div className="add-comment">
                        {showPicker && <div className="emoji-palette3"><Picker height={300} width={300} onEmojiClick={onEmojiClick} /></div>}
                        <span className="material-symbols-outlined" onClick={() => { setShowPicker(val => !val) }}>
                            mood
                        </span>
                        <input type="text" placeholder='Add a comment' value={comment} onChange={(e) => {
                            setComment(e.target.value)
                        }} onKeyDown={handleKeyPress} />
                        <button className='comment' onClick={() => { makeComment(comment, item._id) }}>Post</button>
                    </div>
                </div>
            </div>
            <div className='close-comment'>
                <span className="material-symbols-outlined material-symbols-outlined-comment"
                    onClick={() => { toggleDetails() }}
                >
                    close
                </span>
            </div>
        </div>
    )
}
