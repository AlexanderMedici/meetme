import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  FaChevronLeft,
  FaChevronRight,
  FaUserCircle,
  FaSignOutAlt,
  FaRegCalendarCheck,
} from "react-icons/fa";
import { logout } from "../slices/authSlice.js";
import { useLogoutMutation } from "../slices/usersApiSlice.js";
import { Button } from "./ui/button.jsx";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownTrigger,
} from "./ui/dropdown.jsx";

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [monthLabel, setMonthLabel] = useState(() => {
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const curLabel = now.toLocaleString("default", { month: "short" });
    const nextLabel = next.toLocaleString("default", { month: "short" });
    return `${curLabel} – ${nextLabel} ${now.getFullYear()}`;
  });

  useEffect(() => {
    const handler = (e) => {
      if (e?.detail) {
        setMonthLabel(e.detail);
      }
    };
    window.addEventListener("calendar-month-label", handler);
    return () => window.removeEventListener("calendar-month-label", handler);
  }, []);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className="header-shell">
      <div className="header-bar">
        <div className="header-left">
          <div className="header-brand">
            <div className="brand-glyph">MM</div>
            <div>
              <div className="brand-title">MeetMe</div>
              <div className="brand-subtitle">Calendar</div>
            </div>
          </div>
          <div className="header-controls">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("calendar-nav", { detail: { delta: -1 } })
                )
              }
            >
              <FaChevronLeft />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("calendar-nav", { detail: { delta: 1 } })
                )
              }
            >
              <FaChevronRight />
            </Button>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("calendar-nav", { detail: { type: "today" } })
                )
              }
            >
              Today
            </Button>
            <div className="month-pill">
              <FaRegCalendarCheck />
              <span>{monthLabel}</span>
            </div>
          </div>
        </div>

        <div className="header-right">
          <Button
            size="sm"
            onClick={() => navigate("/event/new")}
            className="cta-btn"
          >
            + New event
          </Button>

          {userInfo ? (
            <Dropdown open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownTrigger className="avatar-trigger">
                <FaUserCircle />
                <span className="user-name">{userInfo.name}</span>
              </DropdownTrigger>
              <DropdownContent align="end" width={200}>
                <DropdownItem
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/profile");
                  }}
                >
                  <FaUserCircle />
                  Profile
                </DropdownItem>
                <DropdownSeparator />
                <DropdownItem
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    logoutHandler();
                  }}
                >
                  <FaSignOutAlt />
                  Logout
                </DropdownItem>
              </DropdownContent>
            </Dropdown>
          ) : (
            <Link className="signin-link" to="/login">
              <FaUserCircle />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
