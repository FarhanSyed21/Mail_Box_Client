import React, { Fragment, useState } from 'react'
import { Card, Container, Form, Button } from 'react-bootstrap'
import NavBar from '../Navbar/NavBar'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom'


const SignUp = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("PASSWORD_NOT_MATCH", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            return;
        }
        
        fetch("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCrHf6mBaugVBBp3iRU03PWKO624o9NFQQ",{
            method: "POST",
            body: JSON.stringify({
                email: email,
                password: password,
                returnSecureToken: true
            })
        }).then((res) => {
            if(res.ok){
                navigate('/')
                return res.json();
            }else{
                return res.json().then((data) => {
                    throw new Error(data.error.message);
                })
            }
        }).then((data) => {
            toast.success('Your new account is created', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }).catch((err) => {
            toast.error(err.message, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        })
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    }

  return (
    <Fragment>
        <NavBar />
        <Container className="mt-5 d-flex justify-content-center align-items-center">
            <Card>
                <Card.Header style={{backgroundColor: '#0B5ED7', color:"white"}}>
                    <h3>Sign Up</h3>
                </Card.Header>
                <Card.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" required/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPasswordConfirm">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" required/>
                        </Form.Group>

                        <Button variant="primary" type="submit" onClick={handleSubmit} style={{borderRadius:30, width:250 }}>
                            SignUp
                        </Button>
                    </Form>
                </Card.Body>
                <Card.Footer style={{backgroundColor: '#D1FFBD'}}>
                    Already have an account?<a href='/'> Login </a>
                </Card.Footer>
            </Card>
        </Container>
        <ToastContainer />
    </Fragment>
  )
}

export default SignUp