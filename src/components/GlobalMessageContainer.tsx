import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../stores";
import {
  globalMessageActions,
  GlobalMessageState,
} from "../stores/globalMessageSlice";
import { toast } from "react-toastify";
import { useEffect } from "react";

const GlobalMessageContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { message, severity } = useSelector<RootState, GlobalMessageState>(
    (state) => state.globalMessage,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (message && severity) {
      toast[severity](message);
      dispatch(globalMessageActions.clear());
    }
  }, [dispatch, message, severity]);

  return <>{children}</>;
};

export default GlobalMessageContainer;
