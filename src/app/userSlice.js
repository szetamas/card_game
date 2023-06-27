import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const getUserNameWithJWT = createAsyncThunk(
  'user/getUserNameWithJWT',
  async () => {
    return fetch('http://127.0.0.1:4000/api/userName/', {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          return res.json().then((error) => {
            throw new Error(error.error);
          });
        }
      })
      .then((data) => {
        return data;
      });
    //here could be one more error handling(if asyncThunk broke)
  }
);

export const registrationWithUserName = createAsyncThunk(
  'user/registrationWithUserName',
  async (userName) => {
    //TODO: may this url wana be a const
    return fetch('http://127.0.0.1:4000/api/registration/', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userName: userName }),
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          return res.json().then((error) => {
            throw new Error(error.error);
          });
        }
      })
      .then((data) => {
        return data;
      });
    //here could be one more error handling(if asyncThunk broke)
  }
);

export const loginWithPrivateID = createAsyncThunk(
  'user/loginWithPrivateID',
  async (userPrivateID) => {
    //TODO:may this url wana be a const
    return fetch('http://127.0.0.1:4000/api/login/', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userPrivateID: userPrivateID }),
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          return res.json().then((error) => {
            throw new Error(error.error);
          });
        }
      })
      .then((data) => {
        return data;
      });
    //here could be one more error handling(if asyncThunk broke)
  }
);

const defaultState = {
  userName: '',
  status: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState: defaultState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserNameWithJWT.fulfilled, (state, action) => {
      state.userName = action.payload.userName;
    });
    builder.addCase(getUserNameWithJWT.rejected, (state, action) => {
      state.status = 'Hiba: ' + action.error.message;
    });
    builder.addCase(getUserNameWithJWT.pending, (state, action) => {
      state.status = 'Loading...';
    });

    builder.addCase(registrationWithUserName.fulfilled, (state, action) => {
      state.status = 'Sikerült: ' + action.payload.succes;
      //may i wana write out the privateID with h1 or something
    });
    builder.addCase(registrationWithUserName.rejected, (state, action) => {
      state.status = 'Hiba: ' + action.error.message;
    });
    builder.addCase(registrationWithUserName.pending, (state, action) => {
      state.status = 'Loading...';
    });

    builder.addCase(loginWithPrivateID.fulfilled, (state, action) => {
      state.status = 'Sikerült: ' + action.payload.succes;
    });
    builder.addCase(loginWithPrivateID.rejected, (state, action) => {
      state.status = 'Hiba: ' + action.error.message;
    });
    builder.addCase(loginWithPrivateID.pending, (state, action) => {
      state.status = 'Loading...';
    });
  },
});

export default userSlice.reducer;
