import { useEffect, useRef, useState } from "react";
import "../styles/header.css";
import { useThemeStore } from "../themeStore";

type option = {
  name: string;
  action: () => void;
};

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

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
        } else if (theme === "light" || theme == 'system') {
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
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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
        <div>logo</div>
        <h2>Vorpet</h2>
        <div
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}
        >
          settings
        </div>
        {isOpen && (
          <div id="settings" ref={menuRef}>
            {options.map((option, index) => (
              <div key={index} onClick={option.action}>
                {option.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
