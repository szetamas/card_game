import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userNameHasSpecialChars } from '../validationFuncs/userNameHasSpecialChars.js';
import { registrationWithUserName } from '../app/userSlice';
import {
  Alert,
  Button,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
} from 'reactstrap';

function Registration() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [userNameFeedback, setUserNameFeedback] = useState('');
  const [error, setError] = useState('');
  const [userForm, setUserForm] = useState({
    userName: '',
  });
  const [disabledButton, setDisabledButton] = useState(false);

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setDisabledButton(true);
    setError('');
    setUserNameFeedback('');
    if (
      userForm.userName.length < 2 ||
      userForm.userName.length > 30 ||
      userNameHasSpecialChars(userForm.userName)
    ) {
      setError('Hibás a form');
      setUserNameFeedback(
        'A felhasználónév 2-30 karakter hosszú legyen és csak betűket, számokat, kötőjelet, aláhúzást és pontot tartalmazhat!'
      );
      setDisabledButton(false);
      return -1;
    }
    await dispatch(registrationWithUserName(userForm.userName));
    setDisabledButton(false);
  };

  return (
    <Form
      method="post"
      onSubmit={(ev) => {
        handleSubmit(ev);
      }}
    >
      {/*form submit is handled by a function,
      but if somewhy react doesnt work properly,
      i dont wana send form with 'get' method*/}
      <h1>Regisztráció</h1>
      <h2>
        Válaszd ki a felhasználó neved és majd fogsz kapni egy privát
        azonosítót.
        <br />
        Megengedett karakterek: betűk, számok és: " - _ . : "
        <br />
        {/*TODO: may i wana generate a few avalaible username*/}
      </h2>
      <FormGroup>
        <Label for="userNameInput">Felhasználó név:</Label>
        <Input
          id="userNameInput"
          name="userNameInput"
          type="text"
          placeholder="A felhasználó neved 2-30 karakter hosszú legyen!"
          value={userForm.userName}
          onChange={(ev) => {
            setUserForm({ ...userForm, userName: ev.target.value });
          }}
          invalid={userNameFeedback !== ''}
        />
        <FormFeedback className="formFeedback">
          {userNameFeedback !== '' ? userNameFeedback : ''}
        </FormFeedback>
      </FormGroup>
      <Button type="submit" className="primaryButton" disabled={disabledButton}>
        Regisztrálok
      </Button>
      {error !== '' ? <Alert color="warning">{error}</Alert> : ''}
      {user.status !== '' ? <h2>{user.status}</h2> : ''}
    </Form>
  );
}

export default Registration;
