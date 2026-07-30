import { Bell, Settings } from "lucide-react";
import * as Avatar from "@radix-ui/react-avatar";

export default function HeaderActions() {
  return (
    <div className="flex items-center gap-5">
      <Bell
        size={20}
        className="cursor-pointer text-gray-300 hover:text-white"
      />

      <Settings
        size={20}
        className="cursor-pointer text-gray-300 hover:text-white"
      />

      <Avatar.Root className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-blue-600">
        <Avatar.Fallback className="text-sm font-semibold text-white">
          G
        </Avatar.Fallback>
      </Avatar.Root>
    </div>
  );
}