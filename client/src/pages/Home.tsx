/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Home.tsx                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sservant <sservant@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/26 13:34:25 by sservant          #+#    #+#             */
/*   Updated: 2025/12/05 08:28:35 by sservant         ###   ########lyon.fr   */
/*                                                                            */
/* ************************************************************************** */

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth/AuthContext";
import SplitText from '../components/utils/SplitText';
import Header from '../components/Header';
import ShinyText from '../components/utils/ShinyText';
import ColorBends from '../components/utils/ColorBends';
import CountUp from '../components/utils/CountUp';
import TextPressure from '../components/utils/TextPressure';



export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [jamCode, setJamCode] = useState("");


  const showSource = async () => {
    const url = 'https://github.com/canarddu38/nuitdelinfo/';
    window.open(url, '_blank', 'noopener,noreferrer');
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

      <div className="relative z-10 w-full">


        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12 gap-12 sm:gap-16">
           <div className="text-center w-full max-w-4xl">
            <TextPressure
              text="Odyssée Numérique"
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
          <div className="text-center space-y-4 sm:space-y-6 w-full max-w-4xl">

            
            {/* Description */}
            <div className="max-w-2xl mx-auto px-2">
              <p className="text-base sm:text-lg md:text-xl text-white/70 leading-relaxed font-light">
                Votre Odyssée Numérique aide à comprendre le digital, à prendre du recul et à adopter des usages plus responsables grâce à des quiz simples et ludiques.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 sm:gap-6 flex-col sm:flex-row w-full max-w-2xl px-4 justify-center items-center">
            <button
              onClick={() => navigate('login')}
              className="cursor-pointer transition-transform duration-300 hover:scale-105 text-white w-full sm:w-auto px-6 sm:px-8 h-[50px] sm:h-[54px] flex justify-center items-center rounded-[50px] font-medium text-xs sm:text-sm"
              style={{
                background: 'rgba(0, 207, 0, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 207, 0, 0.3)',
              }}
            >
              <ShinyText
                text="Commencer votre aventure"
                disabled={false}
                speed={3}
              />
            </button>
          </div>
        </div>
        {/* Footer */}
        <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8 border-t border-white/10 text-center text-white/40 text-xs sm:text-sm">
          <p>&copy; 2025 O.N. All rights reserved.</p>
              <div className="cursor-pointer" onClick={showSource}>
                <ShinyText
                text="Code source (github)"
                disabled={false}
                speed={3}
              />
              </div>
        </div>
      </div>
    </div>
  );
}

