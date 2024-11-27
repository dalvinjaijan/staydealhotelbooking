import { useLoadScript ,LoadScriptProps } from "@react-google-maps/api";
import React, { createContext, useState,ReactNode } from 'react'


const libraries = ['places']  as LoadScriptProps['libraries'];

export const PlacesContext=createContext<boolean>(false)

interface PlacesContextProviderProps {
  children: ReactNode;
}
function PlacesContextFunction({children}:PlacesContextProviderProps){

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY?import.meta.env.VITE_GOOGLE_API_KEY:"",
        libraries
      });
      console.log('isloaded',isLoaded);
      const [placesIsLoaded,setPlacesIsLoaded] = useState(isLoaded)
      
      return (
        <PlacesContext.Provider value={isLoaded}>
            {children}
        </PlacesContext.Provider>
      )
    
}
export default PlacesContextFunction