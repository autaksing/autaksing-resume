function ArrowIcon(){return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 15 15 5M7 5h8v8"/></svg>}

const campaignPoints = [
  ["01", "建立人物標籤", "以「單身狗」作為清晰角色身份，讓作品不只被記住，更讓人物被記住。"],
  ["02", "情緒與文化共鳴", "把粵語改編、情感共鳴和網絡語境結合，降低分享門檻。"],
  ["03", "系列化內容", "以歌曲、劇情及人物關係持續擴展角色生活場景，形成觀看習慣。"],
];

export default function AnzaiCasePage(){
  return <main className="case-page anzai-page">
    <nav className="case-page-nav"><a className="brand" href="/">AUTAKSING<span>.</span></a><a className="case-back" href="/#cases">返回案例 <ArrowIcon/></a></nav>

    <header className="case-hero">
      <span className="case-hero-index">CASE 01</span>
      <div className="case-hero-copy"><p className="eyebrow light">Original Character IP</p><h1>「單身狗」安仔</h1><p>打造原創人物IP</p></div>
    </header>

    <section className="case-intro"><div><p className="eyebrow">Project Background</p><h2>從一首歌<br/>打造人物 IP</h2></div><div className="case-intro-copy"><p>〈單身狗〉改編自薛之謙〈演員〉，最初並非為短影片平台創作，而是在公眾號及社交媒體傳播時代完成內容冷啟動。</p><p>團隊透過原創人物設定與粵語改編歌曲，引發大量用戶自發分享，在微信公眾號、微博、搜尋平台及多個影片網站獲得自然傳播，為後續人物 IP 的建立奠定基礎。</p></div></section>

    <figure className="case-wide-image"><img src="/images/case-anzai/single-dog-video.jpg" alt="單身狗粵語改編作品影片畫面"/><figcaption>01 / THE ORIGINAL HIT</figcaption></figure>

    <section className="case-campaign"><div className="case-section-heading"><p className="eyebrow">Campaign</p><h2>用人物而不是歌曲<br/>形成記憶點</h2></div><div className="campaign-grid">{campaignPoints.map(([no,title,copy])=><article key={no}><span>{no}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>

    <section className="case-spread"><div className="case-spread-head"><p className="eyebrow light-on-dark">Result / Social Spread</p><h2>從自然分享<br/>到全網傳播</h2><p>微博、公眾號及各大影片平台形成病毒式傳播，超千萬播放量，讓「單身狗」從單一爆款升級為清晰的人物認知。</p></div><div className="spread-grid">
      <figure><img src="/images/case-anzai/platform-views.jpg" alt="單身狗在不同平台的播放與轉發數據"/><figcaption>平台播放</figcaption></figure>
      <figure><img src="/images/case-anzai/social-spread.jpg" alt="單身狗在公眾號及媒體的轉發內容"/><figcaption>社交傳播</figcaption></figure>
      <figure><img src="/images/case-anzai/search-results.jpg" alt="單身狗在搜尋平台的多個轉載結果"/><figcaption>搜尋結果</figcaption></figure>
      <figure><img src="/images/case-anzai/search-spread.jpg" alt="單身狗在不同內容平台的搜尋與轉載結果"/><figcaption>內容擴散</figcaption></figure>
    </div></section>

    <section className="case-series"><div className="case-section-heading"><p className="eyebrow">Content System</p><h2>讓爆款升級為人物IP</h2><p>從人物設定出發，持續打造系列化內容，建立具有辨識度的原創人物IP。</p></div><div className="series-grid">
      <article><header><span>01 / 角色關係</span><h3>〈狗糧〉</h3></header><div className="series-content"><p>延續「單身狗」人物設定，透過情侶視角反襯角色處境，強化人物標籤與連續觀看習慣。</p><figure><img src="/images/case-anzai/dog-food.jpg" alt="狗糧粵語改編作品頁面"/></figure></div></article>
      <article><header><span>02 / 生活場景</span><h3>〈留翻啲女俾我〉</h3></header><div className="series-content"><p>擴展角色生活場景，結合粵語文化及網絡熱點，在統一人設下持續創造新鮮內容。</p><figure><img src="/images/case-anzai/kong-cover.jpg" alt="留翻啲女俾我粵語改編作品頁面"/></figure></div></article>
    </div></section>

    <section className="case-migration"><div className="migration-image"><span aria-hidden="true"/><img src="/images/case-anzai/douyin-home.jpg" alt="梁景安安仔抖音帳號主頁及11.2萬粉絲數據"/></div><div className="migration-copy"><p className="eyebrow light-on-dark">Account Migration</p><h2>從公眾號時代<br/>走進短影片時代</h2><p>隨著短影片平台興起，重新搭建帳號體系，強化人物標籤，讓「單身狗」與梁景安建立清晰關聯，並圍繞角色持續豐富人物形象。</p><div className="migration-metrics"><article><strong>11.2萬+</strong><span>抖音粉絲</span></article><article><strong>1120萬+</strong><span>抖音版播放</span></article><article><strong>多年</strong><span>人物 IP 持續營運</span></article></div></div></section>

    <section className="case-contribution"><div><p className="eyebrow">My Contribution</p><h2>整個項目中<br/>我參與了</h2></div><div className="contribution-list"><span>原創人物 IP 規劃</span><span>內容策略制定</span><span>拍攝執行</span><span>後期製作</span></div></section>

    <blockquote className="case-closing"><p><span>相比單條爆款 我更關注如何把一次傳播</span><span>升級為可持續營運的人物 IP</span></p><small><span>「〈單身狗〉驗證了好的內容</span><span>在不同平台依然具備持續傳播能力」</span></small></blockquote>

    <footer className="case-page-footer case-navigation">
      <div/>
      <a className="all-cases-link" href="/#cases">返回所有案例</a>
      <div><a className="case-nav-link next" href="/cases/tang"><small>Next / Case 02</small><strong>湯不唱 →</strong></a></div>
    </footer>
  </main>
}
