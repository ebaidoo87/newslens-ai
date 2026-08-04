import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import { useSearchParams } from "react-router-dom";


interface CategoryContextType {

  category: string;

  setCategory:
    (
      value: string
    ) => void;

}


const CategoryContext =
  createContext<
    CategoryContextType | undefined
  >(undefined);



export function CategoryProvider({
  children,
}: {
  children: ReactNode;
}) {


  const [
    searchParams,
    setSearchParams
  ] = useSearchParams();



  const [
    category,
    setCategoryState
  ] = useState(

    searchParams.get(
      "category"
    ) ?? "all"

  );



  function setCategory(
    value: string
  ) {


    setCategoryState(
      value
    );


    const params =
      new URLSearchParams(
        searchParams
      );


    if (
      value === "all"
    ) {

      params.delete(
        "category"
      );

    } else {

      params.set(
        "category",
        value
      );

    }


    setSearchParams(
      params,
      {
        replace:true,
      }
    );

  }



  return (

    <CategoryContext.Provider
      value={{
        category,
        setCategory,
      }}
    >

      {children}

    </CategoryContext.Provider>

  );

}



export function useCategory(){

  const context =
    useContext(
      CategoryContext
    );


  if(!context){

    throw new Error(
      "useCategory must be used inside CategoryProvider"
    );

  }


  return context;

}