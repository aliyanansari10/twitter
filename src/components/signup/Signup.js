import React, { useState } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import {
  getStorage,
  ref as newref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
// import { storage } from '../../Firebase';

import { Link } from 'react-router-dom';
import {
  FaUserAlt,
  FaUserCircle,
  FaPhoneAlt,
  FaEnvelope,
  FaUpload,
} from 'react-icons/fa';
import SideImage from './../../images/signup.jpg';
import './signup.css';
function Signup() {
  // ---------------- Initialize Auth and DB ---------------
  const auth = getAuth();
  const db = getDatabase();
  const storage = getStorage();
  const [Image, setImage] = useState();
  // const [imageUrl, setImageUrl] = useState('');
  // let imageUrl = '';

  // ------------------- Handle Upload Image ---------------------
  // let imageUrl = '';
  const handleProfile = (e) => {
    setImage(e.target.files[0]);
    return 1;
  };

  // --------- Storing Image -----------
  // async function handleImage(newuserid) {
  //   return 1;
  // }

  // ---------- Creating User ---------------

  const handleSignup = (e) => {
    e.preventDefault();
    // ------------- Get Image From Input -------------

    // ----------- Getting Input and Password Field ------------
    const email = document.getElementById('email-address').value;
    const password = document.getElementById('password').value;
    const fullname = document.getElementById('full-name').value;
    const username = document.getElementById('user-name').value;
    const contact = document.getElementById('contact').value;

    // ----------- Regex ----------
    let regexemail =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;
    let regexpassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
    if (regexemail.test(email)) {
      if (regexpassword.test(password)) {
        // ------------------- Checking password and confirm password matches ----------

        let confirmPassword = document.getElementById('confirm-password').value;
        if (password === confirmPassword) {
          //  -------- Sign up With email and password
          createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              // Sign Up Successful
              const user = userCredential.user;
              // ----- Storing Image using User id ------
              const storageRef = newref(
                storage,
                'profile/' + user.uid + '.jpg'
              );
              uploadBytes(storageRef, Image).then((snapshot) => {
                getDownloadURL(storageRef).then((downloadURL) => {
                  // Storing Data in Realtime Database
                  set(ref(db, 'users/' + user.uid), {
                    fullname: fullname,
                    email: email,
                    contact: contact,
                    username: username,
                    imageUrl: downloadURL,
                    followers: [''],
                    following: [''],
                  });
                });
              });
              // console.log('Function is called object store data');
              // document.getElementById('signup-form').reset();
              // console.log('Signing Out ...');
              console.log('User Signed Up Completed ', user);
              console.log('-------------- Now Logging Out ---------- ');
              signOut(auth)
                .then(() => {
                  localStorage.setItem('user', null);
                  console.log('Sign Out Successful --- Loging Out -----');
                })
                .catch((error) => {
                  // An error happened.
                });
            })
            .catch((error) => {
              // ---------- Error on Sign up
              const errorCode = error.code;
              const errorMessage = error.message;
              console.log('Can not sign in catch error : ', errorCode);
              <div
                class="alert alert-danger alert-dismissible fade show"
                role="alert"
              >
                {errorMessage}
              </div>;
            });
        } else {
          <div
            class="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            Your Password Doesn't match kindly retype
          </div>;
        }
      } else {
        <div
          class="alert alert-warning alert-dismissible fade show"
          role="alert"
        >
          Only small and capital letters and numbers are allowed
        </div>;
      }
    } else {
      <div class="alert alert-warning alert-dismissible fade show" role="alert">
        Please Enter Email Address in correct format i.e. abc@xyz.com
      </div>;
    }
  };

  // ----------@@@@@@@@@--------- Comment Start ---------@@@@@@@-----------

  // // ------------------- Handle Upload Image ---------------------
  // // let imageUrl = '';
  // const handleProfile = (e) => {
  //   setImage(e.target.files[0]);
  //   return 1;
  // };

  // // const handleImage = () => {
  // function handleImage(newuserid) {
  //   // Creating reference for image

  //   setTimeout(() => {
  //     const storageRef = newref(storage, 'posts/' + newuserid + '.jpg');
  //     // console.log('New file name is: ', Image);
  //     // 'file' comes from the Blob or File API
  //     uploadBytes(storageRef, Image).then((snapshot) => {
  //       // console.log('Snap Shot is this: ', snapshot);
  //       getDownloadURL(storageRef).then((downloadURL) => {
  //         // console.log('File available at', downloadURL);
  //         imageUrl = downloadURL;
  //       });
  //     });
  //   }, 1000);
  // }

  // const handleSignup = (e) => {
  //   e.preventDefault();
  //   // ------------- Get Image From Input -------------

  //   // ----------- Getting Input and Password Field ------------
  //   const email = document.getElementById('email-address').value;
  //   const password = document.getElementById('password').value;
  //   const fullname = document.getElementById('full-name').value;
  //   const username = document.getElementById('user-name').value;
  //   const contact = document.getElementById('contact').value;

  //   // ----------- Regex ----------
  //   let regexemail =
  //     /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;
  //   let regexpassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
  //   if (regexemail.test(email)) {
  //     if (regexpassword.test(password)) {
  //       // ------------------- Checking password and confirm password matches ----------

  //       let confirmPassword = document.getElementById('confirm-password').value;
  //       if (password === confirmPassword) {
  //         //  -------- Sign up With email and password

  //         createUserWithEmailAndPassword(auth, email, password)
  //           .then((userCredential) => {
  //             // Sign Up Successful
  //             const user = userCredential.user;
  //             // Storing Data in Realtime Database
  //             // setUserId(user.uid);

  //             handleImage(user.uid);
  //             setTimeout(() => {
  //               set(ref(db, 'users/' + user.uid), {
  //                 fullname: fullname,
  //                 email: email,
  //                 contact: contact,
  //                 username: username,
  //                 imageUrl: imageUrl,
  //               });
  //               document.getElementById('signup-form').reset();
  //               console.log('Signing Out ...');
  //               signOut(auth)
  //                 .then(() => {
  //                   console.log('Sign Out Successful --- Loging Out -----');
  //                 })
  //                 .catch((error) => {
  //                   // An error happened.
  //                 });
  //             }, 8000);
  //             console.log('User Signed Up as: ', user);
  //           })
  //           .catch((error) => {
  //             // ---------- Error on Sign up
  //             const errorCode = error.code;
  //             const errorMessage = error.message;
  //             console.log('Can not sign in catch error : ', errorCode);
  //             <div
  //               class="alert alert-danger alert-dismissible fade show"
  //               role="alert"
  //             >
  //               {errorMessage}
  //             </div>;
  //           });
  //       } else {
  //         <div
  //           class="alert alert-danger alert-dismissible fade show"
  //           role="alert"
  //         >
  //           Your Password Doesn't match kindly retype
  //         </div>;
  //       }
  //     } else {
  //       <div
  //         class="alert alert-warning alert-dismissible fade show"
  //         role="alert"
  //       >
  //         Only small and capital letters and numbers are allowed
  //       </div>;
  //     }
  //   } else {
  //     <div class="alert alert-warning alert-dismissible fade show" role="alert">
  //       Please Enter Email Address in correct format i.e. abc@xyz.com
  //     </div>;
  //   }
  // };

  // -----------@@@@@@@@@@---- Comment End ------@@@@@@@@@@------------

  return (
    <>
      <section className="signup">
        <div className="container ">
          <div className="signup-content row">
            <div className="col-md-6 my-5">
              <h2>twitter</h2>
              <h5>Connect with People</h5>
              <div className="side-image">
                <img src={SideImage} alt="twitter pic" />
              </div>
            </div>
            <div className="signup-form col-md-6 shadow-lg my-5">
              <h2 className="my-2 sign-heading">Create User</h2>
              <form
                className="row g-3"
                id="signup-form"
                onSubmit={handleSignup}
              >
                {/*  ------------------- Full Name -------------  */}
                <div className="input-group mb-2 ">
                  <span className="m-1 mx-2">
                    <FaUserAlt />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    id="full-name"
                    placeholder="Full Name ..."
                    required
                  />
                </div>
                {/* -------------- Username And Contact -------------- */}
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="m-1 mx-2">
                      <FaUserCircle />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      id="user-name"
                      placeholder="User Name ..."
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="m-1 mx-2">
                      <FaPhoneAlt />
                    </span>
                    <input
                      type="number"
                      className="form-control"
                      id="contact"
                      placeholder="Contact No..."
                      required
                    />
                  </div>
                </div>

                {/* ------------- Email Address ---------------  */}

                <div className="col-md-12">
                  <div className="col-md-12">
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaEnvelope />
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        id="email-address"
                        placeholder="Enter E-mail Address"
                        required
                      />
                    </div>
                  </div>
                </div>
                {/* --------------- Password -----------------  */}
                <div className="col-md-6">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="* * * * * * * *"
                    required
                  />
                </div>
                {/* ---------------- Confirm Password ------------------ */}
                <div className="col-md-6">
                  <label htmlFor="confirm-password" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirm-password"
                    placeholder="* * * * * * * *"
                    required
                  />
                </div>

                {/* -----------Upload Image & Terms and Condition Check Box ----------------- */}

                <div className="col-12">
                  <div className="input-group mb-3">
                    <input
                      type="file"
                      className="form-control"
                      id="profile-image"
                      onChange={handleProfile}
                      required
                    />
                    <span className="input-text p-0 px-2">
                      <FaUpload className="m-2" />
                      Profile Picture
                    </span>
                  </div>
                  <div className="form-check">
                    <div className="t-and-C">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="terms-and-condition"
                        required
                      />
                      <span className="input-group p-0 px-2">
                        Agree to terms and conditions
                      </span>
                    </div>
                  </div>
                </div>

                {/* -------------- Submit Button -------------- */}

                <div className="col-12 sub-btn">
                  <button
                    className="btn btn-lg btn-info px-5"
                    type="submit"
                    // onClick={handleImage}
                    // onSubmit={submitData}
                  >
                    Sign Up
                  </button>
                  <span className="my-2 px-4 mx-3 text-right d-block">
                    <Link to="/" className="link">
                      Go to Login
                    </Link>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Signup;
