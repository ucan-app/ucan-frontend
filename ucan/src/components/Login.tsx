type LoginProps = {};

type LoginState = {};

import React from 'react';

/*
type LoginProps = {};

type LoginState = {};
*/

// Define the component with explicit return type
const Login: React.FC<{}> = () => {
  return (
    <div>
      <h1>Login Page</h1>
    </div>
  );
};

export default Login;