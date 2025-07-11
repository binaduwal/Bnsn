"use client";
import { Check, Pencil, X } from "lucide-react";
import React, { useState } from "react";

function EditableInput({
  text,
  setText,
}: {
  text: string;
  setText: (text: string) => void;
}) {
  const [content, setContent] = useState({
    original: text,
    edit: "",
  });
  const [edit, setEdit] = useState(false);
  return (
    <div className=" flex items-center gap-2">
      {!edit && (
        <h1 className="text-xl flex items-center gap-4 font-semibold text-gray-900">
          {content.original}{" "}
          <Pencil
            onClick={() => {
              setEdit(true);
              setContent((p) => ({ ...p, edit: p.original }));
            }}
            className="w-4 h-4 text-gray-400 hover:text-gray-600"
          />
        </h1>
      )}
      {edit && (
        <div className="flex items-center gap-2">
          <input
            value={content.edit}
            onChange={(e) =>
              setContent((p) => ({ ...p, edit: e.target.value }))
            }
            className="border border-gray-300 rounded-md px-3 py-1 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            autoFocus
          />

          <div className=" items-center flex gap-3">
            <button
              onClick={(e) => {
                setEdit(false);
                setContent((p) => ({ ...p, original: p.edit }));
                setText(content.edit);
              }}
              className="p-1 rounded hover:bg-gray-100 transition-colors duration-150"
              title="Save"
            >
              <Check className="w-4 h-4 text-green-600 hover:text-green-700" />
            </button>
            <button
              onClick={(e) => {
                setEdit(false);
                setContent((p) => ({ original: p.original, edit: "" }));
              }}
              className="p-1 rounded hover:bg-gray-100 transition-colors duration-150"
              title="Cancel"
            >
              <X className="w-4 h-4 text-red-600 hover:text-red-700" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditableInput;
