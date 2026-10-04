# Video showcase

The homepage uses a black-and-white, media-led portfolio layout inspired by the O’shane Howard reference selected by the user. A large typographic Hero and muted video preview lead into Selected Work, followed by Filming & Editing, Operations, AI, and Design sections. Creator case studies are grouped under Operations, and the two Xinxing Marathon videos appear under Filming & Editing. Titles and exact public R2 URLs are configured in `app/video-works.ts`. Video posters are actual frames extracted from the supplied public videos.

The promo URL ends in uppercase `.MP4`; the highlights URL ends in lowercase `.mp4`. Preserve these exact object names. Set an optional `poster` to add a cover image. Escape, the close button, and the backdrop dismiss the player and stop playback. Videos load metadata only when opened. Errors offer a direct public video link.

Adding files to R2 does not automatically add new gallery entries; add them to `videoWorks`. The video section is published on the existing Cloudflare Worker `autaksing-resume`. The production homepage was checked for both exact video URLs and the section anchor.

## Cloudflare deployment

Run `npm run deploy:cloudflare` after authenticating with `npx wrangler login`. This builds the existing Next.js app with vinext and deploys the generated server configuration to the existing Worker. `--keep-vars` preserves dashboard variables. The post-build script removes the adapter-generated `legacy_env` option, which current Wrangler no longer accepts. Keep the `ASSETS` binding and the existing compatibility date.

## Homepage redesign

`app/home.css` scopes the new layout to the homepage. Existing case URLs and the `#cases`, `#videos`, `#experience`, `#capabilities` anchors remain available. The native dialog menu works on desktop and mobile, traps focus, and closes on selection and Escape. The homepage uses a consistent dark palette. Reduced-motion and data-saving visitors initially see a static poster. The 10-second, 1 MB hero loop is a muted excerpt from the supplied promo video; its pause control is available, and playback pauses offscreen and when the tab is hidden. The AI artwork is explicitly labeled as a generated concept; the Design specimen displays this website’s actual wordmark and palette. Original portrait and case images are preserved, with smaller derivatives used on the homepage.
