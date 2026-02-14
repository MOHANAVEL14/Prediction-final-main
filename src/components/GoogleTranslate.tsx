import React, { useEffect } from "react";

const GoogleTranslate: React.FC = () => {
  useEffect(() => {
    // Create global callback
    (window as any).googleTranslateElementInit = function () {
      try {
        new (window as any).google.translate.TranslateElement(
          { pageLanguage: "en" },
          "google_translate_element"
        );
      } catch (e) {
        // ignore
      }
    };

    // Append script once
    const id = "google-translate-script";
    if (!document.getElementById(id)) {
      const s = document.createElement("script");
      s.id = id;
      s.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      s.async = true;
      document.body.appendChild(s);
    }

    return () => {
      // Do not remove script on unmount to avoid flicker when navigating
    };
  }, []);

  return <div id="google_translate_element" className="ml-2" />;
};

export default GoogleTranslate;
