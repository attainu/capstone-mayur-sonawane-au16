import React, { useEffect, createContext, useReducer, useContext } from 'react';
import './App.css';
import "./component/Navbar"
import Navbar from './component/Navbar';
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import Home from "./component/screens/Home";
import Profile from "./component/screens/Profile";
import Signup from "./component/screens/Signup";
import Login from "./component/screens/Login";
import CreatePost from './component/screens/CreatePost';
import UserProfile from "./component/screens/UserProfile";
import SubscribedUserPost from "./component/screens/SubscribedUserPost";
import { reducer, initialState } from "./reducers/userReducer";



export const UserContext = new createContext()

const Routing = () => {
  const history = useHistory();
  const {state, dispatch} = useContext(UserContext)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type : "USER", payload : user})
    }else{
      history.push("/login")
    }
  },[])
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/createpost">
        <CreatePost />
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/myfollowingpost">
        <SubscribedUserPost />
      </Route>
    </Switch>
  )
}

function App() {
  const [state,dispatch] = useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state : state, dispatch : dispatch}}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
    
  );
}

export default App;
