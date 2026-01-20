

// import type { EndpointBuilder } from "@reduxjs/toolkit/query";

// // Generic CRUD endpoint factory (strictly typed)
// export function createCrudEndpoints<
//     T extends { id?: number | string },
//     ID extends number | string = number | string
// >(
//     builder: EndpointBuilder<
//         any, 
//         string, 
//         string 
//     >,
//     resource: string,
//     options?: {
//         hasStatusChange?: boolean;
//         paginatedList?: boolean;
//         useFormData?: boolean;
//         invalidateOn?: {
//             create?: boolean;
//             update?: boolean;
//             delete?: boolean;
//             changeStatus?: boolean;
//         };
//     }
// ) {
//     // Helper: Build FormData or JSON body
//     const makeBody = (data: Partial<T> | FormData): FormData | Partial<T> => {
//         if (data instanceof FormData) return data;

//         if (options?.useFormData) {
//             const formData = new FormData();
//             Object.entries(data).forEach(([key, value]) => {
//                 if (value == null) return; // skip null/undefined
//                 if (value instanceof File) {
//                     formData.append(key, value);
//                 } else if (typeof value === "string" && value.startsWith("blob:")) {
         
//                 } else {
//                     formData.append(key, String(value));
//                 }
//             });
//             return formData;
//         }

//         return data;
//     };

//     // Helper: Invalidate tag logic
//     const invalidate = (
//         type: keyof NonNullable<typeof options>["invalidateOn"]
//     ) => (options?.invalidateOn?.[type] === false ? [] : [{ type: resource, id: "LIST" }]);

//     const endpoints: Record<string, any> = {
//         // 🔹 Get All
//         getAll: builder.query<T[], void>({
//             query: () => `/${resource}`,
//             providesTags: (result) =>
//                 result
//                     ? [
//                           ...result.map(({ id }) => ({ type: resource as const, id })),
//                           { type: resource as const, id: "LIST" },
//                       ]
//                     : [{ type: resource as const, id: "LIST" }],
//         }),

//         // 🔹 Get by ID
//         getById: builder.query<T, ID>({
//             query: (id) => `/${resource}/byid/${id}`,
//             providesTags: (result, error, id) => [{ type: resource as const, id }],
//         }),

//         // 🔹 Create
//         create: builder.mutation<T, Partial<T>>({
//             query: (data) => ({
//                 url: `/${resource}/add`,
//                 method: "POST",
//                 body: makeBody(data),
//             }),
//             invalidatesTags: invalidate("create"),
//         }),

//         // 🔹 Update
//         update: builder.mutation<T, { id: ID } & Partial<T>>({
//             query: ({ id, ...data }) => ({
//                 url: `/${resource}/update/${id}`,
//                 method: "PUT",
//                 body: makeBody(data),
//             }),
//             invalidatesTags: invalidate("update"),
//         }),

//         // 🔹 Delete
//         delete: builder.mutation<{ success: boolean }, ID>({
//             query: (id) => ({
//                 url: `/${resource}/delete/${id}`,
//                 method: "DELETE",
//             }),
//             invalidatesTags: invalidate("delete"),
//         }),
//     };

//     // 🔹 Optional: change-status endpoint
//     if (options?.hasStatusChange) {
//         endpoints.changeStatus = builder.mutation<
//             { success: boolean },
//             ID | { id: ID; body?: Record<string, unknown> }
//         >({
//             query: (arg) => {
//                 if (typeof arg === "object" && "id" in arg) {
//                     const { id, body } = arg;
//                     return {
//                         url: `/${resource}/change-status/${id}`,
//                         method: "PATCH",
//                         body: body ?? undefined,
//                     };
//                 } else {
//                     return {
//                         url: `/${resource}/change-status/${arg}`,
//                         method: "PATCH",
//                     };
//                 }
//             },
//             invalidatesTags: invalidate("changeStatus"),
//         });
//     }

//     // 🔹 Optional: Paginated List
//     if (options?.paginatedList) {
//         endpoints.getList = builder.query<
//             {
//                 success: boolean;
//                 data: T[];
//                 recordsTotal: number;
//             },
//             {
//                 page?: number;
//                 limit?: number;
//                 searchValue?: string;
//                 status?: "Active" | "Inactive";
//                 category_id?: string | number;
//                 api_id?: string | number;
//                 product_id?: string | number;
//                 api_name?: string;
//                 api_type?: string;
//                 startDate?: string;
//                 endDate?: string;
//                 userId?: string | number;
//                 bankId?: string | number;
//                 paymentMode?: string;
//             }
//         >({
//             query: ({
//                 page = 0,
//                 limit = 10,
//                 searchValue = "",
//                 status,
//                 category_id,
//                 api_id,
//                 product_id,
//                 api_name,
//                 api_type,
//                 startDate,
//                 endDate,
//                 userId,
//                 bankId,
//                 paymentMode,
//             } = {}) => ({
//                 url: `/${resource}/get-list`,
//                 method: "POST",
//                 body: {
//                     offset: page,
//                     limit,
//                     searchValue,
//                     status,
//                     ...(category_id && { category_id }),
//                     ...(api_id && { api_id }),
//                     ...(product_id && { product_id }),
//                     ...(api_name && { api_name }),
//                     ...(api_type && { api_type }),
//                     ...(startDate && { start_date: startDate }),
//                     ...(endDate && { end_date: endDate }),
//                     ...(userId && { user_id: userId }),
//                     ...(bankId && { bank_id: bankId }),
//                     ...(paymentMode && { payment_mode: paymentMode }),
//                 },
//             }),
//             providesTags: (result) =>
//                 result
//                     ? [
//                           ...result.data.map(({ id }) => ({
//                               type: resource as const,
//                               id,
//                           })),
//                           { type: resource as const, id: "LIST" },
//                       ]
//                     : [{ type: resource as const, id: "LIST" }],
//         });
//     }

//     return endpoints;
// }
































import type { EndpointBuilder } from "@reduxjs/toolkit/query";

// Generic CRUD endpoint factory (strictly typed)
export function createCrudEndpoints<
    T extends { id?: number | string },
    ID extends number | string = number | string
>(
    builder: EndpointBuilder<any, string, string>,
    resource: string,
    options?: {
        hasStatusChange?: boolean;
        paginatedList?: boolean;
        useFormData?: boolean;
        invalidateOn?: {
            create?: boolean;
            update?: boolean;
            delete?: boolean;
            changeStatus?: boolean;
        };
    }
) {
    // Build FormData or JSON body
    const makeBody = (data: Partial<T> | FormData): FormData | Partial<T> => {
        if (data instanceof FormData) return data;

        if (options?.useFormData) {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (value == null) return;
                if (value instanceof File) {
                    formData.append(key, value);
                } else {
                    formData.append(key, String(value));
                }
            });
            return formData;
        }

        return data;
    };

    // 🔥 NEW — Conditional invalidate function
    const conditionalInvalidate = (
        type: keyof NonNullable<typeof options>["invalidateOn"]
    ) => {
        return (result: any) => {
            // Not successful → DO NOT REFETCH
            if (!result || result.success !== true || result.statusCode !== 1) {
                return [];
            }

            // User disabled invalidation? → skip
            if (options?.invalidateOn?.[type] === false) {
                return [];
            }

            // Successful → invalidate LIST (refetch)
            return [{ type: resource, id: "LIST" }];
        };
    };

    const endpoints: Record<string, any> = {
        // GET ALL
        getAll: builder.query<T[], void>({
            query: () => `/${resource}`,
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ id }) => ({ type: resource as const, id })),
                          { type: resource as const, id: "LIST" },
                      ]
                    : [{ type: resource as const, id: "LIST" }],
        }),

        // GET BY ID
        getById: builder.query<T, ID>({
            query: (id) => `/${resource}/byid/${id}`,
            providesTags: (result, error, id) => [{ type: resource as const, id }],
        }),

        // CREATE
        create: builder.mutation<T, Partial<T>>({
            query: (data) => ({
                url: `/${resource}/add`,
                method: "POST",
                body: makeBody(data),
            }),
            invalidatesTags: conditionalInvalidate("create"),
        }),

        // UPDATE
        update: builder.mutation<T, { id: ID } & Partial<T>>({
            query: ({ id, ...data }) => ({
                url: `/${resource}/update/${id}`,
                method: "PUT",
                body: makeBody(data),
            }),
            invalidatesTags: conditionalInvalidate("update"),
        }),

        // DELETE
        delete: builder.mutation<{ success: boolean }, ID>({
            query: (id) => ({
                url: `/${resource}/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: conditionalInvalidate("delete"),
        }),
    };

    // OPTIONAL: Change Status Endpoint
    if (options?.hasStatusChange) {
        endpoints.changeStatus = builder.mutation<
            { success: boolean; statusCode: number },
            ID | { id: ID; body?: Record<string, unknown> }
        >({
            query: (arg) => {
                if (typeof arg === "object" && "id" in arg) {
                    const { id, body } = arg;
                    return {
                        url: `/${resource}/change-status/${id}`,
                        method: "PATCH",
                        body: body ?? undefined,
                    };
                } else {
                    return {
                        url: `/${resource}/change-status/${arg}`,
                        method: "PATCH",
                    };
                }
            },
            invalidatesTags: conditionalInvalidate("changeStatus"),
        });
    }

    // OPTIONAL: Paginated List
    if (options?.paginatedList) {
        endpoints.getList = builder.query<
            {
                success: boolean;
                data: T[];
                recordsTotal: number;
            },
            {
                page?: number;
                limit?: number;
                searchValue?: string;
                status?: "Active" | "Inactive";
                category_id?: string | number;
                api_id?: string | number;
                product_id?: string | number;
                api_name?: string;
                api_type?: string;
                startDate?: string;
                endDate?: string;
                userId?: string | number;
                bankId?: string | number;
                paymentMode?: string;
            }
        >({
            query: ({
                page = 0,
                limit = 10,
                searchValue = "",
                status,
                category_id,
                api_id,
                product_id,
                api_name,
                api_type,
                startDate,
                endDate,
                userId,
                bankId,
                paymentMode,
            } = {}) => ({
                url: `/${resource}/get-list`,
                method: "POST",
                body: {
                    offset: page,
                    limit,
                    searchValue,
                    status,
                    ...(category_id && { category_id }),
                    ...(api_id && { api_id }),
                    ...(product_id && { product_id }),
                    ...(api_name && { api_name }),
                    ...(api_type && { api_type }),
                    ...(startDate && { start_date: startDate }),
                    ...(endDate && { end_date: endDate }),
                    ...(userId && { user_id: userId }),
                    ...(bankId && { bank_id: bankId }),
                    ...(paymentMode && { payment_mode: paymentMode }),
                },
            }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.data.map(({ id }) => ({
                              type: resource as const,
                              id,
                          })),
                          { type: resource as const, id: "LIST" },
                      ]
                    : [{ type: resource as const, id: "LIST" }],
        });
    }

    return endpoints;
}
