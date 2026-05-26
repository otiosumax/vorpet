import { useEffect, useRef, useState } from "react";
import "../styles/header.css";
import { useThemeStore } from "../store/themeStore";

type option = {
  name: string;
  action: () => void;
};

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement | null>(null);

  const themeStore = useThemeStore;
  const [theme, setTheme] = useState(themeStore.savedTheme);

  const options: option[] = [
    {
      name: "Theme",
      action: () => {
        console.log("Option 1 clicked");
        if (theme === "dark") {
          themeStore.setTheme("light");
          setTheme("light");
        } else if (theme === "light" || theme == "system") {
          themeStore.setTheme("dark");
          setTheme("dark");
        }
      },
    },
    {
      name: "Option 2",
      action: () => {
        console.log("Option 2 clicked");
      },
    },
    {
      name: "Option 3",
      action: () => {
        console.log("Option 3 clicked");
      },
    },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div id="header">
        <div className="header-btn">logo</div>
        <h2>Vorpet</h2>
        <div
          onMouseLeave={() => {
            setIsOpen(false);
          }}
        >
          <div
            className="header-btn"
            onClick={() => {
              setIsOpen(true);
            }}
          >
            settings
          </div>
          <div id="settings" ref={settingsRef} className={isOpen ? "open" : ""}>
            {options.map((option, index) => (
              <div key={index} onClick={option.action}>
                {option.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
