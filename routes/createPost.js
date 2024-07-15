const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const POST=mongoose.model("POST");




//route
router.get("/allposts",requireLogin,(req,res)=>{
    POST.find({
        $or: [
            { revealAt: { $lte: new Date() } },
            { revealAt: { $exists: false } }
        ]
    })
    .populate("postedBy","_id name Photo")
    .populate("comments.postedBy","_id name")
    .sort("-createdAt") //sort post in descending order
    .then(posts=>res.json(posts))
    .catch(err=>console.log(err));
})

router.post("/createPost",requireLogin,(req,res)=>{
    const {body,pic,revealAt}=req.body;
    if(!pic || !body){
        return res.status(422).json({error:"Please ad all the fields"});
    }
    // console.log(pic);
    const postData = {
        body,
        photo: pic,
        postedBy: req.user
    };

    if (revealAt) {
        postData.revealAt = revealAt;
    }

    const post = new POST(postData);
    post.save()
    .then(result => res.json({ post: result }))
    .catch(err => console.error("Error creating post:", err));

});

router.get("/myposts", requireLogin, (req, res) => {
    POST.find({
        postedBy: req.user._id,
        // $or: [
        //     { revealAt: { $lte: new Date() } },
        //     { revealAt: { $exists: false } }
        // ]
    })
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt")
    .then(myposts => res.json(myposts))
    .catch(err => console.error("Error fetching my posts:", err));
});



router.put("/like",requireLogin,(req,res)=>{
    POST.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
        
    },{
        new:true
    })
    .populate("postedBy","_id name Photo")
    .then((result,err)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})

router.put("/unlike",requireLogin,(req,res)=>{
    POST.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    })
    .populate("postedBy","_id name Photo")
    .then((result,err)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})

router.put("/comment",requireLogin,(req,res)=>{
    const comment={
        comment:req.body.text,
        postedBy:req.user._id
    }
    POST.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    }).populate("comments.postedBy","_id name")
    .populate("postedBy","_id name Photo")
    .then((result,err)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })

})
//api to delete post
router.delete("/deletePost/:postId",requireLogin,(req,res)=>{
    // console.log(req.params.postId);
    POST.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .then((post,err)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString()===req.user._id.toString()){
            // console.log(req.params.postId);
            POST.deleteOne({_id:req.params.postId})
            .then(()=>{
                console.log("deleted");
                return res.json({message:"Success"})
            })
            .catch((err)=>{
                console.log(err)
            })
        }
        
    })
})

//delete comment
router.delete("/comment", requireLogin, (req, res) => {
    const commentId = req.body.commentId;
    const userId = req.user._id;

    POST.findByIdAndUpdate(
        req.body.postId,
        { $pull: { comments: { _id: commentId, postedBy: userId } } },
        { new: true }
    )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name Photo")
    .exec((err, result) => {
        if (err || !result) {
            return res.status(422).json({ error: err });
        } else {
            res.json(result);
        }
    });
});
//to update caption
router.put("/editCaption/:postId",requireLogin,(req,res)=>{
    const { body } = req.body;
    const userId = req.user._id;
    const { postId } = req.params;
    POST.findById(postId)
        .populate('postedBy', '_id')
        .then(post => {
            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }

            if (post.postedBy._id.toString() !== userId.toString()) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            POST.findByIdAndUpdate(
                postId,
                { $set: { body: body } },
                { new: true }
            )
                .populate('comments.postedBy', '_id name')
                .populate('postedBy', '_id name Photo')
                .then(result => {
                    res.json(result);
                })
                .catch(err => {
                    return res.status(422).json({ error: err });
                });
        })
        .catch(err => {
            return res.status(422).json({ error: err });
        });

})

//to show following posts
router.get("/myfollowingpost",requireLogin,(req,res)=>{
    const now=Date();
    POST.find({
        postedBy: { $in: req.user.following },
        $or: [
            { revealAt: { $lte: now } },
            { revealAt: { $exists: false } }
        ]
    })
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .then(posts=>res.json(posts))
    .catch(err=>console.log(err));
})



module.exports=router;