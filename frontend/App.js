/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';


//**********Import the screens here********
import ReactNativeHome from './screens/ReactNativeHome';
import HelloWorld from './screens/HelloWorld';


//App function that will be what is rendered to phone
const App = () =>{ 

  //return which screen you want to see rendered********

  //return <ReactNativeHome />;
  return <HelloWorld />
};


export default App;
