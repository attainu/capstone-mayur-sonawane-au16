import React, {useState, useEffect} from "react";
import "./CreatePost.css";
import M from "materialize-css";
import { useHistory } from "react-router-dom";


const CreatePost = () => {
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [photo, setPhoto] = useState("")
    const [url, setUrl] = useState("")
    const history = useHistory();


    useEffect(() => {
        if(url){
            fetch("/createpost",{
                method : "post",
                headers : {
                    "Content-Type" : "application/json",
                    "Authorization" : "Bearer "+localStorage.getItem("jwt")
                },
                body : JSON.stringify({
                    title : title,
                    body : body,
                    photo : url
                })
            }).then(res => res.json())
            .then(data => {
                // console.log(data)
                if(data.error){
                    M.toast({html: data.error, classes : "#c62828 red darken-3"})
                } else{
                    M.toast({html:"Posted Successfully!", classes : "#64dd17 light-green accent-4"})
                    history.push("/")
                }
            })
        }
    },[url])

    const postDetails = () => {
        const data = new FormData();
        data.append("file",photo);
        data.append("upload_preset","instagram-clone");
        data.append("cloud_name","mac90")
        fetch("https://api.cloudinary.com/v1_1/mac90/image/upload",{
            method : "post",
            body : data
        }).then(res => res.json())
        .then(data => {
            setUrl(data.url)
        }).catch(err => {
            console.log(err)
        })
        
    }

    return (
        <div>
            <div className="card input-field-wraper">
                <input className="input-field" type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                <input className="input-field" type="text" placeholder="Description" value={body} onChange={(e) => setBody(e.target.value)}/>
                <div className="file-field input-field">
                    <div className="btn waves-effect waves-light #64b5f6 blue darken-1">
                        <span>Upload Image</span>
                        <input type="file" onChange={(e) => setPhoto(e.target.files[0])}/>
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text"/>
                    </div>
                </div>
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1 submitPost-btn" onClick={() => postDetails()}>Submit</button>
            </div>
        </div>
    )
}


export default CreatePost;