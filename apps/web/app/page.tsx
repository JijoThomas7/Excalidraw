"use client";
import { useState } from "react";
import styles from "./page.module.css";


export default function Home() {
  const [roomId,setRoomId] = useState("") ;

  return (
    <input onChange = {(e)=>{
      setRoomId(e.target.value);}
    } type="text" placeholder="Room Id"></input>
  );
}
