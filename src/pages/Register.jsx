import React, { useState } from "react";
import Add from "../img/addAvatar.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      //Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      //Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            //Update profile
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            //create user on firestore
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            //create empty user chats on firestore
            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/");
          } catch (err) {
            console.log(err);
            setErr(true);
            setLoading(false);
          }
        });
      });
    } catch (err) {
      if (err.code === "auth/invalid-email") setErrMsg("Invalid Email");
      if (err.code === "auth/email-already-in-use")
        setErrMsg("Account Already Exist");
      if (err.code === "auth/weak-password")
        setErrMsg("Enter Password min 6 Character");
      setErr(true);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="wrapper">
        <section class="form signup">
          <header>MoMo Chat's</header>
          <form onSubmit={handleSubmit}>
            {err && <div className="error-text">{errMsg}</div>}

            <div class="field input">
              <label>Display Name</label>
              <input
                type="text"
                name="displayname"
                placeholder="Display name"
                required
              />
            </div>

            <div class="field input">
              <label>Email Address</label>
              <input
                type="text"
                name="email"
                placeholder="Enter your email"
                required
              />
            </div>
            <div class="field input">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter new password"
                required
              />
              <i class="fas fa-eye"></i>
            </div>
            <div class="field image">
              <label>Select Avatar</label>
              <input
                type="file"
                name="image"
                accept="image/x-png,image/gif,image/jpeg,image/jpg"
                required
              />
            </div>
            <div class="field button">
              <input
                type="submit"
                name="submit"
                value={loading ? "Loading please wait..." : "Continue to Chat"}
                disabled={loading ? true : false}
              />
            </div>
          </form>
          <div class="link">
            Already signed up? <Link to="/login">Login now</Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default Register;
