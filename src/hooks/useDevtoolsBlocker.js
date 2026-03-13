import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useDevtoolsBlocker() {
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Only trigger on desktop devices
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    if (isMobile) return;

    let devtoolsOpen = false;

    const detectDevTools = () => {
      const threshold = 160; // px
      if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
      ) {
        devtoolsOpen = true;
      } else {
        devtoolsOpen = false;
      }
      if (devtoolsOpen) {
        navigate("/caught-you");
      }
    };

    const keyHandler = (e) => {
      // F12 or Ctrl+Shift+I or Cmd+Opt+I
      if (
        e.keyCode === 123 ||
        (e.ctrlKey && e.shiftKey && e.keyCode === 73) ||
        (e.metaKey && e.altKey && e.keyCode === 73)
      ) {
        e.preventDefault();
        navigate("/caught-you");
      }
    };

    const contextMenuHandler = (e) => {
      e.preventDefault();
      navigate("/caught-you");
    };

    // Listen
    window.addEventListener("resize", detectDevTools);
    window.addEventListener("keydown", keyHandler);
    window.addEventListener("contextmenu", contextMenuHandler);

    // Run check initially
    detectDevTools();

    return () => {
      window.removeEventListener("resize", detectDevTools);
      window.removeEventListener("keydown", keyHandler);
      window.removeEventListener("contextmenu", contextMenuHandler);
    };
  }, [navigate]);
}
