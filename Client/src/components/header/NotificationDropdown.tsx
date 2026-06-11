import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Link } from "react-router";

const notifications = [
  {
    id: 1,
    icon: "📈",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    title: "RELIANCE surged 2.4%",
    desc: "Reliance Industries hit a new 30-day high today.",
    time: "5 min ago",
    type: "Market Alert",
    dot: "bg-green-500",
  },
  {
    id: 2,
    icon: "🤖",
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
    title: "AI insight ready",
    desc: "New stock analysis available for TCS and INFY.",
    time: "15 min ago",
    type: "AI Analysis",
    dot: "bg-blue-500",
  },
  {
    id: 3,
    icon: "📰",
    iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
    title: "RBI policy decision today",
    desc: "RBI holds repo rate at 6.25% — market impact analysis ready.",
    time: "1 hr ago",
    type: "News",
    dot: "bg-yellow-500",
  },
  {
    id: 4,
    icon: "💼",
    iconBg: "bg-green-100 dark:bg-green-900/30",
    title: "Portfolio update",
    desc: "Your portfolio gained ₹4,230 today (+0.87%).",
    time: "2 hr ago",
    type: "Portfolio",
    dot: "bg-green-500",
  },
  {
    id: 5,
    icon: "⚠️",
    iconBg: "bg-red-100 dark:bg-red-900/30",
    title: "HDFCBANK down 1.2%",
    desc: "HDFCBANK dropped below your watchlist alert level.",
    time: "3 hr ago",
    type: "Price Alert",
    dot: "bg-red-500",
  },
];

export default function NotificationDropdown() {
  const [isOpen, setIsOpen]       = useState(false);
  const [notifying, setNotifying] = useState(true);

  const handleClick = () => {
    setIsOpen(!isOpen);
    setNotifying(false);
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className="relative flex items-center justify-center text-gray-500
          transition-colors bg-white border border-gray-200 rounded-full
          hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800
          dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800
          dark:hover:text-white"
      >
        {/* Ping dot */}
        {notifying && (
          <span className="absolute right-0 top-0.5 z-10 h-2 w-2
            rounded-full bg-orange-400 flex">
            <span className="absolute inline-flex w-full h-full bg-orange-400
              rounded-full opacity-75 animate-ping" />
          </span>
        )}
        {/* Bell icon */}
        <svg className="fill-current" width="20" height="20"
          viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10
            1.54248C9.58583 1.54248 9.25004 1.87827 9.25004
            2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504
            9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949
            2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337
            15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167
            15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591
            16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174
            3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875
            6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504
            6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004
            17.7085C8.00004 18.1228 8.33583 18.4585 8.75004
            18.4585H11.25C11.6643 18.4585 12 18.1228 12
            17.7085C12 17.2943 11.6643 16.9585 11.25
            16.9585H8.75004C8.33583 16.9585 8.00004 17.2943
            8.00004 17.7085Z"
            fill="currentColor" />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="absolute right-0 mt-3 w-[360px] rounded-2xl border
          border-gray-200 bg-white shadow-lg dark:border-gray-800
          dark:bg-gray-900 z-50"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3
          border-b border-gray-100 dark:border-gray-800">
          <h5 className="text-sm font-semibold text-gray-800 dark:text-white">
            Notifications
          </h5>
          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-600
            dark:bg-blue-900/30 dark:text-blue-400 rounded-full font-medium">
            {notifications.length} new
          </span>
        </div>

        {/* Notification list */}
        <ul className="max-h-[380px] overflow-y-auto">
          {notifications.map((n) => (
            <li key={n.id}>
              <DropdownItem
                onItemClick={() => setIsOpen(false)}
                className="flex gap-3 px-4 py-3 hover:bg-gray-50
                  dark:hover:bg-gray-800 border-b border-gray-50
                  dark:border-gray-800 cursor-pointer transition"
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-full ${n.iconBg} flex
                  items-center justify-center text-lg flex-shrink-0`}>
                  {n.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full
                      ${n.dot} flex-shrink-0`} />
                    <span className="text-xs text-gray-400 font-medium">
                      {n.type}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-800
                    dark:text-white truncate">
                    {n.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400
                    mt-0.5 line-clamp-1">
                    {n.desc}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                </div>
              </DropdownItem>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-100
          dark:border-gray-800">
          <Link
            to="/news"
            onClick={() => setIsOpen(false)}
            className="block text-center text-sm font-medium text-blue-600
              hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            View all news →
          </Link>
        </div>
      </Dropdown>
    </div>
  );
}