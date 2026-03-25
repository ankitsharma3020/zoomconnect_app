
import ResetPassword from '../../../screens/resetPassword';
import {apiSlice} from '../../apiSlice';

export const userApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
 
    loginemail: builder.mutation({
      query: ({...body}) => ({
        url: '/login/email',
        method: 'POST',
        body: body,
      }),
      //   invalidatesTags: [""],
    }),
      loginemployee: builder.mutation({
      query: ({...body}) => ({
        url: '/login/employee-code',
        method: 'POST',
        body: body,
      }),
      //   invalidatesTags: [""],
    }),
     ResetPassword: builder.mutation({
      query: ({...body}) => ({
        url: '/reset-password',
        method: 'POST',
        body: body,
      }),
      //   invalidatesTags: [""],
    }),
      loginmobile: builder.mutation({
      query: ({...body}) => ({
        url: '/login/mobile',
        method: 'POST',
        body: body,
      }),
      //   invalidatesTags: [""],
    }),

    otpVerify: builder.mutation({
      query: ({...body}) => ({
        url: '/verify-otp',
        method: 'POST',
        body: body,
      }),
      //   invalidatesTags: [""],
    }),

    getNewProfile: builder.query({
      // Replace 'ProfileType' and 'QueryParamsType' with your actual types
       query: (params) => ({
        url: '/profile',
        method: 'GET',
        params, 
      })
  }),
    getNewPolicy: builder.query(
      (body) => ({
        url: '/employee-policies',
        method: 'GET',
        body: body,
      })
    ),
    getNewWellnessservice: builder.query(
      (body) => ({
        url: '/wellness-services',
        method: 'GET',
        body: body,
      })
    ),

      getNewChat: builder.mutation({
      query: ({...body}) => ({
        url: '/chatbot/start',
        method: 'POST',
        body: body,
      }),
      //   invalidatesTags: [""],
    }),
      getMessageforChat: builder.mutation({
      query: ({...body}) => ({
        url: '/chatbot/respond',
        method: 'POST',
        body: body,
      }),
      //   invalidatesTags: [""],
    }),
    CloseChat: builder.mutation({
      // We destructure 'ticketId' for the URL, and group the rest (status, remarks) into 'bodyData'
      query: ({ ticketId, ...bodyData }) => ({
        url: `/help/ticket/${ticketId}/status`, // Use backticks ` and ${} for dynamic ID
        method: 'PATCH',
        body: bodyData, // This will contain { status: "resolved", remarks: "..." }
      }),
       // invalidatesTags: ['Chat'], // Optional: Uncomment to auto-refetch chat list
    }),
   GetsurvayQuestion: builder.mutation({
      query: ({...body}) => ({
        url: '/surveys/questions',
        method: 'POST',
        body: body,
      }),
      //   invalidatesTags: [""],
    }),
     SubmitSurvay: builder.mutation({
      query: ({...body}) => ({
        url: '/surveys/submit',
        method: 'POST',
        body: body,
      }),
      //   invalidatesTags: [""],
    }),
       gethospitallist: builder.mutation({
      query: ({...body}) => ({
        url: '/network-hospitals/list',
        method: 'POST',
        body: body,
      }),
      //   invalidatesTags: [""],
    }),
     getClaimdetails: builder.mutation({
      query: ({...body}) => ({
        url: '/claim-details',
        method: 'POST',
        body: body,
      }),
      //   invalidatesTags: [""],
    }),
  Adddependent: builder.mutation({
  query: ({...body}) => ({
    url: '/natural-addition',
    method: 'POST',
    body: body,
  }),
  //   invalidatesTags: [""],
}),
Editdependent: builder.mutation({
  query: ({...body}) => ({
    url: '/natural-addition/edit',
    method: 'POST',
    body: body,
  }),
  //   invalidatesTags: [""],
}),
SaveToken: builder.mutation({
  query: ({...body}) => ({
    url: '/device-token',
    method: 'POST',
    body: body,
  }),
  //   invalidatesTags: [""],
}),
Addsupportticket: builder.mutation({
  query: (formData) => ({
    url: '/support/tickets',
    method: 'POST',
    body: formData,
    // Note: Do NOT set Content-Type header here. 
    // RTK Query/Fetch will automatically set it to 'multipart/form-data' 
    // with the correct boundary when it detects a FormData body.
  }),
  // invalidatesTags: ["Tickets"], // Good practice to refresh ticket lists
}),
   getBanners: builder.mutation({
      query: ({...body}) => ({
        url: '/get-banners',
        method: 'POST',
        body: body,
      }),
      //   invalidatesTags: [""],
    }),
 Replytoticket: builder.mutation({
      // We destructure 'ticketId' for the URL, and group the rest (status, remarks) into 'bodyData'
      query: ({ ticketId, ...bodyData }) => ({
        url: `/support/tickets/${ticketId}/message`, // Use backticks ` and ${} for dynamic ID
        method: 'POST',
        body: bodyData, // This will contain { status: "resolved", remarks: "..." }
      }),
       // invalidatesTags: ['Chat'], // Optional: Uncomment to auto-refetch chat list
    }),
  loginmicrosoft: builder.mutation({
      query: ({...body}) => ({
        url: '/login/microsoft',
        method: 'POST',
        body: body,
      }),
      //   invalidatesTags: [""],
    }),
   
//olddddddddddd
 Submitclaim: builder.mutation({
  query: ({...body}) => ({
    url: '/submit-claim',
    method: 'POST',
    body: body,
  }),
  //   invalidatesTags: [""],
}),
 DownloadEcard: builder.mutation({
  query: ({...body}) => ({
    url: '/download-ecard',
    method: 'POST',
    body: body,
  }),
  //   invalidatesTags: [""],
}),

   


// getProfile: builder.query({
//   query: ({profileId}) => ({
//     url: `/profile/${profileId}`,
//     method: 'GET',
//     // body: body,
//   }),
//   //   invalidatesTags: [""],
// }),
  
  }),
  // api/company-feedback-form
  // api/token/logout/

});

export const {
  
useLoginemailMutation,
 useLoginmobileMutation,
 useOtpVerifyMutation,
 useGetNewProfileQuery,
 useGetNewPolicyQuery,
 useGetNewWellnessserviceQuery,
 useGetMessageforChatMutation,
 useGetClaimdetailsMutation,
 useGetNewChatMutation,
 useCloseChatMutation,
 useGetsurvayQuestionMutation,
 useSubmitSurvayMutation,
 useGethospitallistMutation,
 useAdddependentMutation,
 useEditdependentMutation,
 useLoginemployeeMutation,
 useResetPasswordMutation,
 useSaveTokenMutation,
 useAddsupportticketMutation,
  useGetBannersMutation,
  useReplytoticketMutation,
  useLoginmicrosoftMutation,
  useSubmitclaimMutation,
  useDownloadEcardMutation,
} = userApi;