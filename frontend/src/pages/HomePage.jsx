import React from 'react'
import { useEffect } from 'react';
import toast from 'react-hot-toast'

function HomePage() {
    //fetch some data-without using tanstack
    const [book,setBooks]=useState([])
    const [isLoading,setIsLoading]=useState(true);
    const [error,setError]=useState(null);

    useEffect(()=>{
        const getBooks=async()=>{
            setIsLoading(true)
            try{
            const res=await fetch("/api/books")
            const data=await res.json();
            setBooks(data);
            }
            catch(error){
                setError(error);
            }
            finally{
                setIsLoading(false);
            }


        }
        //refetch
        //when you focus on the window it fetches data immedately again
        getBooks();

    },[])





  return (
    <button className='btn btn-secondary' onClick={()=>toast.success("This is a success toast")}>Click Me</button>
  )
}

export default HomePage