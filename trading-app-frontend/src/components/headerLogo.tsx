import { Link } from "react-router-dom";
import { TrendingUpIcon } from "lucide-react";

export default function HeaderLogoComponent() {
  return (
    <div className="container mx-auto flex justify-between items-center">
      <Link
        to="/"
        className="flex items-center text-xl font-bold cursor-pointer"
      >
        <TrendingUpIcon className="w-6 h-6 mr-2 text-gray-300" />
        <span className="text-white">VyaparTrade</span>
      </Link>
    </div>
  );
}
