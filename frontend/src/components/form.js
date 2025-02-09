import React from "react";

const Form = ({
  title,
  description,
  fields,
  buttons,
  onSubmit,
  className = "",
  layout = "vertical",
}) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit && onSubmit(event);
  };

  return (
    <div
      className={`max-w-4xl mx-auto p-4 md:p-8 bg-white rounded-lg border border-gray-300 ${className}`}
    >
      {title && (
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h1>
      )}
      {description && <p className="text-gray-600 mb-8">{description}</p>}

      <form onSubmit={handleSubmit}>
        <div
          className={`${
            layout === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
              : "flex flex-col space-y-4 mb-8"
          }`}
        >
          {fields}
        </div>

        {buttons && (
          <div className="flex flex-col md:flex-row gap-4">{buttons}</div>
        )}
      </form>
    </div>
  );
};

export default Form;
