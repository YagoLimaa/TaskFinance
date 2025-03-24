"use client";

import { useUserContext } from "@/context/UserContext";
import useRedirect from "@/hook/useUserRedirect";
import { useState } from "react";

export default function Home() {
  useRedirect("/login");
  // Obtenha todos os valores necessários de uma só vez
  const { logoutUser, user, handlerUserInput, userState, UserUpdate } = useUserContext();
  const {name, photo, isVerified, bio} = user;
  const [Open, setOpen] = useState(false);

  const bioUpdt = () => {
    setOpen(!Open);
    console.log(Open);
  };
  
  return (
    <main className="py-[2rem] mx-[10rem]">
      <header className="flex justify-between">
        <h1 className="text-3x1 font-bold">
          Bem-vindo, <strong className="text-blue-500">{name}</strong> ao TaskFinance!
        </h1>

        <div className="flex items-center gap-4">
          <img 
          src={photo}
          alt={name}
          className="w-[40px] h-[40px] rounded-full" />

          {!isVerified && 
             <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
              Verificar e-mail 
              </button>}
          <button onClick={logoutUser} className="px-4 py-2 bg-blue-500 text-white rounded-md">
            Sair
          </button>
        </div>
      </header>

      <section>
        <p className="text-[#999] text-[2rem]">{bio}</p>
        <h1>
          <button onClick={bioUpdt} className="px-4 py-2 bg-[#2ECC71] text-white rounded-md">
            Atualizar bio
          </button>
        </h1>
        {Open && (
        <form className="mt-4 max-w-[400px] w-full"> 
          <div className="flex flex-col">
            <label htmlFor="bio" className="mb-1 text-[#999]">
              Bio
            </label>
            <textarea name="bio" 
            defaultValue={bio} 
            onChange={(e) => handlerUserInput("bio")(e) } className="px-4 py-3 border-[2px] border-[#999] outline-[#2ECC71] rounded-md text-gray"
            ></textarea>
          </div>
          <button type="submit" 
          onClick={ (e) => UserUpdate(e, { bio: userState.bio} )}
          className="px-4 py-2 bg-blue-500 text-white rounded-md" >
            Atualizar Bio
          </button>
          </form>
        )}
      </section>
    </main>
  );
}