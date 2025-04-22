import Link from "next/link";
import { Brain } from "lucide-react";


export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-row items-center justify-center">
          <Brain className="w-10 h-10 mr-2" />
          <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        </div>
      </div>
      <Link href="/" className="text-blue-500">Go back to the home page</Link>
    </div>
  );
}