import { useEffect, useRef, useState } from "react";
import "../styles/header.css";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

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
            <div>Option 1</div>
            <div>Option 2</div>
            <div>Option 3</div>
          </div>
        )}
      </div>
    </>
  );
}
