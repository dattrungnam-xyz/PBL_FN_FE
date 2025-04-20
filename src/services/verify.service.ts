import axios from "../axios";
import { VerifyOCOPStatus } from "../enums";
import { ICreateVerify } from "../interface";
import { IVerifyTableData } from "../interface/verify.interface";
import PaginatedData from "../types/PaginatedData";

export const createVerify = async (payload: ICreateVerify) => {
  const response = await axios.post(`/verify`, payload);
  return response.data;
};

export const getVerifyById = async (id: string) => {
  const response = await axios.get(`/verify/${id}`);
  return response.data;
};

export const updateVerify = async (id: string, payload: ICreateVerify) => {
  const response = await axios.put(`/verify/${id}`, payload);
  return response.data;
};

export const deleteVerify = async (id: string) => {
  const response = await axios.delete(`/verify/${id}`);
  return response.data;
};

export const getVerifyHistory = async (
  storeId: string,
  {
    page = 1,
    limit = 10,
    status = VerifyOCOPStatus.ALL,
    search = "",
  }: {
    page: number;
    limit: number;
    status?: VerifyOCOPStatus;
    search?: string;
  },
) => {
  const response = await axios.get<PaginatedData<IVerifyTableData>>(
    `/verify/seller/${storeId}`,
    {
      params: {
        page,
        limit,
        status: status === VerifyOCOPStatus.ALL ? undefined : status,
        search,
      },
    },
  );
  return response.data;
};

export const getVerify = async ({
  page = 1,
  limit = 10,
  status = VerifyOCOPStatus.ALL,
  search = "",
  storeId,
}: {
  page: number;
  limit: number;
  status?: VerifyOCOPStatus;
  search?: string;
  storeId?: string | null;
}) => {
  const response = await axios.get<PaginatedData<IVerifyTableData>>(`/verify`, {
    params: {
      page,
      limit,
      status: status === VerifyOCOPStatus.ALL ? undefined : status,
      search,
      storeId: storeId !== "all" ? storeId : undefined,
    },
  });
  return response.data;
};

export const approveVerify = async (id: string) => {
  const response = await axios.patch(`/verify/${id}/approve`);
  return response.data;
};

export const rejectVerify = async (id: string, reason: string) => {
  const response = await axios.patch(`/verify/${id}/reject`, { reason });
  return response.data;
};
