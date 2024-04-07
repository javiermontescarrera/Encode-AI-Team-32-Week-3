"use client";

import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";

export default function Chat() {
  const {
    messages,
    isLoading,
    append,
  } = useChat();
  const styles = [
    { emoji: "🖼️", value: "Realism" },
    { emoji: "🖼️", value: "Painterly" },
    { emoji: "🖼️", value: "Impressionism" },
    { emoji: "🖼️", value: "Expressionism" },
    { emoji: "🖼️", value: "Fauvism" },
    { emoji: "🖼️", value: "Photorealism" },
    { emoji: "🖼️", value: "Cubism" },
  ];

  const [state, setState] = useState({
    style: "",
    imageSize: "medium",
    batchSize: "1",
    resolution: "1",
    temperature:"0"
  }); 

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [name]: value,
    });
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  const [imageIsLoading, setImageIsLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  if (imageIsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-slate-700 h-10 w-10"></div>
          </div>
        </div>
      </div>
    );
  }

  if (image) {
    return (
      <div className="card w-full h-screen max-w-md py-24 mx-auto stretch">
        <img src={`data:image/jpeg;base64,${image}`} />
        <textarea
          className="mt-4 w-full text-white bg-black h-64"
          value={messages[messages.length - 1].content}
          readOnly
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-screen max-w-md py-24 mx-auto stretch">
      <div className="overflow-auto mb-8 w-full" ref={messagesContainerRef}>
        {messages.map((m) => (
          <div
            key={m.id}
            className={`whitespace-pre-wrap ${
              m.role === "user"
                ? "bg-green-700 p-3 m-2 rounded-lg"
                : "bg-slate-700 p-3 m-2 rounded-lg"
            }`}
          >
            {m.role === "user" ? "User: " : "AI: "}
            {m.content}
          </div>
        ))}
  
        {isLoading && (
          <div className="flex justify-end pr-4">
            <span className="animate-bounce">...</span>
          </div>
        )}
      </div>
      <div className="fixed bottom-0 w-full max-w-md">
        <div className="flex flex-col justify-center mb-2 items-center">
          {messages.length === 0 && (
            <div>
              <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
                <h3 className="text-xl font-semibold">Styles</h3>
  
                <div className="flex flex-wrap justify-center">
                  {styles.map(({ value, emoji }) => (
                    <div
                      key={value}
                      className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
                    >
                      <input
                        id={value}
                        type="radio"
                        name="style"
                        value={value}
                        onChange={handleChange}
                      />
                      <label className="ml-2" htmlFor={value}>
                        {`${emoji} ${value}`}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <button
                className="bg-blue-500 p-2 text-white rounded shadow-xl"
                disabled={isLoading || !state.style}
                onClick={() =>
                  append({ role: "user", content: state.style })
                }
              >
                Design a painting
              </button>
            </div>
          )}
  
          <form className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Image Generation Parameters</h3>
  
            <div className="mb-2">
              <label className="block mb-1">Image Size:</label>
              <select
                value={state.imageSize}
                onChange={handleSelectChange}
                className="border rounded p-1"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>

            <div className="mb-2">
              <label className="block mb-1">Batch Size:</label>
              <select
                value={state.batchSize}
                onChange={handleSelectChange}
                className="border rounded p-1"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>

            <div className="mb-2">
              <label className="block mb-1">Temperature/Randomness:</label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={state.temperature}
                onChange={handleChange}
                className="border rounded p-1"
              />
            </div>

            <div className="mb-2">
              <label className="block mb-1">Resolution:</label>
              <select
                value={state.resolution}
                onChange={handleSelectChange}
                className="border rounded p-1"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </form>
  
          {messages.length === 2 && !isLoading && (
            <button
              className="bg-blue-500 p-2 text-white rounded shadow-xl"
              disabled={isLoading}
              onClick={async () => {
                setImageIsLoading(true);
                const response = await fetch("api/images", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    message: messages[messages.length - 1].content,
                  }),
                });
                const data = await response.json();
                setImage(data);
                setImageIsLoading(false);
              }}
            >
              Generate painting
            </button>
          )}
        </div>
      </div>
    </div>
  );  
}
