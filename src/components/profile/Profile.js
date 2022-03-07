import React, { useEffect, useState } from 'react';
import Sidebar from './../sidebar/Sidebar';
import Trends from './../trends/Trends';
import Modal from 'react-modal';
import {
  getStorage,
  ref as newref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import { FaUpload } from 'react-icons/fa';
import { BiLike } from 'react-icons/bi';
import { Link, useParams } from 'react-router-dom';
import {
  onValue,
  ref,
  getDatabase,
  // set,
  update,
} from 'firebase/database';
import './profile.css';

function Profile() {
  const db = getDatabase();
  const storage = getStorage();
  const loggedInUser = localStorage.getItem('user');
  const [userProfile, setUserProfile] = useState();
  const [posts, setPosts] = useState();
  // const [userIdForPosts, setUserIdForPosts] = useState();
  const [showEdit, setShowEdit] = useState();
  const [Image, setImage] = useState();
  const [selectedRow, setSelectedRow] = useState();
  const { userid } = useParams();
  // const [profileId, setprofileId] = useState();
  // setprofileId(userid.split(':'));
  const profileId = userid.split(':');
  // console.log('Profile Id is', profileId);
  // ---------- Handle Onchange EVent for Image Upload -----------

  const handleImage = (e) => {
    setImage(e.target.files[0]);
    return 1;
  };

  // ------------------- Handle Onchange Value On edit Profile Modal ---------
  //  Handle on Change Value
  const onChangeHandlerUserName = (event) => {
    setSelectedRow(
      JSON.parse(
        JSON.stringify({ ...selectedRow, username: event.target.value })
      )
    );
  };
  const onChangeHandlerFullName = (event) => {
    setSelectedRow(
      JSON.parse(
        JSON.stringify({ ...selectedRow, fullname: event.target.value })
      )
    );
  };
  const onChangeHandlerContact = (event) => {
    setSelectedRow(
      JSON.parse(
        JSON.stringify({ ...selectedRow, contact: event.target.value })
      )
    );
  };

  // ----------------- On Edit Handler --------------------
  const onEditHandler = (event) => {
    event.preventDefault();
    // console.log('selected row     ----- all data -----', selectedRow);
    const storageRef = newref(storage, 'posts/' + loggedInUser + '.jpg');
    uploadBytes(storageRef, Image).then((snapshot) => {
      getDownloadURL(storageRef).then((downloadURL) => {
        update(ref(db, `users/${loggedInUser}/`), {
          username: selectedRow.username,
          fullname: selectedRow.fullname,
          contact: selectedRow.contact,
          imageUrl: downloadURL,
        });
      });
    });
    console.log('data Updated Successfully');
  };

  // ----------- Function to get Data from Database -------
  function getData() {
    onValue(ref(db, `users/${profileId[1]}`), (snapshot) => {
      setUserProfile(snapshot.val());
      // console.log('Setting user Profile', setUserIdForPosts(snapshot.val()));
      setSelectedRow(snapshot.val());
      return 1;
    });
  }
  function getPosts() {
    onValue(ref(db, `posts/${profileId[1]}`), (snapshot) => {
      snapshot.forEach(() => {
        // const childKey = childSnapshot.key;
        // const childData = childSnapshot.val();
        setPosts({ ...snapshot.val() });
        // console.log('Posts: ', snapshot.val());
      });
    });
  }

  // ------------ Use Effect ---------------

  useEffect(() => {
    getData();
    getPosts();
    return 1;
  }, []);

  return (
    <div className="profile container-fluid">
      <div className="row">
        <Sidebar />
        <div className="col-md-6 col-sm-9 col-9">
          <div className="profile my-5">
            <div className="profile-pic">
              <img
                src={userProfile ? userProfile.imageUrl : ''}
                alt="profile"
                className="rounded-circle"
              />
            </div>
            <div className="profile-content">
              <h2 className="my-3">
                {userProfile ? userProfile.fullname : ''}
              </h2>
              <hr />
              <h4>
                <span className="text-left">UserName:</span>{' '}
                <span className="text-right">
                  @{userProfile ? userProfile.username.toLowerCase() : ''}
                </span>
              </h4>
              <h4>
                <span className="text-left">Contact:</span>{' '}
                <span className="text-right">
                  {userProfile ? userProfile.contact : ''}
                </span>
              </h4>
              <h4>
                <span className="text-left">Status:</span>{' '}
                <span className="text-right">
                  {userProfile ? userProfile.status : ''}
                </span>
              </h4>
            </div>
            <div
              className="edit-profile"
              style={
                profileId[1] === loggedInUser
                  ? { display: 'block' }
                  : { display: 'none' }
              }
            >
              <button
                className="btn custom-button"
                onClick={() => setShowEdit(true)}
              >
                Edit Profile
              </button>
            </div>
          </div>
          <hr />
          {/* ------------------------ Posts --------------------- */}
          <div className="posts">
            {/* {console.log('User id For Posts', userIdForPosts)} */}
            {
              // ---------------------First Map Method --------------------//

              Object.entries(posts ? posts : '').map((id, value) => {
                let likes = id[1].likes;
                const handleLikes = () => {
                  if (likes.find((value) => value === loggedInUser)) {
                    const index = likes.indexOf(loggedInUser);
                    if (index > -1) {
                      likes.splice(index, 1);
                      // console.log(
                      //   'Like Button Pressed but user already liked the post so unliking it now'
                      // );
                      update(ref(db, 'posts/' + profileId[1] + '/' + id[0]), {
                        likes: likes,
                      });
                    } else {
                      // Nothing Goes Here ...
                    }
                  } else {
                    likes.push(loggedInUser);
                    // console.log('New Like to the post');
                    update(ref(db, 'posts/' + profileId[1] + '/' + id[0]), {
                      likes: likes,
                    });
                  }
                };
                return (
                  <div className="row" key={id[0]}>
                    <div className="posts-profile col-md-2">
                      <Link to="/home">
                        <img
                          src={id[1].userProfile}
                          className="rounded-circle"
                          alt="User Profile"
                        />
                      </Link>
                    </div>
                    <div className="post-content col-md-10">
                      <div className="posts-head">
                        <Link to="/home"> {id[1].createdBy} </Link>
                        <span>. {id[1].createdOn}</span>
                      </div>
                      <hr />
                      <div className="posts-body">
                        <p>{id[1].description}</p>
                        <img
                          src={id[1].postImage}
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
                );
              })
            }
          </div>
        </div>
        <Trends />
      </div>
      {/* ----------------------- Edit Modal ----------------------- */}
      <Modal
        isOpen={showEdit}
        ariaHideApp={false}
        onRequestClose={() => {
          setShowEdit(false);
        }}
        shouldCloseOnOverlayClick={true}
        style={{
          content: {
            width: '550px',
            height: '360px',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            textAlign: 'center',
            transform: 'translate(-50%, -50%)',
            borderRadius: '10px',
          },
          button: {
            padding: '30px',
          },
        }}
      >
        <form className="row g-2" id="edit-task" onSubmit={onEditHandler}>
          <div className="col-md-12">
            <label htmlFor="user-name" className="form-label">
              UserName:
            </label>
            <input
              type="text"
              className="form-control"
              id="user-name"
              placeholder="Enter Your User Name"
              required
              value={selectedRow ? selectedRow.username : ''}
              onChange={onChangeHandlerUserName}
            />
          </div>
          <div className="col-md-12">
            <label htmlFor="full-name" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              className="form-control"
              id="full-name"
              placeholder="Enter Full-name"
              required
              value={selectedRow ? selectedRow.fullname : ''}
              onChange={onChangeHandlerFullName}
            />
          </div>
          <div className="col-md-12">
            <label htmlFor="contact" className="form-label">
              Contact
            </label>
            <input
              type="text"
              className="form-control"
              id="contact"
              placeholder="Enter Contact"
              required
              value={selectedRow ? selectedRow.contact : ''}
              onChange={onChangeHandlerContact}
            />
          </div>
          <div className="col-md-12">
            <div className="input-group mb-3">
              <input
                type="file"
                className="form-control"
                id="profile-image"
                onChange={handleImage}
                required
              />
              <span className="input-text p-0 px-2">
                <FaUpload className="m-2" />
                Profile Picture
              </span>
            </div>
          </div>
          <div className="col-md-12 my-4">
            <button
              // type="submit"
              // onClick={onEditHandler}
              className="col-3 btn btn-secondary mx-1 "
            >
              Edit Profile
            </button>
            {/* <button
              className="col-3 btn btn-outline-secondary mx-1"
              onClick={deleteData}
            >
              Delete Task
            </button> */}

            <button
              className="col-3 btn btn-outline-danger mx-1 px-4"
              onClick={() => setShowEdit(false)}
            >
              close
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Profile;
