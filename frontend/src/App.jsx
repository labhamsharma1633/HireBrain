
import { SignedOut, SignIn, SignInButton, SignOutButton, UserButton, useUser } from '@clerk/clerk-react'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import { Route, Routes,Navigate } from 'react-router';
import { Toaster } from 'react-hot-toast';

function App() {

  const {isSignedIn}=useUser();



  

  return (
    <>
    <Routes>
      
      <Route path="/" element={<HomePage/>}/>
      
      <Route path="/problems" element={isSignedIn?<ProblemsPage/>: <Navigate to={"/"}/>}/>


      
    
    </Routes>
    <Toaster toastOptions={{duration:3000}}/>
    </>
  )
}

export default App



// tw ,daisyui react-router react-hot-toast