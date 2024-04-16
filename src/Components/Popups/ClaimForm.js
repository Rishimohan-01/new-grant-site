import { Formik, Form, Field, useField } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import app from "../../firebase";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getCookie, setCookie } from "../../functions/cookie";
import * as Yup from "yup";
import uploadIcon from "../../assets/images/upload-icon.png";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

const FileUpload = ({ fileRef, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div>
      <label htmlFor="files">Choose files</label>{" "}
      <input
        ref={fileRef}
        type="file"
        {...field}
        accept="image/jpeg, image/jpg, image/png"
        capture="environment"
        // onChange={(e) => {
        //   let fileName = e.target.files[0].name;
        //   console.log(e.target.files[0]);
        //   props.setfile(fileName.substring(fileName.lastIndexOf("\\") + 1));
        //   console.log(e.target.files[0]);
        // }}
        required
      />
      {/* {meta.touched && meta.error ? (
        <div style={{ color: "red" }}>{meta.error}</div>
      ) : null} */}
    </div>
  );
};

function ClaimForm(props) {
  const db = getFirestore(app);
  const location = getCookie("location");
  const prize = getCookie("prize");
  const outlet = getCookie("outlet");
  const prizeType = getCookie("prize_type");
  const fileRef = useRef(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [bill, setBill] = useState();
  const [billURL, setBillURL] = useState("");
  const [disableSubmitBtn, setDisableSubmitBtn] = useState(false);

  useEffect(() => {
    console.log(db);
  }, []);

  const confirmSubmission = () => {
    setCookie("screen", "confirmation", 1);
    props.updatePopup({ display: true, type: "confirmation" });
  };

  useEffect(() => {
    console.log(billURL);
  }, [billURL]);

  const handleInputChange = (e) => {
    let inputName = e.target.name;
    switch (inputName) {
      case "name":
        setName(e.target.value);
        break;
      case "email":
        setEmail(e.target.value);
        break;
      case "address":
        setAddress(e.target.value);
        break;
      case "bill":
        setBill(e.target.files[0]);
        break;
      default:
        return;
    }
  };

  const storeBill = async () => {
    const storage = getStorage();
    const date = new Date();
    const fileName = date.getTime();
    const storageRef = ref(storage, "bills/" + fileName);
    const uploadTask = await uploadBytesResumable(storageRef, bill);

    // uploadTask.then(())
    // uploadTask.on("state_changed", async () => {
    //   // Upload completed successfully, now we can get the download URL
    //   getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //     setBillURL(downloadURL);
    //   });
    // });
    return uploadTask;
  };

  const submitDataWithBill = async (downloadURL) => {
    const date = new Date();
    let dateInMilliSeconds = date.getTime();
    let postData = {
      name: name,
      email: email,
      date: date,
      delivery_status: "NA",
      location: location,
      outlet_name: outlet,
      prize: prize,
      bill: downloadURL,
      prize_type: prizeType,
      address: "NA",
    };
    await setDoc(doc(db, "customers", dateInMilliSeconds.toString()), postData);
    confirmSubmission();
  };

  const submitForm = async (e) => {
    e.preventDefault();
    console.log("Submit button clicked");
    setDisableSubmitBtn(true);
    if (prizeType === "drink") {
      storeBill()
        .then(async (res) => {
          console.log(res);
          let downloadURL = await getDownloadURL(res.ref).then(
            (downloadURL) => {
              return downloadURL;
            }
          );
          submitDataWithBill(downloadURL);
        })
        .catch((err) => {
          alert("An error occured submitting the form. Please try again");
          setDisableSubmitBtn(false);
        });
    } else {
      const date = new Date();
      let dateInMilliSeconds = date.getTime();
      let postData = {
        name: name,
        email: email,
        date: date,
        delivery_status: "undelivered",
        location: location,
        outlet_name: outlet,
        prize: prize,
        bill: "NA",
        prize_type: prizeType,
        address: address,
      };
      await setDoc(
        doc(db, "customers", dateInMilliSeconds.toString()),
        postData
      );
      confirmSubmission();
    }
    // setDisableSubmitBtn(false);
  };

  useEffect(() => {
    console.log(disableSubmitBtn);
  }, [disableSubmitBtn]);

  return (
    <Container className="claim-form">
      <Row>
        <Col>
          <h2 className="claimform-heading">
            Unlock the offer by entering your information
          </h2>

          <form>
            {prizeType === "drink" ? (
              <div className="file-upload-wrapper">
                <div className="file-upload">
                  <div>
                    {bill === undefined ? (
                      <>
                        <img src={uploadIcon} alt="" />
                        <p>Upload the Bill</p>
                      </>
                    ) : (
                      <p>{bill.name}</p>
                    )}
                  </div>
                </div>
                <input
                  type="file"
                  name="bill"
                  className="input-file"
                  onChange={(e) => handleInputChange(e)}
                  required
                />
              </div>
            ) : (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  className="textbox"
                  value={name}
                  onChange={(e) => handleInputChange(e)}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="textbox"
                  value={email}
                  onChange={(e) => handleInputChange(e)}
                  required
                />
                <textarea
                  type="text"
                  name="address"
                  placeholder="Address"
                  className="textbox"
                  value={address}
                  onChange={(e) => handleInputChange(e)}
                  required
                />
              </>
            )}

            <div className="button-container">
              <button
                type="button"
                disabled={disableSubmitBtn}
                onClick={(e) => submitForm(e)}
              >
                Claim the Offer
              </button>
            </div>
          </form>
        </Col>
      </Row>
    </Container>
  );
}

export default ClaimForm;
