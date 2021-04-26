import React, { useState } from "react";
import {
    FormText,
    FormGroup,
    FormControl,
    FormLabel
  } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { useAppContext } from "../libs/contextLib";
import { useFormFields } from "../libs/hooksLib";
import { useHistory } from "react-router-dom";
import { onError } from "../libs/errorLib";
import { Auth } from "aws-amplify";
import "./Signup.css";

export default function Signup() {
  const { userHasAuthenticated } = useAppContext();
  const [newUser, setNewUser] = useState(null);
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
    confirmPassword: "",
    confirmationCode: "",
  });

  function validateForm() {
    return (
        fields.email.length > 0 &&
        fields.password.length > 0 &&
        fields.password === fields.confirmPassword
    );
  }

  function validateConfirmationForm() {
    return fields.confirmationCode.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      const newUser = await Auth.signUp({
        username: fields.email,
        password: fields.password,
      });
      setIsLoading(false);
      setNewUser(newUser);
    } catch (e) {
        if(e.name == 'UsernameExistsException'){
            // resend code if user has not been confirmed
            // cant figure out how to check if user is confirmed
            try{
                // will this sign them in if the password is right?
                // yes it will, just go with it
                await Auth.signIn(fields.email, fields.password);
                await Auth.signOut(); // if user successfully signs in
                onError("Account Already Exists (Proceed to Login)");
                userHasAuthenticated(false);
            } catch (e2){
                if(e2.name == 'UserNotConfirmedException'){ // resends if user not confirmed!
                    const test = await Auth.resendSignUp(fields.email);
                    setNewUser(test);
                } else {
                    onError("Account Already Exists");
                    userHasAuthenticated(false);
                }
            }
        } else {
            onError(e);
        }

      setIsLoading(false);
    }
  }

  async function handleConfirmationSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      await Auth.confirmSignUp(fields.email, fields.confirmationCode);
      await Auth.signIn(fields.email, fields.password);

      userHasAuthenticated(true);
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function renderConfirmationForm() {
    return (
      <form onSubmit={handleConfirmationSubmit}>
        <FormGroup controlId="confirmationCode" bsSize="large">
          <FormLabel>Confirmation Code</FormLabel>
          <FormControl
            autoFocus
            type="tel"
            onChange={handleFieldChange}
            value={fields.confirmationCode}
          />
          <FormText>Please check your email for the code.</FormText>
        </FormGroup>
        <LoaderButton
            block
            size="lg"
            type="submit"
            isLoading={isLoading}
            disabled={!validateConfirmationForm()}
            >
            Verify
        </LoaderButton>
      </form>
    );
  }

  function renderForm() {
    return (
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="email" bsSize="large">
          <FormLabel>Email</FormLabel>
          <FormControl
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <FormLabel>Password</FormLabel>
          <FormControl
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <FormGroup controlId="confirmPassword" bsSize="large">
          <FormLabel>Confirm Password</FormLabel>
          <FormControl
            type="password"
            onChange={handleFieldChange}
            value={fields.confirmPassword}
          />
        </FormGroup>
        <LoaderButton
            block
            size="lg"
            type="submit"
            isLoading={isLoading}
            disabled={!validateForm()}
            >
            Signup
        </LoaderButton>
      </form>
    );
  }


  return (
    <div className="Signup">
      {newUser === null ? renderForm() : renderConfirmationForm()}
    </div>
  );
}