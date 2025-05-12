/*import React from "react";
import { Post } from "../types";

type HomePageProps = {
  posts: Post[];
  searchQuery?: string;
};

type HomePageState = {};*/

import React from "react";

// Define the component with explicit return type
const HomePage: React.FC<{}> = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the home page!</p>
    </div>
  );
};

export default HomePage;
