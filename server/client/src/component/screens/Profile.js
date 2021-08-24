import React, {useEffect, useState, useContext} from "react";
import {UserContext} from "../../App";
import "./Profile.css";


const Profile = () => {
    const [myposts, setMyPosts] = useState([])
    const {state, dispatch} = useContext(UserContext)
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    useEffect(() => {
        fetch("/mypost",{
            headers : {
                "Authorization" : "Bearer "+localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(result => {
            console.log(result)
            setMyPosts(result.myposts)
        })
    },[])

    useEffect(() => {
        if(image){
            const data = new FormData();
            data.append("file",image);
            data.append("upload_preset","instagram-clone");
            data.append("cloud_name","mac90")
            fetch("https://api.cloudinary.com/v1_1/mac90/image/upload",{
                method : "post",
                body : data
            }).then(res => res.json())
            .then(data => {
                setUrl(data.url)
                // localStorage.setItem("user",JSON.stringify({...state,pic:data.url}))
                // dispatch({type:"UPDATEPIC",payload:data.url})
                fetch("/updatepic",{
                    method:"put",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization" : "Bearer "+localStorage.getItem("jwt")
                    },
                    body:JSON.stringify({
                        pic:data.url
                    })
                }).then(res => res.json())
                .then(result => {
                    localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
                    dispatch({type:"UPDATEPIC",payload:result.pic})
                })
            }).catch(err => {
                console.log(err)
            })
            }
    },[image])

    const updatePhoto = (file) => {
        setImage(file)
        
        
    }

    return (
        <div style={{maxWidth:"900px", margin:"10px auto"}}>
            <div className="profile-img-name-wrapper">
                <div style={{display:"flex", flexDirection:"column"}}>
                    <img className="profile-img" src={state?state.pic:"Loading.."} alt="Profile-pic"/>
                    <div className="file-field input-field">
                        <span onClick={() => updatePhoto()} style={{display:"flex", cursor:"pointer", width:"150px", marginLeft:"27px"}}><i style={{margin:"10px 3px 10px 10px"}} className="material-icons">add_a_photo</i> <h6 style={{marginBottom:"10px"}}>Update Photo</h6></span>
                        <input type="file" onChange={(e) => updatePhoto(e.target.files[0])}/>
                    </div>
                </div>
                <div className="name-post-wrapper">
                    <h4>{state?state.name:"Loading.."}</h4>
                    <div className="posts-followers">
                        <h5><b>{myposts.length}</b> {myposts.length>=2?"Posts" : "Post"}</h5>
                        <h5><b>{state?state.followers.length : "0"}</b> {state.followers.length>=2?"Followers" : "Follower"}</h5>
                        <h5><b>{state?state.following.length : "0"}</b> Following</h5>
                    </div>
                </div>
            </div>
            <div className="gallery">
                {
                    myposts.map(item =>{
                        return(
                            <div className="card home-card" key={item._id}>
                                <div className="card-image photo-div">
                                    <img className="myposts-photo" src={item.photo} alt="post" />
                                </div>
                                <div className="card-content title-div">
                                    {/* <i className="material-icons">favorite_border</i> */}
                                    <h6><b>{item.title}</b></h6>
                                    <p>{item.body}</p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}


export default Profile;