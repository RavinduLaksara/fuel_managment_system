import React from "react";

const Table = ({ columns, data }) => (
  <div className="w-full overflow-x-auto mb-8 font-sans rounded-lg border border-gray-300">
    <table className="w-full  bg-white rounded-t-lg overflow-hidden ">
      <thead>
        <tr className="border-b border-gray-200 bg-gray-100">
          {columns.map((column, index) => (
            <th
              key={column}
              className={`px-8 py-4 text-left text-sm font-semibold text-gray-900 tracking-tight ${
                index === 0 ? "rounded-tl-lg" : ""
              } ${index === columns.length - 1 ? "rounded-tr-lg" : ""}`}
            >
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {data.map((row) => (
          <tr
            key={row["Transaction ID"]}
            className="transition-colors duration-200 ease-in-out hover:bg-gray-50"
          >
            {columns.map((column) => (
              <td
                key={column}
                className="px-8 py-4 text-sm text-gray-600 font-regular break-words"
              >
                {React.isValidElement(row[column])
                  ? row[column]
                  : typeof row[column] === "object" && row[column] !== null
                  ? row[column].username || row[column].toLocaleString()
                  : String(row[column])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Table;
