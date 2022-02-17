import React, {
  useEffect,
  //  useState
} from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Signup from './components/signup/Signup';
import Login from './components/login/Login';
// import Sidebar from './components/sidebar/Sidebar';
// import Feed from './components/feed/Feed';
// import Trends from './components/trends/Trends';
import './App.css';
import Profile from './components/profile/Profile';
import Profiles from './components/profiles/Profiles';
import Home from './components/home/Home';
// import UploadImage from './components/uploadImage/UploadImage';

function App() {
  const navigate = useNavigate();
  // const [userId, setUserId] = useState();
  useEffect(() => {
    const unsub = onAuthStateChanged(getAuth(), (user) => {
      console.log('on auth state change --------- user --------', user);
      if (user) {
        // setUserId(user.uid);
        // navigate('/home', { replace: true });
        console.log('Welcome User');
      } else {
        navigate('/', { replace: true });
      }
    });
    return unsub;
  }, [onAuthStateChanged]);

  return (
    // <Router>
    <div className="App ">
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/home" element={<Home />} />
        <Route exact path="/profile" element={<Profile />} />
        <Route exact path="/profiles" element={<Profiles />} />
      </Routes>
    </div>
    // </Router>
  );
}

export default App;
