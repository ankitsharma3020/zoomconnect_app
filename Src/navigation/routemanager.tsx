import React, { useState, useEffect } from 'react';

import Splash from '../../splash';
import { UserRoute } from './userroute';
import { GuestRoute } from './guestroute';

const RouteManager = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Simulate splash screen delay
    const timer = setTimeout(() => {
      setShowSplash(false);
      // TODO: Replace with your actual login check logic
      // setIsLoggedIn(checkLoginStatus());
    }, 3800);

    return () => clearTimeout(timer);
  }, []);

//   if (showSplash) {
//     return <Splash />;
//   }

  return isLoggedIn ? <UserRoute /> : <GuestRoute />
};

export default RouteManager;