import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Alert from './../alert/Alert';
import SideImage from './../../images/signup.jpg';
// import // getDatabase,
// ref,
// push,
// set,
// remove,
// onValue,
// 'firebase/database';
import './login.css';
// import { useState } from 'react';

function Login() {
  let navigate = useNavigate();
  const auth = getAuth();
  const [alert, setAlert] = useState(null);
  // const db = getDatabase();

  // ------------ Display Alert -----------
  // ----------------- setting alert ------------
  const showAlert = (message, type) => {
    setAlert({
      message: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();

    let testmail = document.getElementById('email-address').value;
    let regexmail =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;
    if (regexmail.test(testmail)) {
      let testpass = document.getElementById('password').value;
      let regexpass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
      if (regexpass.test(testpass)) {
        signInWithEmailAndPassword(auth, testmail, testpass)
          .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            // console.log('User Signed in: ', user);
            // browserHistory.push('/content');
            // <Redirect to="/login" />;
            localStorage.setItem('user', user.uid);
            navigate('/home', { replace: true });
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(
              'Error in Signin',
              errorCode,
              'Error Message: ',
              errorMessage
            );
          });
        document.getElementById('login-form').reset();
      } else {
        showAlert('Please Enter Password in Correct Format', 'warning');
        // <div class="alert alert-warning" role="alert">
        //   Please Enter Password in Correct Format
        // </div>;
      }
      // console.log(regexpass.test(testpass));
    } else {
      showAlert('Please Enter Correct Email Address', 'warning');
      // <div class="alert alert-warning" role="alert">
      //   Please Enter Correct Email Address
      // </div>;
    }
  };
  return (
    <section className="login">
      <div className="container ">
        <Alert alert={alert} />
        <div className="login-content row">
          <div className="col-md-6 my-5">
            <h2>twitter</h2>
            <h5>Connect with People</h5>
            <div className="side-image">
              <img src={SideImage} alt="twitter pic" />
            </div>
          </div>
          <div className="login-form col-md-6 shadow-lg my-5">
            <h2 className="my-2 login-heading">Sign In User</h2>
            <form
              className="row g-3 my-4"
              id="login-form"
              onSubmit={onSubmitHandler}
            >
              {/* ------------- Email Address ---------------  */}

              <div className="col-md-12">
                <div className="col-md-12">
                  <div className="input-group">
                    <label htmlFor="email-address" className="form-label m-2">
                      Username / E-mail:
                    </label>
                    <span className="input-group-text">
                      <FaEnvelope />
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      id="email-address"
                      placeholder="Enter Username or E-mail Address"
                      required
                    />
                  </div>
                </div>
              </div>
              {/* --------------- Password -----------------  */}
              <div className="col-md-12">
                <div className="input-group">
                  <label htmlFor="password" className="form-label m-2">
                    Password:
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="* * * * * * * *"
                    required
                  />
                </div>
              </div>

              {/* -------------- Login Button -------------- */}

              <div className="col-12 sub-btn">
                <button
                  className="btn btn-lg btn-info px-5"
                  type="submit"
                  //   onSubmit={submitData}
                >
                  Login
                </button>
                <span className="my-2 px-4 text-right d-block">
                  <Link to="/signup" className="link">
                    Go to Signup
                  </Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
export default Login;
