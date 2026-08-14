function Button({ children }) {
  return (
    <button className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700">
      {children}
    </button>
  );
}

export default Button;