export type VideoWork = {
  id: string;
  title: string;
  category: string;
  description: string;
  poster?: string;
  caseHref?: string;
  src: string;
};

export const videoWorks: VideoWork[] = [
  {
    id: "xinxing-promo",
    poster: "/images/xinxing-marathon-promo.jpg",
    title: "新興馬拉松宣傳",
    category: "活動宣傳片",
    description: "新興馬拉松活動宣傳影片。",
    src: "https://video.autaksing.com/xinxing-marathon-promo.MP4",
  },
  {
    id: "xinxing-highlights",
    poster: "/images/xinxing-marathon-highlights.jpg",
    title: "新興馬拉松活動記錄",
    category: "活動記錄",
    description: "用影像記錄新興馬拉松的活動現場。",
    src: "https://video.autaksing.com/xinxing-marathon-highlights.mp4",
  },
];
