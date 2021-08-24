import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import "./UserProfile.css";
import { useParams } from "react-router-dom";

const Profile = () => {
    const [userProfile, setProfile] = useState(null)
    
    const { state, dispatch } = useContext(UserContext)
    const { userid } = useParams()
    const [showfollow, setShowFollow] = useState(state?!state.following.includes(userid):true)
    useEffect(() => {
        fetch(`/user/${ userid }`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                // console.log(result)
                setProfile(result)
            })
    }, [])

    
    const followUser = () => {
        fetch("/follow",{
            method:"put",
            headers : {
                "Content-Type" : "application/json",
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res => res.json())
        .then(data => {
            console.log(data)
            dispatch({type:"UPDATE", payload:{following:data.following, followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState) => {
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers,data._id]
                    }
                }
            })
            setShowFollow(false)
        })
    }


    const unfollowUser = () => {
        fetch("/unfollow",{
            method:"put",
            headers : {
                "Content-Type" : "application/json",
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res => res.json())
        .then(data => {
            console.log(data)
            dispatch({type:"UPDATE", payload:{following:data.following, followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            
            setProfile((prevState) => {
                const newFollower = prevState.user.followers.filter(item => item != data._id)
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:newFollower
                    }
                }
            })
            setShowFollow(true)
        })
    }

    return (

        <>
            {userProfile ?
                <div style={{ maxWidth: "900px", margin: "10px auto" }}>
                    <div className="profile-img-name-wrapper">
                        <div>
                            <img className="profile-img" src={userProfile.user.pic?userProfile.user.pic:"Loading.."} alt="Profile-pic" />
                        </div>
                        <div className="name-post-wrapper">
                            <h4>{userProfile.user.name}</h4>
                            <h5>{userProfile.user.email}</h5>
                            <div className="posts-followers">
                                <h5><b>{userProfile.posts.length}</b> {userProfile.posts.length>=2 ? "Posts" : "Post"}</h5>
                                <h5><b>{userProfile.user.followers.length}</b> {userProfile.user.followers.length >=2 ? "Followers" : "Follower"}</h5>
                                <h5><b>{userProfile.user.following.length}</b> Following</h5>
                            </div>
                            {showfollow ?
                                <button className="btn waves-effect waves-light #64b5f6 blue lighten-2 login-btn" style={{margin:"5px 0px 15px 0px"}} onClick={() => followUser()}>Follow</button> : 
                                <button className="btn waves-effect waves-light #64b5f6 blue lighten-2 login-btn"  style={{margin:"5px 0px 15px 0px"}} onClick={() => unfollowUser()}>Unfollow</button>
                            }                            
                        </div>
                    </div>
                    <div className="gallery">
                        {
                            userProfile.posts.map(item => {
                                return (
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
                : <h2>Loading...</h2>}
        </>
    )
}


export default Profile;