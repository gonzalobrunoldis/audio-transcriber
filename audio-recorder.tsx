'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { ChevronDown, Mic, Play, Square, SkipBack, Share2, MoreHorizontal, Flag } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(5) // 5 seconds for demo
  const [playbackRate, setPlaybackRate] = useState(1)
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    const milliseconds = Math.floor((time % 1) * 100)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`
  }

  const formatTimelineTime = (time: number) => {
    const seconds = Math.floor(time)
    const milliseconds = Math.floor((time % 1) * 100)
    return `${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`
  }

  // Generate timeline markers
  const timelineMarkers = Array.from({ length: 8 }, (_, i) => i * (duration / 7))

  return (
    <div className="flex flex-col h-screen bg-[#1E1E1E] text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <Button variant="ghost" className="text-gray-400">
          <span className="text-xl mr-2">+</span>
          Import file
        </Button>
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Recording</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-800 p-4">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div>Recording</div>
            <div>0:05</div>
          </div>
          <div className="mt-2 text-xs text-gray-500">1/11/2025 at 11:25 AM</div>
        </div>

        {/* Timeline */}
        <div className="flex-1 p-4 relative">
          <div className="flex justify-between mb-2">
            {timelineMarkers.map((time, i) => (
              <div key={i} className="text-xs text-gray-400">
                {formatTimelineTime(time)}
              </div>
            ))}
          </div>
          <div className="h-[500px] bg-[#2D2D2D] relative">
            <div 
              className="absolute top-0 bottom-0 w-px bg-white" 
              style={{ left: `${(currentTime / duration) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="h-16 border-t border-gray-800 flex items-center px-4 gap-4">
        <Select defaultValue="microphone">
          <SelectTrigger className="w-48 bg-transparent border-0 text-gray-400">
            <Mic className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Select input" />
            <ChevronDown className="h-4 w-4 ml-2" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="microphone">Microphone (Lenovo)</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          size="icon" 
          variant="ghost"
          className={`rounded-full p-3 ${isRecording ? 'bg-red-500 text-white' : 'text-red-500'}`}
          onClick={() => setIsRecording(!isRecording)}
        >
          {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>

        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
          
          <Button variant="ghost" size="icon">
            <Play className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon">
            <SkipBack className="h-4 w-4" />
          </Button>
        </div>

        <Select defaultValue="1">
          <SelectTrigger className="w-20 bg-transparent border-0 text-gray-400">
            <SelectValue placeholder="Speed" />
            <ChevronDown className="h-4 w-4 ml-2" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0.5">0.5×</SelectItem>
            <SelectItem value="1">1×</SelectItem>
            <SelectItem value="1.5">1.5×</SelectItem>
            <SelectItem value="2">2×</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="ghost" size="icon" className="ml-auto">
          <Flag className="h-4 w-4" />
        </Button>
        <span className="text-sm text-gray-400">Mark</span>
      </div>
    </div>
  )
}

