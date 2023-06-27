import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Registration from './components/Registration';
import Login from './components/Login';
import { getUserNameWithJWT } from './app/userSlice';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [registrationLoginModal, setRegistrationLoginModal] = useState(false);
  const [isShowedRegistration, setIsShowedRegistration] = useState(false);
  const [isShowedLogin, setIsShowedLogin] = useState(false);

  useEffect(() => {
    dispatch(getUserNameWithJWT());
  }, [dispatch]);

  const toggleRegistrationLoginModal = () => {
    setRegistrationLoginModal(!registrationLoginModal);
  };

  const showRegistration = () => {
    setIsShowedRegistration(true);
    setIsShowedLogin(false);
  };

  const showLogin = () => {
    setIsShowedRegistration(false);
    setIsShowedLogin(true);
  };

  return (
    <div className="App">
      <h1>Card Game</h1>
      <Modal
        isOpen={registrationLoginModal || user.userName === ''}
        toggle={toggleRegistrationLoginModal}
        size="xl"
        backdrop="static"
        keyboard={false}
      >
        <ModalBody id="registrationLoginModalBody">
          <>
            <div>Be kell lépned, hogy játszhass a kártya játékkal.</div>
            <Button
              color="link"
              className="linkButton"
              onClick={() => {
                showRegistration();
              }}
            >
              Regisztáció
            </Button>{' '}
            <Button
              color="link"
              className="linkButton"
              onClick={() => {
                showLogin();
              }}
            >
              Belépés
            </Button>
          </>
          {isShowedRegistration ? <Registration /> : ''}
          {isShowedLogin ? <Login /> : ''}
        </ModalBody>
      </Modal>
    </div>
  );
}

export default App;
