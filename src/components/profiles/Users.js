import React, { useState, useEffect } from 'react';
import Sidebar from '../sidebar/Sidebar';
import Trends from '../trends/Trends';
import { Link } from 'react-router-dom';
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
  // const [userProfile, setUserProfile] = useState();
  const [data, setData] = useState();
  const db = getDatabase();
  const [searchValue, setSearchValue] = useState('');

  // const { searchValue } = Trends();
  // ----------- Function to get Data from Database -------
  // function getData() {
  //   onValue(ref(db, `users/${loggedInUser}`), (snapshot) => {
  //     setUserProfile(snapshot.val());
  //     return 1;
  //   });
  // }

  // --------------------- Use Effect ----------------------
  useEffect(() => {
    // ---------------------- Function to Get Profiles -----------------------

    onValue(ref(db, `users/`), (snapshot) => {
      snapshot.forEach(() => {
        setData({ ...snapshot.val() });
      });
    });

    return () => {
      setData({});
    };
  }, []);

  // ---------------------- Handle Follow user --------------------------
  function handleFollow(id) {
    const loginUserFollowing = data[loggedInUser].following;
    const desiredUserFollowers = data[id].followers;
    if (!loginUserFollowing?.includes(id)) {
      desiredUserFollowers.push(loggedInUser);
      loginUserFollowing.push(id);

      // ------------ update firebase -----------

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
  }

  // ----------------------- Handle Un Follow -------------------------

  function handleUnFollow(id) {
    const loginUserFollowing = data[loggedInUser].following;
    const desiredUserFollowers = data[id].followers;

    if (loginUserFollowing?.includes(id)) {
      const indexToRemoveFollowing = loginUserFollowing.indexOf(id);
      const indexToRemoveFollowers = desiredUserFollowers.indexOf(loggedInUser);
      loginUserFollowing.splice(indexToRemoveFollowing, 1);
      desiredUserFollowers.splice(indexToRemoveFollowers, 1);

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
  }

  return (
    <div className="profiles container-fluid">
      <div className="row">
        <Sidebar />
        <div className="col-md-6 col-sm-9 col-9">
          <div className="profiles my-4">
            <h2>* User Profiles *</h2>
            <hr />
            <div className="display-profiles">
              {Object.entries(data ? data : '')
                .filter((element) => {
                  return element[1].fullname
                    ?.toLowerCase()
                    .includes(searchValue?.toLowerCase());
                })
                .map((id, value) => {
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
                        <Link to={`/profile:${id[0]}`}>
                          <img
                            src={item.imageUrl}
                            alt="Profile"
                            className="rounded-circle"
                          />
                        </Link>
                        {/* </Link> */}
                        <div className="profile-data">
                          <div className="profileName mx-1">
                            <Link to={`/profile:${id[0]}`}>
                              <span className="full-name">
                                {item?.fullname}
                              </span>
                            </Link>
                            <Link to={`/profile:${id[0]}`}>
                              <span className="user-name">
                                @{item.username?.toLowerCase()}
                              </span>
                            </Link>
                          </div>

                          <div className="follow">
                            <button
                              // className="btn btn-outline-info"
                              className={`btn btn${
                                item.followers?.includes(loggedInUser)
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
                                item.followers?.includes(loggedInUser)
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
        <Trends getSearchValue={(search) => setSearchValue(search)} />
      </div>
    </div>
  );
}

export default Users;
