import React, {useContext, useRef, useEffect, useState} from "react";
import "../App.css"
import { Link, useHistory } from "react-router-dom";
import {UserContext} from "../App";
import M from "materialize-css";
import "./Navbar.css"
// import { search } from "../../../routes/auth";

const Navbar = () => {
    const searchModal = useRef(null)
    const [search, setSearch] = useState("")
    const [userDetails, setUserDetails] = useState([])
    const history = useHistory();
    const {state,dispatch} = useContext(UserContext)
    useEffect(() => {
        M.Modal.init(searchModal.current)
    },[])
    const renderList = () => {
        if(state){
            return [
                <li key="1"><i data-target="modal1" className="material-icons modal-trigger" style={{color:"grey"}}>search</i></li>,
                <li key="2"><Link to="/myfollowingpost">Home</Link></li>,
                <li key="3"><Link to="/profile">Profile</Link></li>,
                <li key="4"><Link to="/createpost">Create Post</Link></li>,
                <li key="5"><button className="btn #e53935 red darken-1 logout-btn" onClick={() => {
                    localStorage.clear()
                    dispatch({type:"CLEAR"})
                    history.push("/login")
                }}>Log Out</button></li>
            ]
        }else{
            return [
                <li key="6"><Link to="/login">Login</Link></li>,
                <li key="7"><Link to="/signup">Signup</Link></li>
            ]
        }
    }


    const fetchUsers =(query) => {
        setSearch(query)
        fetch("/search-users",{
            method:"post",
            headers : {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                query
            })
        }).then(res => res.json())
        .then(results => {
            console.log(results)
            setUserDetails(results.user)
        })
    }
    return ( 
        <nav>
            <div className="nav-wrapper white">
                <Link to={state?"/":"/login"} className="brand-logo left">Instagram</Link>
                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>
            <div id="modal1" className="modal" ref={searchModal} style={{color:"black"}}>
                <div className="modal-content">
                    <input type="text" placeholder="Search for Users" value={search} onChange={(e) => fetchUsers(e.target.value)}/>
                    <ul className="collection">
                        {userDetails.map(item => {
                            return <Link to={ item._id !== state._id ? "/profile/"+item._id : "/profile"} onClick={()=>{
                                M.Modal.getInstance(searchModal.current).close()
                                setSearch("")
                            }} ><div style={{display:"flex"}}><img className="profile-pic" src={item.pic?item.pic:"Loading.."} alt="Profile-pic"/><li key={item._id} className="collection-item">{item.name}</li></div></Link>
                        })}
                    </ul>
                </div>
                <div className="modal-footer">
                <button className="modal-close waves-effect waves-green btn-flat" onClick={() => setSearch("")}>Close</button>
                </div>
            </div>
        </nav>
    )
}


export default Navbar