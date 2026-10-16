import type { Metadata } from "next";
import VideoAdmin from "./VideoAdmin";
export const metadata:Metadata = {title:"作品管理｜AUTAKSING",robots:{index:false,follow:false}};
export default function Page(){return <VideoAdmin key="videos"/>;}
