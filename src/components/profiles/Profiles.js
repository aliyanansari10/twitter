import React, { useState, useEffect } from 'react';
import Sidebar from './../sidebar/Sidebar';
import Trends from './../trends/Trends';
import './profiles.css';

import { onValue, ref, getDatabase } from 'firebase/database';

function Profiles(props) {
  const loggedInUser = localStorage.getItem('user');
  const [userProfile, setUserProfile] = useState();
  const [data, setData] = useState();
  const db = getDatabase();

  // ----------- Function to get Data from Database -------
  function getData() {
    onValue(ref(db, `users/${loggedInUser}`), (snapshot) => {
      setUserProfile(snapshot.val());
      return 1;
    });
  }

  // --------------------- Use Effect ----------------------
  useEffect(() => {
    getData();
    console.log('Use Effect Trigerred -------');
    // ---------------------- Function to Get Profiles -----------------------
    onValue(ref(db, `users/`), (snapshot) => {
      snapshot.forEach(() => {
        // const childKey = childSnapshot.key;
        // const childData = childSnapshot.val();
        // console.log('data is in correct form ', childKey, childData);
        setData({ ...snapshot.val() });
      });
    });
    return 1;
  }, []);
  return (
    <div className="profiles container-fluid">
      <div className="row">
        <Sidebar
          fullName={userProfile?.fullname}
          userName={userProfile?.username}
          userImage={userProfile?.imageUrl}
        />
        <div className="col-md-6 col-sm-9 col-9">
          <div className="profiles my-4">
            <h2>* User Profiles *</h2>
            <hr />
            <div className="display-profiles">
              {Object.entries(data ? data : '').map((id, value) => {
                console.log('User Id One -----: ', id[0]);
                console.log('User Id two index ----:', id[1]);
                let item = id[1];
                return (
                  <div className="users" key={id[0]}>
                    <div className="display-user my-2">
                      {/* <Link to="/profile"> */}
                      <img
                        src={item.imageUrl}
                        alt="Profile"
                        className="rounded-circle"
                      />
                      {/* </Link> */}
                      <div className="profile-data">
                        <div className="profileName mx-1">
                          <span className="full-name">{item.fullname}</span>
                          <span className="user-name">
                            @{item.username?.toLowerCase()}
                          </span>
                        </div>
                        <div className="follow">
                          <button className="btn btn-outline-info">
                            Follow
                          </button>
                          <button className="btn btn-outline-info">
                            UnFollow
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  // <tr
                  //   key={value}
                  //   id={id[0]}
                  //   onClick={() => {
                  //     viewData(id);
                  //   }}
                  // >
                  //   <td>{item.task}</td>
                  //   <td>{item.description}</td>
                  //   <td>{item.status}</td>
                  // </tr>
                );
              })}
            </div>
          </div>
        </div>
        <Trends />
      </div>
    </div>
  );
}

export default Profiles;
