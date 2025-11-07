const Button = ({ children, className = "", ...props }) => {
  return (
    <button
      {...props}
      className={`flex items-center justify-center px-4 py-2 rounded-lg shadow 
        bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;