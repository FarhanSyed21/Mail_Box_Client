import React from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { MdDeleteForever } from "react-icons/md";
import NavBar from "../Navbar/NavBar";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./ComposeMail.css";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

const ComposeMail = () => {
  const emailHeWantToSendRef = useRef();
  const subjectRef = useRef();
  const descRef = useRef();

  const email = useSelector((state) => state.auth.email);
  const navigate = useNavigate();

  const handleSendEmail = async (e) => {
    e.preventDefault();

    const To = emailHeWantToSendRef.current.value;
    const subject = subjectRef.current.value;
    const desc = descRef.current.value;
    const replaceEmail = email.replace(/[@.]/g, "");

    const emailDetails = {
      sender: email,
      emailHeWantToSend: To,
      subject: subject,
      desc: desc,
      read: false
    };
    const ToEmail = To.replace(/[@.]/g, "");
    try {
      const response1 = await fetch(
        `https://api-calls-70500-default-rtdb.firebaseio.com/mails/${replaceEmail}/sentEmails.json`,
        {
          method: "POST",
          body: JSON.stringify(emailDetails),
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      const response2 = await fetch(
        `https://api-calls-70500-default-rtdb.firebaseio.com/mails/${ToEmail}/inboxEmails.json`,
        {
          method: "POST",
          body: JSON.stringify(emailDetails),
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      let data1 = await response1.json();
      let data2 = await response2.json();

      if (response1.ok && response2.ok) {
        emailHeWantToSendRef.current.value = null;
        subjectRef.current.value = null;
        descRef.current.value = null;
        toast.success("Successfully sent the mail.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored"
        });
      } else {
        throw new Error(data1.error.message, data2.error.message);
      }
    } catch (err) {
      toast.error(err.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored"
      });
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    navigate("/home");
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      ["formula"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { align: [] },
        { indent: "-1" },
        { indent: "+1" },
        { list: "ordered" }
      ],
      ["link", "image", "video"],
      ["clean"],
      [{ color: [] }, { background: [] }]
    ]
  };

  return (
    <div>
      <NavBar />
      <form className="p-5">
        <div>
          <InputGroup>
            <InputGroup.Text id="inputGroup-sizing-default">To</InputGroup.Text>
            <Form.Control
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              type="email"
              className="recipient-input"
              ref={emailHeWantToSendRef}
            />
          </InputGroup>
        </div>
        <hr />
        <div>
          <InputGroup>
            <Form.Control
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              placeholder="Subject"
              ref={subjectRef}
            />
          </InputGroup>
        </div>
        <hr />
        <div>
          <ReactQuill
            className="editor-input"
            theme="snow"
            modules={modules}
            ref={descRef}
          />
        </div>
        <hr />
        <br />
        <div className="Btn">
          <div>
            <Button onClick={handleSendEmail}>Send</Button>
          </div>
          <div>
            <Button variant="danger" onClick={handleDelete}>
              <MdDeleteForever />
            </Button>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ComposeMail;
