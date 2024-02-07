import { USER_POOL_APP_CLIENT_ID, USER_POOL_ID } from "@/aws-exports";
import { Amplify } from "aws-amplify";
Amplify.configure({
  Auth: {
    Cognito: {
      //  Amazon Cognito User Pool ID
      userPoolId: USER_POOL_ID,
      // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolClientId: USER_POOL_APP_CLIENT_ID
    },
  },
});

