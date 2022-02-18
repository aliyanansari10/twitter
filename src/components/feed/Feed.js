import React, { useEffect, useState } from 'react';
import './feed.css';
import {
  onValue,
  ref,
  getDatabase,
  push,
  // set,
  update,
} from 'firebase/database';
import {
  getStorage,
  ref as newref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import {
  BsStars,
  // BsBookmark,
  BsImage,
  BsBarChartLine,
  BsEmojiSmile,
} from 'react-icons/bs';
import { BiLike } from 'react-icons/bi';
import { GoLocation } from 'react-icons/go';
import { AiOutlineSchedule } from 'react-icons/ai';
import { MdOutlineGif } from 'react-icons/md';
import { Link } from 'react-router-dom';
function Feed(props) {
  // ----------------- Initialization ----------------

  const loggedInUser = localStorage.getItem('user');
  const db = getDatabase();
  const storage = getStorage();
  const [posts, setPosts] = useState();
  const [userProfile, setUserProfile] = useState();
  // let content = true;
  // let [content, setcontent] = useState();
  // const [likes, setLikes] = useState();
  // const [postProfile, setPostProfile] = useState();
  let postImage;

  // ----------- Function To Get user Data from firebase ------------
  // ----------- Function to get Data from Database -------

  function getData() {
    // console.log('get Data Function');
    onValue(ref(db, `users/${loggedInUser}`), (snapshot) => {
      setUserProfile(snapshot.val());
      return 1;
    });
  }

  useEffect(() => {
    onValue(ref(db, `posts/`), (snapshot) => {
      snapshot.forEach(() => {
        // const childKey = childSnapshot.key;
        // const childData = childSnapshot.val();
        setPosts({ ...snapshot.val() });
      });
    });
    if (!userProfile) {
      getData();
    } else {
      // console.log('Return 1 use Effect with user Data: ', userProfile);
      return () => setPosts({});
    }
  }, []);

  // --------------------------------- Save Post Image ----------------------------------

  const handlePostImage = (e) => {
    postImage = e.target.files[0];
    console.log('Image Data', postImage);
  };

  // ----------------------------------- Post Tweet --------------------------------------

  const postTweet = (e) => {
    e.preventDefault();
    const date = new Date().toDateString();
    const imageName = new Date().getTime();
    // const postDate = `${date.getDate()} ${monthName[date.getMonth()]}`;
    const description = document.getElementById('post-description').value;
    const storageRef = newref(storage, 'posts/' + imageName + '.jpg');
    uploadBytes(storageRef, postImage).then((snapshot) => {
      getDownloadURL(storageRef).then((downloadURL) => {
        // Storing Data in Realtime Database
        push(ref(db, 'posts/' + loggedInUser), {
          description: description,
          postImage: downloadURL,
          createdBy: userProfile.fullname,
          userProfile: userProfile.imageUrl,
          createdOn: date,
          likes: [''],
        });
        document.getElementById('post-tweet').reset();
        console.log('Post Uploaded');
      });
    });
  };

  return (
    <div className="col-md-6 col-sm-9 col-9">
      <div className="feed">
        {/* ----------------------- Post Tweet ------------------------- */}
        <div className="head">
          <h4>Home</h4>
          <i>
            <BsStars />
          </i>
        </div>
        <div className="post">
          <div className="image-box">
            <Link to="/profile">
              <img
                src={props.userImage}
                alt="Profile"
                className="rounded-circle"
              ></img>
            </Link>
          </div>
          <form id="post-tweet">
            <div className="post-box row">
              <textarea
                rows="3"
                cols="12"
                placeholder="What's Happening?"
                id="post-description"
                required
              ></textarea>
              <div className="post-icons">
                <div className="n-icons">
                  <label htmlFor="upload-photo">
                    <i className="n-icons">
                      <BsImage />
                    </i>
                  </label>
                  <input
                    type="file"
                    name="photo"
                    onChange={handlePostImage}
                    id="upload-photo"
                  />
                  <i className="n-icons">
                    <MdOutlineGif />
                  </i>
                  <i className="n-icons">
                    <BsBarChartLine />
                  </i>
                  <i className="n-icons">
                    <BsEmojiSmile />
                  </i>
                  <i className="n-icons">
                    <AiOutlineSchedule />
                  </i>

                  <i className="n-icons">
                    <GoLocation />
                  </i>
                </div>
                <div className="post-btn">
                  <button
                    className="btn custom-button rounded-pill px-4"
                    onClick={postTweet}
                  >
                    Tweet
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* ------------------ Posts news feed -------------------- */}

        <div className="posts">
          {
            // ---------------------First Map Method --------------------//
            Object.entries(posts ? posts : '').map((id, value) => {
              let item = id[1];

              // let profile;
              // console.log('console from getting, ', id[0]);
              // Getting user data for profile Updated //
              // get(ref(db, `users/${id[0]}`)).then((snapshot) => {
              //   console.log(snapshot);
              //   // setPostProfile(snapshot.val());
              //   // console.log('Snapshot value is: ..... new -----', profile);
              // });

              // ---------------------Second Map Method --------------------//
              // console.log('First map function console log  ', userProfile);
              if (userProfile?.following.includes(id[0])) {
                // content = true;
                return Object.entries(item).map((secondId, secondValue) => {
                  // setLikes(secondId[1].likes);
                  let likes = secondId[1].likes;
                  const handleLikes = () => {
                    // console.log(
                    //   'Logic value in return',
                    //   likes.find((value) => value === loggedInUser)
                    // );
                    if (likes.find((value) => value === loggedInUser)) {
                      const index = likes.indexOf(loggedInUser);
                      if (index > -1) {
                        likes.splice(index, 1);
                        console.log(
                          'Like Button Pressed but user already liked the post so unliking it now'
                        );
                        update(ref(db, 'posts/' + id[0] + '/' + secondId[0]), {
                          // createdBy: secondId[1].createdBy,
                          // createdOn: secondId[1].createdOn,
                          // description: secondId[1].description,
                          // postImage: secondId[1].postImage,
                          // userProfile: secondId[1].userProfile,
                          likes: likes,
                        });
                      } else {
                        console.log('Nothing Happens');
                      }
                    } else {
                      likes.push(loggedInUser);
                      console.log('New Like to the post');
                      update(ref(db, 'posts/' + id[0] + '/' + secondId[0]), {
                        likes: likes,
                      });
                    }
                  };
                  return (
                    <div className="row" key={secondId[0]}>
                      <div className="posts-profile col-md-2">
                        <Link to="/home">
                          <img
                            src={secondId[1].userProfile}
                            className="rounded-circle"
                            alt="User Profile"
                          />
                        </Link>
                      </div>
                      <div className="post-content col-md-10">
                        <div className="posts-head">
                          <Link to="/home"> {secondId[1].createdBy} </Link>
                          <span>. {secondId[1].createdOn}</span>
                        </div>
                        <hr />
                        <div className="posts-body">
                          <p>{secondId[1].description}</p>
                          <img
                            src={secondId[1].postImage}
                            className="rounded post-image"
                            alt="post"
                          />
                        </div>
                      </div>
                      <div className="post-like">
                        <button onClick={handleLikes}>
                          <i>
                            <BiLike />
                          </i>
                        </button>
                        <span className="like-count">
                          {likes.length - 1 === 0 ? '0' : likes.length - 1}
                        </span>
                      </div>
                    </div>
                    // <div className="users" key={id[0]}>
                  );
                });
              } else {
                return '';
                // content = false;
              }
            })
          }
          <div
            className="display-bar my-4"
            style={
              userProfile
                ? userProfile['following'].length > 1
                  ? { display: 'none' }
                  : { display: 'block' }
                : { display: 'none' }
            }
          >
            <>
              {/* {console.log('Display content value User Profile Following ')} */}
              <h2>Oops! Nothing to Show Here </h2>
              <h3>You Need to Follow Users to get Some Posts</h3>
            </>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feed;
