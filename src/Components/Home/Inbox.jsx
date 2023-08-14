import React, { Fragment, useEffect, useState } from "react";
import { Col, Container, Row, Nav, Button } from "react-bootstrap";
import NavBar from "../Navbar/NavBar";
import "./Inbox.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiFillDelete } from "react-icons/ai";
import { FaInbox } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { mailActions } from "../ReduxStore/mailSlice";

const Inbox = () => {
  const [selectedFolder, setSelectedFolder] = useState("inbox");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const Email = useSelector((state) => state.auth.email).replace(/[@.]/g, "");
  const inboxEmails = useSelector((state) => state.mail.InboxEmails);
  const sentEmails = useSelector((state) => state.mail.SentEmails);
  const unreadCount = inboxEmails.filter((email) => !email.read).length;

  const displayedEmails =
    selectedFolder === "inbox"
      ? inboxEmails
      : selectedFolder === "sent"
      ? sentEmails
      : [];

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `https://api-calls-70500-default-rtdb.firebaseio.com/mails/${Email}/inboxEmails.json`,
        {
          method: "GET"
        }
      );
      let data = await response.json();
      if (data === null) {
        return;
      } else {
        const idsArray = Object.keys(data);
        const emailsArray = Object.values(data);

        for (let i = 0; i < idsArray.length; i++) {
          dispatch(
            mailActions.InboxAdd({ id: idsArray[i], email: emailsArray[i] })
          );
        }
      }
    };
    fetchData();
  });

  useEffect(() => {
    const fetchSentEmails = async () => {
      const response = await fetch(
        `https://api-calls-70500-default-rtdb.firebaseio.com/mails/${Email}/sentEmails.json`,
        {
          method: "GET"
        }
      );
      let data = await response.json();
      if (data === null) {
        return;
      } else {
        const idsArray = Object.keys(data);
        const emailsArray = Object.values(data);

        for (let i = 0; i < idsArray.length; i++) {
          dispatch(
            mailActions.Sent({ id: idsArray[i], email: emailsArray[i] })
          );
        }
      }
    };
    fetchSentEmails();
  }, [dispatch, Email]);

  const updateEmail = async (email) => {
    const updatedEmail = {
      sender: email.sender,
      emailHeWantToSend: email.emailHeWantToSend,
      subject: email.subject,
      desc: email.desc,
      read: true
    };

    if (!email.read) {
      try {
        let response = await fetch(
          `https://api-calls-70500-default-rtdb.firebaseio.com/mails/${Email}/inboxEmails/${email.id}.json`,
          {
            method: "PUT",
            body: JSON.stringify(updatedEmail),
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
        let data = await response.json();
        if (response.ok) {
          dispatch(mailActions.MarkAsRead({ id: email.id }));
          navigate("/details");
        } else {
          throw new Error(data.error.message);
        }
      } catch (error) {
        toast.error(error.message, {
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
    }
    dispatch(mailActions.SetCurrentEmail({ email: updatedEmail }));
    navigate("/details");
  };

  const readedEmail = () => {
    dispatch(mailActions.SetCurrentEmail());
    navigate("/details");
  };

  const handleClick = () => {
    navigate("/compose");
  };

  const handleDelete = async (emailId) => {
    try {
      const response = await fetch(
        `https://api-calls-70500-default-rtdb.firebaseio.com/mails/${Email}/inboxEmails/${emailId}.json`,
        {
          method: "DELETE"
        }
      );

      if (response.ok) {
        dispatch(mailActions.InboxRemove(emailId));
        toast.success("Email deleted successfully", {
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
        throw new Error("Failed to delete email");
      }
    } catch (error) {
      toast.error(error.message, {
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

  return (
    <Fragment>
      <NavBar />
      <Container fluid>
        <Row>
          <Col md={2} className="folder-list">
            <Nav className="flex-column">
              <Button className="mb-3 mt-3" onClick={handleClick}>
                Compose
              </Button>
              <Nav.Link
                onClick={() => setSelectedFolder("inbox")}
                className={selectedFolder === "inbox" ? "active" : ""}
              >
                <div className="inbox-link">
                  <span className="inbox-label">Inbox</span>
                  <span className="unread-count">Unread {unreadCount}</span>
                </div>
              </Nav.Link>
              <Nav.Link
                onClick={() => setSelectedFolder("sent")}
                className={selectedFolder === "sent" ? "active" : ""}
              >
                Sent
              </Nav.Link>
            </Nav>
          </Col>
          <Col md={10} className="mail-view ">
            {displayedEmails.length === 0 ? (
              <div className="empty-inbox">
                <div className="empty-icon">
                  <FaInbox />
                </div>
                <p className="empty-message">
                  You don't have any mail in this folder.
                </p>
              </div>
            ) : (
              <ul>
                {displayedEmails.map((email) => {
                  return (
                    <li
                      className={
                        email.read ? "read mail-item" : "Unread mail-item"
                      }
                      key={email.id}
                    >
                      <div className="checkbox">
                        {email.read ? null : <span className="dot" />}
                      </div>
                      <div className="details">
                        <div className="sender">{email.sender}</div>
                      </div>
                      <div className="snippet">
                        <h3
                          className={email.read ? "ReadedSub sub" : "sub"}
                          onClick={() => updateEmail(email)}
                        >
                          {email.subject}
                        </h3>
                      </div>
                      <div className="delete-button">
                        <Button
                          variant="warning"
                          className="delete-button"
                          onClick={() => handleDelete(email.id)}
                        >
                          <AiFillDelete />
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Col>
        </Row>
      </Container>
      <ToastContainer />
    </Fragment>
  );
};

export default Inbox;
