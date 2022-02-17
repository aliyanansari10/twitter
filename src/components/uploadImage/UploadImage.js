import React, { useState } from 'react';
import { app, storage } from './../../Firebase';
import 'firebase/storage';

function UploadImage() {
  // const storage = firebase.storage()
  const allInputs = { imgUrl: '' };
  const [imageAsFile, setImageAsFile] = useState('');
  const [imageAsUrl, setImageAsUrl] = useState(allInputs);
  const handleProfile = (e) => {
    const image = e.target.files[0];
    setImageAsFile((imageFile) => image);
  };

  const handleUpload = (e) => {
    e.preventDefault();

    if (imageAsFile === '') {
      console.error(`not an image, the image file is a ${typeof imageAsFile}`);
    }
    e.preventDefault();
    console.log('start of upload');
    // async magic goes here...
    if (imageAsFile === '') {
      console.error(`not an image, the image file is a ${typeof imageAsFile}`);
    }
    const uploadTask = storage
      .ref(`/images/${imageAsFile.name}`)
      .put(imageAsFile);
    //initiates the firebase side uploading
    uploadTask.on(
      'state_changed',
      (snapShot) => {
        //takes a snap shot of the process as it is happening
        console.log(snapShot);
      },
      (err) => {
        //catches the errors
        console.log(err);
      },
      () => {
        // gets the functions from storage refences the image storage in firebase by the children
        // gets the download url then sets the image from firebase as the value for the imgUrl key:
        storage
          .ref('images')
          .child(imageAsFile.name)
          .getDownloadURL()
          .then((fireBaseUrl) => {
            setImageAsUrl((prevObject) => ({
              ...prevObject,
              imgUrl: fireBaseUrl,
            }));
          });
      }
    );
  };
  return (
    <>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          className="form-control"
          id="profile-image"
          onChange={handleProfile}
          required
        />
        <input type="submit" value="submit" />
      </form>

      <h2>Image is here</h2>
      <img src={imageAsUrl.imgUrl} alt="Snap tag" />
    </>
  );
}
export default UploadImage;
