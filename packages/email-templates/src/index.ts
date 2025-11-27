type InvitationTemplateParams = {
  recipientName?: string;
  role: 'SYSTEM_ADMIN' | 'COMPANY_ADMIN' | 'EMPLOYEE';
  inviteLink: string;
  companyName?: string;
  expiresInHours: number;
};

type MeetingUpdateTemplateParams = {
  title: string;
  roomName: string;
  startTime: string;
  endTime: string;
  ownerName: string;
  action: 'created' | 'updated' | 'cancelled';
};

const baseStyles = `
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #0f172a;
`;

export function inviteTemplate({
  recipientName = 'there',
  role,
  inviteLink,
  companyName,
  expiresInHours
}: InvitationTemplateParams) {
  return `
    <main style="${baseStyles}">
      <h1>Welcome to Meeting Booking!</h1>
      <p>Hi ${recipientName},</p>
      <p>
        ${companyName ?? 'Our team'} invited you to join the platform as a <strong>${role.replace('_', ' ')}</strong>.
      </p>
      <p>
        <a href="${inviteLink}" style="background:#2563eb;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;">Finish sign up</a>
      </p>
      <p>This link is valid for ${expiresInHours} hours.</p>
    </main>
  `;
}

export function meetingUpdateTemplate({
  title,
  roomName,
  startTime,
  endTime,
  ownerName,
  action
}: MeetingUpdateTemplateParams) {
  return `
    <main style="${baseStyles}">
      <h2>Meeting ${action}</h2>
      <p>${ownerName} ${action} the meeting <strong>${title}</strong>.</p>
      <p>Room: ${roomName}</p>
      <p>Start: ${startTime}</p>
      <p>End: ${endTime}</p>
    </main>
  `;
}
