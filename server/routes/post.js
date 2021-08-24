const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const requireLogin = require("../middlewares/isAuthenticated");
const Post = mongoose.model("Post")

router.get("/allposts",requireLogin,(req,res) => {
    Post.find().populate("postedBy","_id name email")
    .populate("comments.postedBy","_id name pic")
    .populate("postedBy","_id name pic")
    .sort("-createdAt")
    .then(posts => {
        return res.json({
            posts : posts
        })
    }).catch(err => {
        console.log(err)
    })
})


router.get("/getsubpost",requireLogin,(req,res) => {
    Post.find({postedBy:{$in:req.user.following}}).populate("postedBy","_id name email pic")
    .populate("comments.postedBy","_id name pic")
    .populate("postedBy","_id name pic")
    .sort("-createdAt")
    .then(posts => {
        return res.json({
            posts : posts
        })
    }).catch(err => {
        console.log(err)
    })
})



router.get("/mypost",requireLogin,(req,res) => {
    Post.find({postedBy : req.user._id}).populate("postedBy","_id name email pic")
    .then(myposts => {
        return res.json({
            myposts : myposts
        })
    }).catch(err => {
        console.log(err)
    })
})

router.post("/createpost",requireLogin,(req,res) => {
    const {title, body, photo} = req.body;
    // console.log(title,body,photo)
    if(!title || !body || !photo){
        return res.status(422).json({
            error : "Please Enter required Fields"
        })
    }
    // console.log(req.user)
    // res.send("ok")
    req.user.password = undefined
    req.user.__v = undefined
    const post = new Post({
        title : title,
        body : body,
        photo : photo,
        postedBy : req.user
    })
    post.save().then(result => {
        res.json({ posted : result})
    }).catch(err => {
        console.log(err)
    })
})  


router.put("/like",requireLogin,(req,res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push : {likes:req.user._id}
    },{
        new : true
    })
    .populate("comments.postedBy","_id name pic")
    .populate("postedBy","_id name pic")
    .exec((err, result) => {
        if (err) {
            return res.status(422).json({error : err})
        } else{
            res.json(result)
        }
    })
})


router.put("/unlike",requireLogin,(req,res) => {
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name pic")
    .populate("postedBy","_id name pic")
    .exec((err,result) => {
        if(err){
            return res.status(422).json({error : err})
        }else{
            res.json(result)
        }
    })
})


router.put("/comment",requireLogin,(req,res) => {
    const comment = {
        text : req.body.text,
        postedBy : req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push : {comments:comment}
    },{
        new : true
    })
    .populate("comments.postedBy","_id name pic")
    .populate("postedBy","_id name pic")
    .exec((err, result) => {
        if (err) {
            return res.status(422).json({error : err})
        } else{
            res.json(result)
        }
    })
})




router.delete("/deletepost/:postId",requireLogin,(req,res) => {
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post) => {
        if(err || !post){
            return res.status(422).json({
                error : err
            })
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result => {
                res.json(result)
            }).catch(err => {
                console.log(err)
            })
        }
    })
})


router.delete("/deletecomment/:commentId",requireLogin,(req,res) => {
    Post.findOne({_id:req.params.commentId})
    .populate("postedBy","_id")
    .exec((err,post) => {
        if(err || !post){
            return res.status(422).json({
                error : err
            })
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result => {
                res.json(result)
                console.log(result)
            }).catch(err => {
                console.log(err)
            })
        }
    })
})







module.exports = router;

