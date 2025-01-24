export const adjustScale = () => {
  const isMacBook = /Macintosh|MacIntel|MacPPC|Mac68K|Mac OS X/i.test(
    navigator.userAgent,
  );

  const adjust = () => {
    if (!isMacBook) {
      let scale = 1 / devicePixelRatio;

      if (devicePixelRatio === 2) {
        scale = 1.5 / devicePixelRatio;
      }

      document
        .querySelector("meta[name=viewport]")
        ?.setAttribute(
          "content",
          `width=device-width, initial-scale=${scale}, maximum-scale=1.0, user-scalable=no`,
        );
      (document.body.style as any).zoom = scale.toString();
    } else {
      document
        .querySelector("meta[name=viewport]")
        ?.setAttribute(
          "content",
          "width=device-width, initial-scale=1.0, maximum-scale=3.0, user-scalable=yes",
        );
      document.body.style.transform = "scale(1)";
      document.body.style.transformOrigin = "0 0";
    }
  };

  window.addEventListener("resize", adjust);
  window.addEventListener("load", adjust);

  // 초기 호출
  adjust();

  return () => {
    window.removeEventListener("resize", adjust);
    window.removeEventListener("load", adjust);
  };
};
