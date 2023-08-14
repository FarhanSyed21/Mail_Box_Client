import React from "react";
import { Button, Card } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { mailActions } from "../ReduxStore/mailSlice";
import HTMLReactParser from "html-react-parser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MailDetails = () => {
  const Email = useSelector((state) => state.mail.currEmail);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClose = () => {
    dispatch(mailActions.RemoveCurrentEmail());
    toast("Please reload the page to see changes", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light"
    });
    navigate("/home");
  };
  return (
    <div className="mail-details-container">
      <div className="mail-details-center">
        <Card className="mail-details-card shadow m-5">
          <Card.Header>
            <Button variant="outline-secondary" onClick={handleClose}>
              Back to Inbox
            </Button>
          </Card.Header>
          <Card.Body>
            <div className="mail-details-meta">
              <div className="d-flex justify-content-between mb-3">
                <div className="mail-details-meta-item">
                  <span className="mail-details-meta-label">
                    <strong>From:</strong>
                  </span>{" "}
                  {Email.sender}
                </div>
                <div className="mail-details-meta-item">
                  <span className="mail-details-meta-label">
                    <strong>To:</strong>
                  </span>{" "}
                  {Email.emailHeWantToSend}
                </div>
              </div>

              <div className="mail-details-meta-item mb-3">
                <strong>Subject:</strong> {Email.subject}
              </div>
            </div>
            <div className="mail-details-body">
              <strong>Message:</strong>
              {HTMLReactParser(Email.desc)}
            </div>
          </Card.Body>
        </Card>
      </div>
      <ToastContainer />
    </div>
  );
};

export default MailDetails;
