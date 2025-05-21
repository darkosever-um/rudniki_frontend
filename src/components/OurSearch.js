import React, { useState, useEffect } from "react";
import axios from "axios"; // Ko de kredi BACKEND

function OurSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const search = async (q) => {
    if (q.trim() === "") {
      setResults([]);
      return;
    }

    try {
      const response = await axios.get("http://localhost:8080/", { // verjetno: http://localhost:8080/mines/
        params: { q },
      });
      const dataFromBackend = Object.values(response.data);
      const dataArray = [{ name: `Iskanje za: ${q}` }, ...dataFromBackend];
      setResults(dataArray);
      console.log(dataArray)
    } catch (error) {
      console.error("Napaka pri iskanju:", error);
    }
  };


  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      search(query);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="relative max-w-sm mx-auto mb-5">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Išči runike..."
        className="w-full p-1 rounded border border-gray-300"
      />
      
      {results.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow">
          {results.map((item, index) => (
            <li
              key={index}
              className="py-1 px-2 border-b border-gray-200 last:border-b-0 hover:bg-gray-100 cursor-pointer"
            >
              {item.name || JSON.stringify(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default OurSearch;