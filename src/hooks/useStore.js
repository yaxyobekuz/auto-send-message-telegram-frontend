import {
  updateDataFromStore,
  updateErrorFromStore,
  updateLoadingFromStore,
} from "../store/features/storeSlice";
import { useDispatch, useSelector } from "react-redux";

const useStore = (selector) => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state.store);
  const { data, isLoading, hasError } = store[selector] || {};

  const updateData = (data) => {
    dispatch(updateDataFromStore({ selector, data }));
  };

  const updateLoading = (value) => {
    dispatch(updateLoadingFromStore({ selector, value }));
  };

  const updateError = (value) => {
    dispatch(updateErrorFromStore({ selector, value }));
  };

  return {
    data,
    dispatch,
    hasError,
    isLoading,
    updateData,
    updateError,
    updateLoading,
  };
};

export default useStore;
