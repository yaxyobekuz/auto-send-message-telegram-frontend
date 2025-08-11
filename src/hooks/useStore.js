import {
  clearDataFromStore,
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

  const clearData = () => {
    dispatch(clearDataFromStore({ selector }));
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
    clearData,
    updateData,
    updateError,
    updateLoading,
  };
};

export default useStore;
