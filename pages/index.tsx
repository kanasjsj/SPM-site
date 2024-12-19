import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Layout from "./components/Layout";
import CookieModal from "./components/Modals/CookieModal";
import { UserButton, useUser } from "@clerk/nextjs";
import ComingSoon from "./components/ComingSoon";

const Home: NextPage = () => {
  const { user } = useUser(); 
  
  return (
    <Layout>
      <CookieModal />
      <div className="max-w-[100%] flex flex-col items-center justify-center">
          <h1 className="text-2xl font-medium">Bem-vindo, <span className="font-light">{user?.username || "Parceiro"}</span>.</h1>

          {/* Carrossel de Jogos */}
          <div className="max-w-[100%] bg-transparent p-4 rounded-lg mb-6">
            <h2 className="flex justify-center align-center text-lg text-gray font-Bold mb-4">Recentes</h2>
            <div className="overflow-x-auto max-w-[100%]">
              <div className="flex gap-4">
                  <div
                    className="flex-shrink-0 w-[400px] h-[250px] bg-gray bg-center rounded-[15px] shadow-md cursor-pointer "
                    
                  >
                      
                  </div>
              </div>
            </div>
          </div>
        </div>
    </Layout>
  );
};

export default Home;