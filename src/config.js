export default {
    MAX_ATTACHMENT_SIZE: 5000000,
    STRIPE_KEY: "pk_test_51IbXMMLuN2nizLL9rrk4GGFgyYmhPHMgbVZqCYKpoIRlk2mRHv8Ofxqna9ZjuZqaySPfbAS2fNJj2HxXPgJwd3J800xQ256hUL",
    s3: {
      REGION: "us-east-2",
      BUCKET: "sashcoimages"
    },
    apiGateway: {
      REGION: "us-east-2",
      URL: "https://gbf3u98iwa.execute-api.us-east-2.amazonaws.com/prod"
    },
    cognito: {
      REGION: "us-east-2",
      USER_POOL_ID: "us-east-2_Wr2V52pet",
      APP_CLIENT_ID: "5qa9pv6p2nc1mg6cdpv9as4mum",
      IDENTITY_POOL_ID: "us-east-2:b46c527a-67d5-4008-bbaa-0623a9c8a722"
    }
  };