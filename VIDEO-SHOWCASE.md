# Video showcase

The homepage includes two Xinxing Marathon videos after the case studies, with a navigation link, a responsive two-column gallery, and an accessible native dialog player. Titles and exact public R2 URLs are configured in `app/video-works.ts`. No unrelated project images are used; typographic covers are displayed until actual posters are supplied.

The promo URL ends in uppercase `.MP4`; the highlights URL ends in lowercase `.mp4`. Preserve these exact object names. Set an optional `poster` to add a cover image. Escape, the close button, and the backdrop dismiss the player and stop playback. Videos load metadata only when opened. Errors offer a direct public video link.

Adding files to R2 does not automatically add new gallery entries; add them to `videoWorks`. This change has not been pushed or deployed.
