import React, {useState, useEffect} from "react";
import "./Signup.css"
import {Link, useHistory} from "react-router-dom";
import M from "materialize-css";

const Signup = () => {
    const history = useHistory();
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState(undefined)

    useEffect(() => {
        if(url){
            uploadFields()
        }
    }, [url])


    const uploadProfilePic = () => {
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
        }).catch(err => {
            console.log(err)
        })
        
    }

    const uploadFields = () => {
        if(name.length <=3){
            M.toast({html: "Username must have atleast 4 characters ", classes : "#c62828 red darken-3"})
            return
        // eslint-disable-next-line
        } else if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "Please enter a valid email", classes : "#c62828 red darken-3"})
            return
        // eslint-disable-next-line    
        } else if(!/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(password)){
            M.toast({html: "Password should be more than 6 characters, and have atleast 1 number and 1 special character", classes : "#c62828 red darken-3"})
            return
        }
        fetch("/signup",{
            method: "post",
            headers: {
                "Content-Type":"application/json" 
            },
            body:JSON.stringify({
                name : name,
                email : email,
                password : password,
                pic : url
            })
        }).then(res => res.json())
        .then(data => {
            if(data.error){
                M.toast({html: data.error, classes : "#c62828 red darken-3"})
            } else{
                M.toast({html: data.message, classes : "#64dd17 light-green accent-4"})
                history.push("/login")
            }
        }).catch(err => {
            console.log(err)
        })
    }

    const PostData = () => {
        // eslint-disable-next-line 
        if(image){
            uploadProfilePic()
        }else{
            uploadFields()
        }
        
    }
    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2 className="login-header">Instagram</h2>
                <input type="text" placeholder="Username" value={name} onChange={(e) => setName(e.target.value)}/>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <div className="file-field input-field">
                    <div className="btn waves-effect waves-light #64b5f6 blue darken-1">
                        <span>Upload Profile Pic</span>
                        <input type="file" onChange={(e) => setImage(e.target.files[0])}/>
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text"/>
                    </div>
                </div>
                <button className="btn waves-effect waves-light #64b5f6 blue lighten-2 login-btn" onClick={() => PostData()}>Sign Up</button>
            </div>
            <div className="mycard2">
                <div className="card auth-card input-field">
                    <h6>Already have an account? <Link className="login-link" to="/login">Log In</Link></h6>
                </div>
            </div>
        </div>
    )
}


export default Signup;