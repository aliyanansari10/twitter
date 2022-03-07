import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
// import { useNavigate } from 'react-router-dom';
import {
  FaTwitter,
  // FaHashtag,
  FaHome,
  FaPenFancy,
  FaRegUser,
} from 'react-icons/fa';
import {
  BsBell,
  BsBookmark,
  BsEnvelope,
  BsHash,
  BsPower,
} from 'react-icons/bs';
import { HiOutlineDotsCircleHorizontal } from 'react-icons/hi';
import { RiFileList2Line } from 'react-icons/ri';
import './sidebar.css';
import {
  getDatabase,
  ref,
  //  onValue,
  // get,
  onValue,
} from 'firebase/database';
const loggedInUser = localStorage.getItem('user');

function Sidebar(props) {
  const db = getDatabase();
  const [userSidebar, setuserSidebar] = useState();
  const auth = getAuth();
  const getData = () => {
    // get(ref(db, `users/${loggedInUser}}`), (snapshot) => {
    //   setuserSidebar(snapshot.val());

    //   console.log('Snap Shot Value: ', snapshot.val());
    //   return 1;
    // });
    onValue(ref(db, `users/${loggedInUser}`), (snapshot) => {
      if (snapshot.exists()) {
        // console.log(snapshot.val());
        setuserSidebar(snapshot.val());
      } else {
        console.log('No data available');
      }
    });
  };
  // console.log('---------- user ---------- : ', userSidebar);
  useEffect(() => {
    if (!userSidebar) {
      getData();
    } else {
    }
  }, []);
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        localStorage.setItem('user', null);
        console.log('Sign Out Successful --- Loging Out -----');
      })
      .catch((error) => {
        // An error happened.
      });
  };
  return (
    <div className="col-md-3 col-sm-3 col-3">
      <div className="sidebar">
        <div className="nav-bar">
          <i className="twitter-icon">
            <FaTwitter />
          </i>
          <ul>
            <Link to="/home">
              <li>
                <i className="nav-icons">
                  <FaHome />
                </i>
                <span className="links">Home</span>
              </li>
            </Link>
            <Link to="/home">
              <li>
                <i className="nav-icons">
                  <BsHash />
                </i>
                <span className="links">Explore</span>
              </li>
            </Link>
            <Link to="/home">
              <li>
                <i className="nav-icons">
                  <BsBell />
                </i>
                <span className="links">Notifications</span>
              </li>
            </Link>
            <Link to="/home">
              <li>
                <i className="nav-icons">
                  <BsEnvelope />
                </i>
                <span className="links">Messages</span>
              </li>
            </Link>
            <Link to="/home">
              <li>
                <i className="nav-icons">
                  <BsBookmark />
                </i>
                <span className="links">Bookmarks</span>
              </li>
            </Link>
            <Link to="/users">
              <li>
                <i className="nav-icons">
                  <RiFileList2Line />
                </i>
                <span className="links">Lists</span>
              </li>
            </Link>
            <Link to="/users">
              <li>
                <i className="nav-icons">
                  <FaRegUser />
                </i>
                <span className="links">Users</span>
              </li>
            </Link>
            <Link to={`/profile:${loggedInUser}`}>
              <li>
                <i className="nav-icons">
                  <HiOutlineDotsCircleHorizontal />
                </i>
                <span className="links">Profile</span>
              </li>
            </Link>
          </ul>
          <button className="btn custom-button btn-lg rounded-pill ">
            <i className="nav-icons button-icon">
              <FaPenFancy />
            </i>
            <span className="links">Tweet</span>
          </button>
        </div>
        <div className="user my-5">
          <div>
            <Link to={`/profile:${loggedInUser}`}>
              <img
                src={userSidebar?.imageUrl}
                // src="as"
                alt="Profile"
                className="rounded-circle"
              />
            </Link>
            <div className="profile-name mx-1">
              <span className="full-name">
                {userSidebar?.fullname}
                {/* abc */}
              </span>
              <span className="user-name">
                @{userSidebar?.username.toLowerCase()}
                {/* abc */}
              </span>
            </div>
          </div>
          <button className="log-out mx-4" onClick={handleLogout}>
            <i>
              <BsPower />
            </i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
