import { CircleQuestionMark } from "lucide-react";
import React from "react";

function page() {
  return (
    <div className=" bg-white py-10 px-6 sm:px-12">
      <div className="">
        <div className="border-b border-b-gray-300 mb-5 pb-3  flex justify-between items-center">
          <h1 className="text-2xl  font-medium text-gray-800 ">
            Settings for Section: Promotional Emails
          </h1>
          <CircleQuestionMark
            strokeWidth={1}
            className="w-6 h-6 cursor-pointer text-gray-600"
          />
        </div>

        <form className="space-y-8 max-w-xl mx-auto">
          {/* Focus */}
          <div>
            <label className="block text-gray-800 font-medium mb-2">
              Focus
              <span className="ml-1 text-gray-400 cursor-pointer">?</span>
            </label>
            <select className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-800 bg-white focus:outline-none">
              <option>Default</option>
            </select>
          </div>

          {/* Tone */}
          <div>
            <label className="block text-gray-800 font-medium mb-2">
              Tone
              <span className="ml-1 text-gray-400 cursor-pointer">?</span>
            </label>
            <select className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-800 bg-white focus:outline-none">
              <option>Default</option>
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-gray-800 font-medium mb-2">
              Quantity
              <span className="ml-1 text-gray-400 cursor-pointer">?</span>
            </label>
            <select className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-500 bg-white focus:outline-none">
              <option value="">Select quantity...</option>
            </select>
          </div>

          {/* Save button */}
          <div className=" flex justify-center items-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-8 rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default page;
