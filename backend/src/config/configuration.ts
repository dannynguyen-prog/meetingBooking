export default () => ({
  port: parseInt(process.env.PORT || '4000', 10),
  jwt: {
    secret: process.env.JWT_SECRET || 'change-me',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
  },
  invitationExpiryHours: parseInt(process.env.INVITATION_EXPIRY_HOURS || '48', 10),
  appUrl: process.env.APP_URL || 'http://localhost:3000',
  mobileAppUrl: process.env.MOBILE_APP_URL || 'meetingbooking://',
  sendgridApiKey: process.env.SENDGRID_API_KEY
});

