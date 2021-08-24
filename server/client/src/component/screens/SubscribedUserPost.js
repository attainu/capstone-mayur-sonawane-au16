import React,{useState, useEffect, useContext} from "react";
import {UserContext} from "../../App"
import "./Home.css";
import {Link} from "react-router-dom";


const Home = () => {
    const [data, setData] = useState([])
    const {state, dispatch} = useContext(UserContext)
    useEffect(() => {
        fetch("/getsubpost",{
            headers : {
                "Authorization" : "Bearer "+localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(result => {
            console.log(result)
            setData(result.posts)
        })
    },[])

    const likePost = (id) => {
        fetch("/like",{
            method : "put",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer "+localStorage.getItem("jwt")
            },
            body : JSON.stringify({
                postId : id
            })
        }).then(res => res.json())
        .then(result => {
            // console.log(result)
            const newData = data.map(item => {
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err => {
            console.log(err)
        })
    }

    const unlikePost = (id) => {
        fetch("/unlike",{
            method : "put",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer "+localStorage.getItem("jwt")
            },
            body : JSON.stringify({
                postId : id
            })
        }).then(res => res.json())
        .then(result => {
            // console.log(result)
            const newData = data.map(item => {
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err => {
            console.log(err)
        })
    }

    const makeComment = (text, postId) => {
        fetch("/comment",{
            method : "put",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer "+localStorage.getItem("jwt")
            },
            body : JSON.stringify({
                postId : postId,
                text : text
            })
        }).then(res => res.json())
        .then(result => {
            console.log(result)
            const newData = data.map(item => {
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err => {
            console.log(err)
        })
    }

    const deletePost = (postid) => {
        fetch("/deletepost/"+postid,{
            method:"delete",
            headers:{
                "Authorization" : "Bearer "+localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(result => {
            // console.log(result)
            const newData = data.filter(item => {
                return item._id !== result._id
            })
            setData(newData)
        })
    }   


    const deleteComment = (commentid) => {
        fetch("/deletecomment/"+commentid,{
            method:"delete",
            headers:{
                "Authorization" : "Bearer "+localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(result => {
            console.log(data)
            const newData = data.filter(item => {
                return item.comments._id !== result._id
            })
            setData(newData)
        })
    }  

    return (
        <div className="home">
            {
                data.map(item =>{
                    return(
                        <div className="card home-card" key={item._id}>
                            {/* {console.log(item)} */}
                            <div className="header-wrapper">
                                <div className="img-name">
                                    <div >
                                        <img className="profile-pic" src={item.postedBy.pic?item.postedBy.pic:"Loading.."} alt="Profile-pic"/>
                                    </div>
                                    <h5 className="user-name"><Link to={item.postedBy._id !== state._id ? "/profile/"+item.postedBy._id : "/profile" }>{item.postedBy.name}</Link></h5>
                                </div> 
                                <div>
                                    {item.postedBy._id == state._id
                                    && <i className="material-icons delete-icon" onClick={()=>deletePost(item._id)}>delete</i>}
                                </div>
                            </div>
                            <div className="card-image">
                                <img src={item.photo} alt="post" />
                            </div>
                            <div className="card-content">
                                {/* <i className="material-icons" style={{color:"#e53935"}}>favorite</i> */}
                                {item.likes.includes(state._id) 
                                ?  <i className="material-icons liked" onClick={()=> unlikePost(item._id)}>favorite</i>
                                :   <i className="material-icons" onClick={() => likePost(item._id)}>favorite_border</i>     
                                }
                                
                                
                                <h6>{item.likes.length >=2 ? item.likes.length +" likes" : item.likes.length +" like"}</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record => {
                                        return(
                                            <h6 key={record._id}><span>@<b>{record.postedBy.name}:</b></span> {record.text}
                                            {record.postedBy._id == state._id
                                            && <i className="material-icons delete-comment" onClick={()=>deleteComment(item.comments._id)}
                                            >delete</i>}</h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    makeComment(e.target[0].value,item._id)
                                    e.target[0].value = ""
                                }}>
                                    <input className="home-card-comment" type="text" placeholder="add a comment"></input>
                                </form>
                                
                            </div>
                        </div>
                    )
                })
            }
            
        </div>
    )
}


export default Home;