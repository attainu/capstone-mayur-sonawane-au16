import React, {useState, useContext} from "react";
import "./Login.css";
import {Link, useHistory} from "react-router-dom";
import {UserContext} from "../../App";
import M from "materialize-css";


const Login = () => {
    const {state, dispatch} = useContext(UserContext);
    const history = useHistory();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const postData = () => {
        // eslint-disable-next-line
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "Please enter a valid email", classes : "#c62828 red darken-3"})
            return
        // eslint-disable-next-line
        } else if(!/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(password)){
            M.toast({html: "Please enter valid email/password", classes : "#c62828 red darken-3"})
            return
        }
        fetch("/signin",{
            method : "post",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                email : email,
                password : password
            })
        }).then(res => res.json())
        .then(data => {
            if(data.error){
                M.toast({html: data.error, classes : "#c62828 red darken-3"})
            } else{
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER", payload:data.user})
                M.toast({html:"Logged In Successfully!", classes : "#64dd17 light-green accent-4"})
                history.push("/")
            }
        }).catch(err => {
            console.log(err)
        })
    }
    return (
        <>
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2 className="login-header">Instagram</h2>
                <input type="email" placeholder="Phone number, username or email " onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                <button className="btn waves-effect waves-light #64b5f6 blue lighten-2 login-btn" onClick={() => postData()}>Log In</button>
            </div>
        </div>
        <div className="mycard2">
            <div className="card auth-card input-field">
                <h6>Don't have an account? <Link className="login-link" to="/signup">Sign Up</Link></h6>
            </div>
        </div>
        </>
    )
}


export default Login;