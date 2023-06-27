import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loginWithPrivateID } from '../app/userSlice';
import {
  Alert,
  Button,
  Form,
  FormFeedback,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';

function Login() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [userPrivateIDForm, setUserPrivateIDForm] = useState('');
  const [userPrivateIDFeedback, setUserPrivateIDFeedback] = useState('');
  const [error, setError] = useState('');
  const [disabledButton, setDisabledButton] = useState(false);

  const handleSubmitPrivateIDForm = async (ev) => {
    ev.preventDefault();
    setDisabledButton(true);
    setError('');
    setUserPrivateIDFeedback('');
    if (userPrivateIDForm.length !== 30) {
      setError('Hibás a form');
      setUserPrivateIDFeedback('A privát azonosító 30 karakter hosszú legyen!');
      setDisabledButton(false);
      return -1;
    }

    await dispatch(loginWithPrivateID(userPrivateIDForm));
    setDisabledButton(false);
  };

  return (
    <Form
      method="post"
      onSubmit={(ev) => {
        handleSubmitPrivateIDForm(ev);
      }}
    >
      {/*form submit is handled by a function,
      but if somewhy react doesnt work properly,
      i dont wana send form with 'get' method*/}
      <h1>Belépés</h1>
      <h2>
        Add meg a 30 karakteres privát azonosítódat, amit a regisztrációkor
        kaptál!
      </h2>
      <FormGroup>
        <Label for="privateIDInput">Privát azonosító:</Label>
        <Input
          id="privateIDInput"
          name="privateIDInput"
          type="text"
          placeholder="Privát azonosító (30 karakter)"
          value={userPrivateIDForm}
          onChange={(ev) => {
            setUserPrivateIDForm(ev.target.value);
          }}
          invalid={userPrivateIDFeedback !== ''}
        />
        <FormFeedback className="formFeedback">
          {userPrivateIDFeedback !== '' ? userPrivateIDFeedback : ''}
        </FormFeedback>
      </FormGroup>
      <Button type="submit" className="primaryButton" disabled={disabledButton}>
        Belépés
      </Button>
      {error !== '' ? <Alert color="warning">{error}</Alert> : ''}
      {user.status !== '' ? <h2>{user.status}</h2> : ''}
    </Form>
  );
}

export default Login;
