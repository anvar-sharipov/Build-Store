const MyLoading = ({ spinnerClass = "w-12 h-12", containerClass = "h-32" }) => {
  return (
    <div className={`flex justify-center items-center ${containerClass}`}>
      <div className={`border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin ${spinnerClass}`} />
    </div>
  );
};

export default MyLoading;