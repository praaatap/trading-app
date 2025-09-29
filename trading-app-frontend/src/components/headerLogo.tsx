import { Link } from "react-router-dom";
import { TrendingUpIcon } from "lucide-react";

type HeaderLogoProps = {
  windowLocation: string;
};

export default function HeaderLogoComponent({ windowLocation }: HeaderLogoProps) {
  return (
    <div className="container mx-auto flex justify-between items-center">
      <Link
        to={windowLocation}
        className="flex items-center text-xl font-bold cursor-pointer"
      >
        <TrendingUpIcon className="w-6 h-6 mr-2  text-yellow-500" />
        <span className="text-white">VyaparTrade</span>
      </Link>
    </div>
  );
}
