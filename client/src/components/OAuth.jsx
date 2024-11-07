import { Button } from "react-bootstrap";
import { BsFacebook, BsGoogle } from "react-icons/bs";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

function OAuth() {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const resultFromGoogle = await signInWithPopup(auth, provider);
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: resultFromGoogle.user.displayName,
          email: resultFromGoogle.user.email,
          googlePhotoURL: resultFromGoogle.user.photoURL,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        dispatch(signInSuccess(data));
        navigate("/");
      } else {
        console.error("Failed to authenticate with the backend");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  return (
    <Button variant="outline-warning" onClick={handleGoogleClick}>
      <BsGoogle size={18} /> Continue with Google
    </Button>
  );
}

export default OAuth;
