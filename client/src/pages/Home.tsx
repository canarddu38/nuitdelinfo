/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Home.tsx                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sservant <sservant@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/26 13:34:25 by sservant          #+#    #+#             */
/*   Updated: 2025/12/04 17:36:44 by sservant         ###   ########lyon.fr   */
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




  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-[#0a0a0a]">
      {/* Background Animation */}
      <div className="absolute inset-0 z-0">
        <ColorBends
          colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
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
        <Header />

        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12 gap-12 sm:gap-16">
           <div className="text-center w-full max-w-4xl">
            <TextPressure
              text="Immanence"
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
                Share music in real-time with your friends. Create or join a jam session 
                and listen together in perfect synchronization. The collaborative music experience 
                reinvented.
              </p>
            </div>

            {/* User Greeting */}
            <div className="text-white/50 text-xs sm:text-sm">
              Welcome, <span className="text-white font-semibold">{user?.username}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 sm:gap-6 flex-col sm:flex-row w-full max-w-2xl px-4">
            <button
              className="cursor-pointer transition-transform duration-300 hover:scale-105 text-white w-full sm:w-auto px-6 sm:px-8 h-[50px] sm:h-[54px] flex justify-center items-center rounded-[50px] font-medium text-xs sm:text-sm"
              style={{
                background: 'rgba(198, 255, 92, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(198, 255, 92, 0.3)',
              }}
            >
              <ShinyText
                text={`Join public Jam (${user?.campus})`}
                disabled={false}
                speed={3}
              />
            </button>
            <button
              onClick={() => setShowJoinModal(true)}
              className="cursor-pointer transition-transform duration-300 hover:scale-105 text-white w-full sm:w-auto px-6 sm:px-8 h-[50px] sm:h-[54px] flex justify-center items-center rounded-[50px] font-medium text-xs sm:text-sm"
              style={{
                background: 'rgba(0, 207, 0, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 207, 0, 0.3)',
              }}
            >
              <ShinyText
                text="Join a private Jam"
                disabled={false}
                speed={3}
              />
            </button>

            <button
              className="cursor-pointer transition-transform duration-300 hover:scale-105 text-white w-full sm:w-auto px-6 sm:px-8 h-[50px] sm:h-[54px] flex justify-center items-center rounded-[50px] font-medium text-xs sm:text-sm"
              style={{
                background: 'rgba(138, 92, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(138, 92, 255, 0.3)',
              }}
            >
              <ShinyText
                text="Create a private Jam"
                disabled={false}
                speed={3}
              />
            </button>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="px-4 sm:px-6 md:px-8 py-8 sm:py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Users Card */}
              <div
                className="rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <p className="text-white/70 text-xs sm:text-sm mb-2 sm:mb-3">Active Users</p>
                <CountUp
                  to={2847}
                  from={0}
                  duration={2.5}
                  className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                />
              </div>

              {/* Jam Sessions Card */}
              <div
                className="rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <p className="text-white/70 text-xs sm:text-sm mb-2 sm:mb-3">Active Jam Sessions</p>
                <CountUp
                  to={342}
                  from={0}
                  duration={2.5}
                  className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
                />
              </div>
            </div>
          </div>
        </div>

      

        {/* Footer */}
        <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8 border-t border-white/10 text-center text-white/40 text-xs sm:text-sm">
          <p>&copy; 2025 Immanence. All rights reserved.</p>
        </div>
      </div>

      {/* Join Jam Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowJoinModal(false)}
          />
          
          {/* Modal Content */}
          <div
            className="relative rounded-2xl p-6 sm:p-8 w-full max-w-sm shadow-2xl"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Join a Private Jam</h2>
            <p className="text-white/60 text-xs sm:text-sm mb-6">Enter the jam code to join your friends</p>
            
            <div className="flex flex-col gap-3">
              <input
                value={jamCode}
                onChange={(e) => setJamCode(e.target.value)}
                placeholder="Enter jam code..."
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
                className="w-full px-4 py-3 rounded-lg outline-none text-sm sm:text-base text-white placeholder-white/40 transition-all hover:border-white/20 focus:border-purple-500/50 focus:shadow-lg focus:shadow-purple-500/10"
              />
              
              <div className="flex gap-3 flex-col sm:flex-row">
                <button
                  className="cursor-pointer transition-transform duration-300 hover:scale-105 text-white flex-1 px-6 h-[50px] sm:h-[54px] flex justify-center items-center rounded-[50px] font-medium text-xs sm:text-sm"
                  style={{
                    background: 'rgba(0, 207, 0, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 207, 0, 0.3)',
                  }}
                >
                  <ShinyText
                    text="Join"
                    disabled={false}
                    speed={3}
                  />
                </button>
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="cursor-pointer transition-transform duration-300 hover:scale-105 text-white flex-1 px-6 h-[50px] sm:h-[54px] flex justify-center items-center rounded-[50px] font-medium text-xs sm:text-sm"
                  style={{
                    background: 'rgba(207, 0, 0, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(207, 0, 0, 0.3)',
                  }}
                >
                  <ShinyText
                    text="Cancel"
                    disabled={false}
                    speed={3}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

