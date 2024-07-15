import './App.css';
import Home from './screens/Home';
import Navbar from './components/Navbar';
import React,{useState} from 'react';


import {BrowserRouter,Routes,Route} from "react-router-dom";
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Profile from './screens/Profile';
import CreatePost from './screens/CreatePost';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoginContext } from './components/context/LoginContext';
import Modal from './components/Modal';
import UserProfile from './components/UserProfile';
import MyfollowingPost from './screens/MyfollowingPost';
import Search from './screens/Search';

import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  const [userLogin,setUserLogin]=useState(false);
  const[modalOpen,setModalOpen]=useState(false);
  return (
    <BrowserRouter>
      <div className="App">
      <GoogleOAuthProvider clientId="54225529925-621pb0t6ju4suq45m2b1f2bg8ing23on.apps.googleusercontent.com">
        <LoginContext.Provider value={{setUserLogin,setModalOpen}}>
         <Navbar login={userLogin}/>
         <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/signin" element={<SignIn/>}/>
            <Route exact path="/profile" element={<Profile/>}/>
            <Route path="/createPost" element={<CreatePost/>}/>            
            <Route path="/profile/:userid" element={<UserProfile/>}/>            
            <Route path="/followingpost" element={<MyfollowingPost/>}/>            
            <Route path="/search" element={<Search/>}/>
         </Routes>
        <ToastContainer theme="dark"/>
        {modalOpen && <Modal setModalOpen={setModalOpen}/>}
        </LoginContext.Provider>
      </GoogleOAuthProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;
