import { useSelector } from "react-redux";
import { RootState } from "../../stores";
import { AuthState } from "../../stores/authSlice";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const RequireCreateSeller = ({ children }: { children: React.ReactNode }) => {
  const { user } = useSelector<RootState, AuthState>((state) => state.auth);

  if (!user?.storeId) {
    toast.error("Bạn cần tạo cửa hàng để truy cập vào trang này");
    return <Navigate to="/seller/create" />;
  }

  return <>{children}</>;
};

export default RequireCreateSeller;
