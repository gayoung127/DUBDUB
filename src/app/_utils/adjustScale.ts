export const adjustScale = () => {
  const isMacBook = /Macintosh|MacIntel|MacPPC|Mac68K|Mac OS X/i.test(
    navigator.userAgent,
  );

  const adjust = () => {
    if (!isMacBook) {
      document
        .querySelector("meta[name=viewport]")
        ?.setAttribute(
          "content",
          "width=device-width, initial-scale=" +
            1 / window.devicePixelRatio +
            ", maximum-scale=1.0, user-scalable=no",
        );
      (document.body.style as any).zoom = (
        1 / window.devicePixelRatio
      ).toString();
    } else {
      // MacBook에서는 초기 설정으로 복구
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
