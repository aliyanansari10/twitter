import React, { useEffect, useState } from 'react';
import Sidebar from './../sidebar/Sidebar';
import Feed from './../feed/Feed';
import Trends from './../trends/Trends';
import './home.css';
import {
  getDatabase,
  get,
  //   child,
  ref,
  // push,
  // set,
  // remove,
  //   onValue,
} from 'firebase/database';

function Home() {
  const [userData, setUserData] = useState();
  //   let userData = {};
  const loggedInUser = localStorage.getItem('user');
  const db = getDatabase();
  // useEffect(() => {

  //     // ------------ Every Time on OnChange ---------- //
  //     // onValue(ref(db, `users/${userId}/tasks/`), (snapshot) => {
  //     //   snapshot.forEach(() => {
  //     //     const childKey = childSnapshot.key;
  //     //     const childData = childSnapshot.val();
  //     //     console.log('data is in correct form ', childKey, childData);
  //     //     setUserData({ ...snapshot.val() });
  //     //   });

  //     });
  //     return () => {};
  //   }, []);

  //
  function getProfile() {
    get(ref(db, `users/${loggedInUser}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          //   console.log(snapshot.val());
          // console.log('Data Available in rdb', snapshot.val());
          //   userData = snapshot.val();
          setUserData(snapshot.val());
          return 1;
        } else {
          console.log('No data available');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    if (!userData) {
      getProfile();
    } else {
      return () => 1;
    }
  }, []);
  return (
    <div className="Home container-fluid">
      <div className="row">
        <Sidebar
          fullName={userData?.fullname}
          userName={userData?.username}
          userImage={userData?.imageUrl}
        />
        <Feed userImage={userData?.imageUrl} />
        <Trends />
      </div>
    </div>
  );
}

export default Home;
