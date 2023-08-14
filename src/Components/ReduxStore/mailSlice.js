import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  InboxEmails: [],
  SentEmails: [],
  currEmail: null
};

const mailSlice = createSlice({
  name: "mail",
  initialState,
  reducers: {
    InboxAdd(state, action) {
      const id = action.payload.id;
      const newEmail = action.payload.email;
      const exsistingEmail = state.InboxEmails.find((email) => email.id === id);
      const exsistingEmails = state.InboxEmails;

      if (!exsistingEmail) {
        const updatedEmails = [{ ...newEmail, id: id }, ...exsistingEmails];
        state.InboxEmails = updatedEmails;
      }
    },

    InboxRemove(state, action) {
      const idToDelete = action.payload;
      state.InboxEmails = state.InboxEmails.filter(
        (email) => email.id !== idToDelete
      );
    },

    SetCurrentEmail(state, action) {
      state.currEmail = action.payload.email;
    },

    RemoveCurrentEmail(state) {
      state.currEmail = null;
    },
    Sent: (state, action) => {
      // state.emails.push(action.payload);
      const { id, email } = action.payload;
      const existingEmail = state.SentEmails.find((email) => email.id === id);
      const existingEmails = state.SentEmails;

      if (!existingEmail) {
        const updatedEmails = [{ ...email, id: id }, ...existingEmails];
        state.SentEmails = updatedEmails;
      }
    },
    MarkAsRead(state, action) {
      const { id } = action.payload;
      const email = state.InboxEmails.find((email) => email.id === id);
      if (email) {
        email.read = true;
      }
    }
  }
});

export const mailActions = mailSlice.actions;

export default mailSlice.reducer;
