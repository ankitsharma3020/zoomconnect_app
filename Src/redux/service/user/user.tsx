
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


//olddddddddddd
    applelogin: builder.mutation({
      query: ({...body}) => ({
        url: '/apple_login',
        method: 'POST',
        body: body,
      }),
      //   invalidatesTags: [""],
    }),
    firstSignup: builder.mutation({
      query: ({...body}) => ({
        url: '/employee_first_login_register',
        method: 'POST',
        body: body,
      }),
      //   invalidatesTags: [""],
    }),
    forgetPassword: builder.mutation({
      query: ({...body}) => ({
        url: '/forgot_password',
        method: 'POST',
        body: body,
      }),
    }),
    CheckMobile: builder.mutation({
      query: ({...body}) => ({
        url: '/check_mobile_exit_to_reset_password',
        method: 'POST',
        body: body,
      }),
    }),
    
    sendotp: builder.mutation({
      query: ({...body}) => ({
        url: '/sendotp',
        method: 'POST',
        body: body,
      }),
    }),
    Verifyotp: builder.mutation({
      query: ({...body}) => ({
        url: '/verify_otp_n_register_user',
        method: 'POST',
        body: body,
      }),
    }),
    Verifyresetpassotp: builder.mutation({
      query: ({...body}) => ({
        url: '/verify_otp_for_change_password',
        method: 'POST',
        body: body,
      }),
    }),
    Verifyupdateprofileotp: builder.mutation({
      query: ({...body}) => ({
        url: '/verify_otp_for_update_profile',
        method: 'POST',
        body: body,
      }),
    }),
    // verifyotp: builder.mutation({
    //   query: body => ({
    //     url: 'api/verify/otp/',
    //     method: 'POST',
    //     body: body,
    //   }),
    //   //   invalidatesTags: [""],
    // }),
    // resendotp: builder.mutation({
    //   query: body => ({
    //     url:  "/resend-otp",
    //     method: 'POST',
    //     body: body,
    //   }),
    //   //   invalidatesTags: [""],
    // }),
    
    updateprofile: builder.mutation({
      query: ({...body}) => ({
        url: '/update_profile',
        method: 'POST',
        body: body,
      }),
      //   invalidatesTags: [""],
    }),
   ResetPassword: builder.mutation({
      query:({...body})=> ({
        url: "/employee_reset_password",
        method: 'POST',
        body:body,
      }),
    }),
    getdetailsbyid: builder.mutation({
      query:({...body})=> ({
        url: "/get_employee",
        method: 'POST',
        body:body,
      }),
    }),
      getpolicy:builder.mutation({
        query:({...body})=> ({
          url: "/get_policy_details",
          method: 'POST',
          body:body,
        }),
    }),
    Savedevicetoken:builder.mutation({
      query:({...body})=> ({
        url: "/add_device_token",
        method: 'POST',
        body:body,
      }),
  }),
    
    getclaims:builder.mutation({
      query:({...body})=> ({
        url: "/claim_details",
        method: 'POST',
        body:body,
      }),
  }),
  removeToken:builder.mutation({
    query:({...body})=> ({
      url: "/remove_device_token",
      method: 'POST',
      body:body,
    }),
}),
  getwellness:builder.mutation({
    query:({...body})=> ({
      url: "/get_all_wellness_services",
      method: 'POST',
      body:body,
    }),
}),
getProfile:builder.mutation({
  query:({...body})=> ({
    url: "/get_employee",
    method: 'POST',
    body:body,
  }),
}),
getcompanyname:builder.mutation({
  query:({...body})=> ({
    url: "/get_company_api",
    method: 'POST',
    body:body,
  }),
}),
getnewUsermenu:builder.mutation({
  query:({...body})=> ({
    url: "/bottom_bar",
    method: 'POST',
    body:body,
  }),
}),
Adddependent: builder.mutation({
  query: ({...body}) => ({
    url: '/natural_addition',
    method: 'POST',
    body: body,
  }),
  //   invalidatesTags: [""],
}),
Addsupportticket: builder.mutation({
  query: ({...body}) => ({
    url: '/support_ticket',
    method: 'POST',
    body: body,
  }),
  //   invalidatesTags: [""],
}),
AddCareticket: builder.mutation({
  query: ({...body}) => ({
    url: '/retail_icici_insurance',
    method: 'POST',
    body: body,
  }),
  //   invalidatesTags: [""],
}),

getDependentlist:builder.mutation({
  query:({...body})=> ({
    url: "/natural_addition_list",
    method: 'POST',
    body:body,
  }),
}),
getquestionlist:builder.mutation({
  query:({...body})=> ({
    url: "/survey_questions_list",
    method: 'POST',
    body:body,
  }),
}),
Updatedependent: builder.mutation({
  query: ({...body}) => ({
    url: '/natural_addition_edit',
    method: 'POST',
    body: body,
  }),
  //   invalidatesTags: [""],
}),
Registernht: builder.mutation({
  query:({...body})=> ({
    url: "/register_mobile_number_for_doc_api",
    method: 'POST',
    body:body,
  }),
}),
Nhtnumbervalidate: builder.mutation({
  query:({...body})=> ({
    url: "/check_mobile_register_to_doc_api",
    method: 'POST',
    body:body,
  }),
}),
SurveySubmit: builder.mutation({
  query:({...body})=> ({
    url: "/survey_response_submit",
    method: 'POST',
    body:body,
  }),
}),
Enrollmentlist: builder.mutation({
  query:({...body})=> ({
    url: "/get_enrolment_details",
    method: 'POST',
    body:body,
  }),
}),
SingleEnrollment: builder.mutation({
  query:({...body})=> ({
    url: "/file_enrolment",
    method: 'POST',
    body:body,
  }),
}),
SubmitEnrollment: builder.mutation({
  query:({...body})=> ({
    url: "/submit_enrolment",
    method: 'POST',
    body:body,
  }),
}),
SubmitParentEnrollment: builder.mutation({
  query:({...body})=> ({
    url: "/parent_submit_enrolment",
    method: 'POST',
    body:body,
  }),
}),
Enrollmentdetails: builder.mutation({
  query:({...body})=> ({
    url: "/enrolment_details",
    method: 'POST',
    body:body,
  }),
}),
Editenrollment: builder.mutation({
  query:({...body})=> ({
    url: "/update_file_enrolment",
    method: 'POST',
    body:body,
  }),
}),
EditSubmitEnrollment: builder.mutation({
  query:({...body})=> ({
    url: "/edit_submit_enrolment",
    method: 'POST',
    body:body,
  }),
}),
EditParentEnrollment: builder.mutation({
  query:({...body})=> ({
    url: "/edit_parent_submit_enrolment",
    method: 'POST',
    body:body,
  }),
}),
ResetmobilePassword: builder.mutation({
  query:({...body})=> ({
    url: "/employee_mobile_reset_password",
    method: 'POST',
    body:body,
  }),
}),
getInactivecmp:builder.mutation({
  query:({...body})=> ({
    url: "/Inactive_company_list",
    method: 'POST',
    body:body,
  }),
}),
FaqList: builder.mutation({
  query:({...body})=> ({
    url: "/get_faq",
    method: 'POST',
    body:body,
  }),
}),
BannnerLists: builder.mutation({
  query:({...body})=> ({
    url: "/get_banner",
    method: 'POST',
    body:body,
  }),
}),
Savesteps: builder.mutation({
  query:({...body})=> ({
    url: "/save_steps_count",
    method: 'POST',
    body:body,
  }),
}),
GetSavesteps: builder.mutation({
  query:({...body})=> ({
    url: "/get_steps_data",
    method: 'POST',
    body:body,
  }),
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
 useForgetPasswordMutation,
 useOtpVerifyMutation,
 useGetNewProfileQuery,
 useGetNewPolicyQuery,
 useGetNewWellnessserviceQuery,
  
 useResetPasswordMutation,
 useFirstSignupMutation,
 useGetclaimsMutation,
 useGetdetailsbyidMutation,
 useGetpolicyMutation,
 useGetwellnessMutation,
 useSendotpMutation,
 useVerifyotpMutation,
 useGetProfileMutation,
 useVerifyresetpassotpMutation,
 useGetcompanynameMutation,
 useUpdateprofileMutation,
 useVerifyupdateprofileotpMutation,
 useAdddependentMutation,
 useGetDependentlistMutation,
 useUpdatedependentMutation,
 useAddsupportticketMutation,
 useSavedevicetokenMutation,
 useRemoveTokenMutation,
 useGetnewUsermenuMutation,
 useRegisternhtMutation,
 useNhtnumbervalidateMutation,
 useGetquestionlistMutation,
 useSurveySubmitMutation,
 useAddCareticketMutation,
 useEnrollmentlistMutation,
 useSingleEnrollmentMutation,
 useSubmitEnrollmentMutation,
 useEnrollmentdetailsMutation,
 useSubmitParentEnrollmentMutation,
 useEditenrollmentMutation,
 useEditSubmitEnrollmentMutation,
 useEditParentEnrollmentMutation,
 useCheckMobileMutation,
 useResetmobilePasswordMutation,
 useGetInactivecmpMutation,
 useFaqListMutation,
 useBannnerListsMutation,
 useSavestepsMutation,
 useGetSavestepsMutation,
 useAppleloginMutation,
} = userApi;