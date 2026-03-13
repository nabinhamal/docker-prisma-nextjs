"use client";

import { useEffect, useState } from "react";

export function SystemStatus() {
  const [serverId, setServerId] = useState<string>("Loading...");
  const [wsStatus, setWsStatus] = useState<"Connected" | "Disconnected" | "Connecting">("Connecting");
  const [lastWsMessage, setLastWsMessage] = useState<string>("");

  useEffect(() => {
    // 1. Fetch Server ID
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/status");
        const data = await res.json();
        setServerId(data.hostname);
      } catch (error) {
        setServerId("Unknown");
      }
    };
    fetchStatus();

    // 2. Setup WebSocket
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    let socket: WebSocket;
    
    const connect = () => {
      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        setWsStatus("Connected");
        socket.send("Ping from UI");
      };

      socket.onmessage = (event) => {
        setLastWsMessage(event.data);
      };

      socket.onclose = () => {
        setWsStatus("Disconnected");
        // Reconnect after 3 seconds
        setTimeout(connect, 3000);
      };

      socket.onerror = () => {
        setWsStatus("Disconnected");
      };
    };

    connect();

    return () => {
      if (socket) socket.close();
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white/80 p-4 shadow-xl backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
      <div className="flex items-center justify-between gap-8">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">System Status</span>
        <div className="flex items-center gap-2">
           <div className={`h-2 w-2 rounded-full ${wsStatus === 'Connected' ? 'bg-green-500 animate-pulse' : wsStatus === 'Connecting' ? 'bg-yellow-500' : 'bg-red-500'}`} />
           <span className="text-xs font-medium dark:text-zinc-400">{wsStatus}</span>
        </div>
      </div>
      
      <div className="mt-2 space-y-1">
        <div className="flex flex-col">
          <span className="text-[10px] text-zinc-400">Serving Content From:</span>
          <code className="text-xs font-mono text-indigo-600 dark:text-indigo-400">{serverId}</code>
        </div>
        
        {lastWsMessage && (
          <div className="flex flex-col pt-1">
            <span className="text-[10px] text-zinc-400">Last WS Message:</span>
            <span className="truncate text-[10px] italic dark:text-zinc-500 max-w-[150px]">{lastWsMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
