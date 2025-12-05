/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Login.tsx                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbichet <mbichet@student.42lyon.fr>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/04 18:45:00 by sservant          #+#    #+#             */
/*   Updated: 2025/12/05 01:55:10 by mbichet          ###   ########lyon.fr   */
/*                                                                            */
/* ************************************************************************** */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth/AuthContext";
import ColorBends from '../components/utils/ColorBends';
import ShinyText from '../components/utils/ShinyText';
import TextPressure from '../components/utils/TextPressure';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await login(username, password);
    if (ok) navigate("../dashboard");
  };

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-[#0a0a0a]">
      {/* Background Animation */}
      <div className="absolute inset-0 z-0">
        <ColorBends
          colors={["#1D6618", "#46D93B", "#00ffd1"]}
          rotation={0}
          speed={0.2}
          scale={0.5}
          frequency={0.8}
          warpStrength={1.0}
          mouseInfluence={1.0}
          parallax={0.6}
          noise={0.1}
        />
      </div>

      <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-8">
        
        {/* Title */}
        <div className="mb-8 sm:mb-12 w-full max-w-4xl text-center">
             <TextPressure
              text="Connexion"
              flex={true}
              alpha={false}
              stroke={false}
              width={true}
              weight={false}
              italic={true}
              textColor="#ffffff"
              strokeColor="#ff0000"
              className="text-center w-full"
              minFontSize={36}
            />
        </div>

        {/* Login Form Card */}
        <div
            className="relative rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <form onSubmit={handleLogin} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-white/70 text-sm ml-1 font-light">Identifiant</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Entrez votre identifiant"
                        style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                        className="w-full px-4 py-3 rounded-lg outline-none text-white placeholder-white/40 transition-all hover:border-white/20 focus:border-[#46D93B]/50 focus:shadow-lg focus:shadow-[#46D93B]/10"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-white/70 text-sm ml-1 font-light">Mot de passe</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Entrez votre mot de passe"
                        style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                        className="w-full px-4 py-3 rounded-lg outline-none text-white placeholder-white/40 transition-all hover:border-white/20 focus:border-[#46D93B]/50 focus:shadow-lg focus:shadow-[#46D93B]/10"
                    />
                </div>

                <button
                  type="submit"
                  className="cursor-pointer mt-4 transition-transform duration-300 hover:scale-105 text-white w-full h-[54px] flex justify-center items-center rounded-[50px] font-medium"
                  style={{
                    background: 'rgba(0, 207, 0, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 207, 0, 0.3)',
                  }}
                >
                  <ShinyText
                    text="Se connecter"
                    disabled={false}
                    speed={3}
                  />
                </button>
            </form>
            
            <div className="mt-6 text-center">
                <p className="text-white/40 text-sm">
                    Pas encore de compte ? <span className="text-[#46D93B] cursor-pointer hover:underline" onClick={() => navigate('/register')}>S'inscrire</span>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
