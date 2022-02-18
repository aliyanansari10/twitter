import React, { useState, useEffect } from 'react';
import Sidebar from '../sidebar/Sidebar';
import Trends from '../trends/Trends';
import './users.css';

import {
  onValue,
  ref,
  getDatabase,
  update,
  // set,
  // push,
} from 'firebase/database';

function Users(props) {
  const loggedInUser = localStorage.getItem('user');
  const [userProfile, setUserProfile] = useState();
  const [data, setData] = useState();
  const db = getDatabase();
  const { searchValue } = Trends();
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
    // console.log('Use Effect Trigerred -------');
    // ---------------------- Function to Get Profiles -----------------------
    onValue(ref(db, `users/`), (snapshot) => {
      snapshot.forEach(() => {
        // const childKey = childSnapshot.key;
        // const childData = childSnapshot.val();
        // console.log('data is in correct form ', childKey, childData);
        setData({ ...snapshot.val() });
      });
    });
    return () => {
      setData({});
    };
  }, []);

  // ---------------------- Handle Follow user --------------------------
  console.log('Search value from trends search bar to Users', searchValue);
  function handleFollow(id) {
    const loginUserFollowing = data[loggedInUser].following;
    const desiredUserFollowers = data[id].followers;
    if (!loginUserFollowing.includes(id)) {
      console.log('You are currently not following this user');
      desiredUserFollowers.push(loggedInUser);
      loginUserFollowing.push(id);
      console.log('Now You are following', loginUserFollowing);
      console.log('One follower increased', desiredUserFollowers);
      // ------------ update firebase -----------
      // const locationsRef = firebase.database().ref(`/users/${userId}/locations`);
      update(ref(db, `users/${loggedInUser}/`), {
        following: loginUserFollowing,
      });
      update(ref(db, `users/${id}/`), {
        followers: desiredUserFollowers,
      });
      console.log('Data Updated successfully');
    } else {
      console.log('You are already following this user');
    }
    // console.log(
    //   'Logged in User Following: ',
    //   loginUserFollowing.includes('Hello')
    //   // loginUserFollowing.find((el) => {
    //   //   return el === 'Hello';
    //   // })
    // );
    // console.log('On Click get user Data: ', data);
  }

  // ----------------------- Handle Un Follow -------------------------

  function handleUnFollow(id) {
    // console.log('Unfollow Button Pressed');
    const loginUserFollowing = data[loggedInUser].following;
    const desiredUserFollowers = data[id].followers;
    if (loginUserFollowing.includes(id)) {
      // console.log('You are currently not following this user');
      const indexToRemoveFollowing = loginUserFollowing.indexOf(id);
      const indexToRemoveFollowers = desiredUserFollowers.indexOf(loggedInUser);
      loginUserFollowing.splice(indexToRemoveFollowing, 1);
      desiredUserFollowers.splice(indexToRemoveFollowers, 1);
      console.log('you unfollowed the selected user', loginUserFollowing);
      console.log('your one followers is decreased', desiredUserFollowers);

      // // ------------ update firebase -----------

      update(ref(db, `users/${loggedInUser}/`), {
        following: loginUserFollowing,
      });
      update(ref(db, `users/${id}/`), {
        followers: desiredUserFollowers,
      });
      console.log('Data Updated successfully');
    } else {
      console.log('You are currently not following this person');
    }
    // console.log('On Click get user Data: ', data);
  }

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
                // console.log('User Id One -----: ', id[0]);
                // console.log('User Id two index ----:', id[1]);
                let item = id[1];
                return (
                  <div
                    className="users"
                    key={id[0]}
                    style={
                      loggedInUser === id[0]
                        ? { display: 'none' }
                        : { display: 'block' }
                    }
                  >
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
                          <button
                            // className="btn btn-outline-info"
                            className={`btn btn${
                              item.followers.includes(loggedInUser)
                                ? '-'
                                : '-outline-'
                            }info`}
                            onClick={() => handleFollow(id[0])}
                            // style={
                            //   loggedInUser === id[0]
                            //     ? { display: 'none' }
                            //     : { display: 'block' }
                            // }
                          >
                            Follow
                          </button>
                          <button
                            className={`btn btn${
                              item.followers.includes(loggedInUser)
                                ? '-outline-'
                                : '-'
                            }info`}
                            // ${
                            //   item.followers.includes(loggedInUser)
                            //     ? '-outline-'
                            //     : '-'
                            // }info`}

                            onClick={() => handleUnFollow(id[0])}
                          >
                            UnFollow
                          </button>
                          {/* <button
                            className="btn btn-outline-info"
                            disabled={loggedInUser === id[0] ? true : false}
                          >
                            Follow
                          </button>
                          <button
                            className="btn btn-outline-info"
                            disabled={loggedInUser === id[0] ? true : false}
                          >
                            UnFollow
                          </button> */}
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

export default Users;
