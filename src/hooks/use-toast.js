import { useEffect, useState } from "react";

function useToast() {
  const [toast, setToast] = useState({
    type: "",
    message: "",
  });

  const showToast = (type, message) => {
    setToast({
      type,
      message,
    });
  };

  const hideToast = () => {
    setToast({
      type: "",
      message: "",
    });
  };

  useEffect(() => {
    if (!toast.message) return;

    const timer = setTimeout(() => {
      hideToast();
    }, 2500);

    return () => clearTimeout(timer);
  }, [toast.message]);

  return {
    toast,
    showToast,
    hideToast,
  };
}

export default useToast;