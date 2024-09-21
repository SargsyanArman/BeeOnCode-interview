import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { setUser } from "../../Store/Slices/UserSlices";

const prefix = "Sign up page";


export const handleGenderChange = (setGender) => (event) => {
  setGender(event.target.value);
};

export const handleDateOfBirthChange = (setDateOfBirth) => (event) => {
  setDateOfBirth(event.target.value);
};

export const handleSubmit =
  (handleRegister) =>
    async (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const email = data.get("email");
      const password = data.get("password");
      const firstName = data.get("firstName");
      const lastName = data.get("lastName");
      const gender = data.get("gender");
      const dateOfBirth = data.get("dateOfBirth");

      await handleRegister(
        email,
        password,
        firstName,
        lastName,
        gender,
        dateOfBirth,
      );

    };

export const handleRegister = async (
  auth,
  db,
  dispatch,
  navigate,
  t,
  email,
  password,
  firstName,
  lastName,
  gender,
  dateOfBirth,
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      id: user.uid,
      firstName,
      lastName,
      gender,
      dateOfBirth,
    });

    dispatch(
      setUser({
        email: user.email,
        id: user.uid,
        token: user.accessToken,
      }),
    );

    navigate("/");
  } catch (error) {
    console.error("Registration failed:", error);
    alert(t(`Failed`));
  }
};