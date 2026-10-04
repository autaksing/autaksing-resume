export type VideoWork = {
  id: string;
  orientation?: "portrait" | "landscape";
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
    description: "活動預熱影片",
    src: "https://video.autaksing.com/xinxing-marathon-promo.MP4",
  },
  {
    id: "xinxing-highlights",
    poster: "/images/xinxing-marathon-highlights.jpg",
    title: "農夫山泉活動快閃",
    category: "活動記錄",
    description: "活動記錄",
    src: "https://video.autaksing.com/xinxing-marathon-highlights.mp4",
  },
  {
    id: "shizhanhui",
    orientation: "portrait",
    poster: "/images/shizhanhui.jpg",
    title: "雲浮石材文創",
    category: "展會宣傳",
    description: "雲浮石材展覽會系列宣傳",
    src: "https://video.autaksing.com/shizhanhui-phone.mp4",
  },
  {
    id: "shicaikafeiji",
    orientation: "portrait",
    poster: "/images/shicaikafeiji.jpg",
    title: "美頌石萃",
    category: "產品宣傳",
    description: "雲浮石材展覽會系列宣傳",
    src: "https://video.autaksing.com/shicaikafeiji-phone.mp4",
  },
  {
    id: "pangxiebao",
    orientation: "portrait",
    poster: "/images/pangxiebao.jpg",
    title: "胖蟹煲達人探店",
    category: "探店影片",
    description: "抖音達人探店",
    src: "https://video.autaksing.com/pangxiebao.-phoneMP4.MP4",
  },
  {
    id: "nanyuechunnuan",
    poster: "/images/nanyuechunnuan.jpg",
    title: "南粵春暖招聘會",
    category: "活動拍攝",
    description: "活動記錄",
    src: "https://video.autaksing.com/nanyuechunnuan-highlights.MP4",
  },
];
