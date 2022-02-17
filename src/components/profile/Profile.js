import React, { useEffect, useState } from 'react';
// import { useEffect, useState } from 'react/cjs/react.development';
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

import { onValue, ref, getDatabase, set } from 'firebase/database';
import './profile.css';

function Profile() {
  const db = getDatabase();
  const storage = getStorage();
  const loggedInUser = localStorage.getItem('user');
  const [userProfile, setUserProfile] = useState();
  const [showEdit, setShowEdit] = useState();
  const [Image, setImage] = useState();
  const [selectedRow, setSelectedRow] = useState();

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
        set(ref(db, `users/${loggedInUser}/`), {
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
    onValue(ref(db, `users/${loggedInUser}`), (snapshot) => {
      setUserProfile(snapshot.val());
      setSelectedRow(snapshot.val());
      return 1;
    });
    // onValue(ref(db, `users/${loggedInUser}`))
    //   .then((snapshot) => {
    //     if (snapshot.exists()) {
    //       console.log('Data Available in rdb', snapshot.val());
    //       setUserProfile(snapshot.val());
    //       return 1;
    //     } else {
    //       console.log('No data available');
    //     }
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
  }
  // const data = 'sad';
  // ------------ Use Effect ---------------
  useEffect(() => {
    getData();
    console.log('Use Effect Trigerred -------');
    return 1;
  }, []);
  console.log('Profile Component in Twitter app', userProfile);
  // getData();
  return (
    <div className="profile container-fluid">
      <div className="row">
        <Sidebar
          fullName={userProfile?.fullname}
          userName={userProfile?.username}
          userImage={userProfile?.imageUrl}
        />
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
            <div className="edit-profile">
              <button
                className="btn custom-button"
                onClick={() => setShowEdit(true)}
              >
                Edit Profile
              </button>
            </div>
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
        <form
          className="row g-2"
          id="edit-task"
          // onSubmit={onEditHandler}
        >
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
              onClick={onEditHandler}
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
