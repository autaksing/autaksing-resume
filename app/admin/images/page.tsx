import type { Metadata } from "next";
import VideoAdmin from "../videos/VideoAdmin";
export const metadata:Metadata={title:"图片管理｜AUTAKSING",robots:{index:false,follow:false}};
export default function Page(){return <VideoAdmin key="images" kind="images"/>;}
