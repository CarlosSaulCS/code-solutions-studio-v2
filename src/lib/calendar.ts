import { google } from 'googleapis';

const hasGoogleCredentials = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;

export interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
  }>;
}

export interface CalendarIntegration {
  accessToken: string;
  refreshToken?: string;
}

// Create OAuth2 client
function getOAuth2Client() {
  if (!hasGoogleCredentials) {
    throw new Error('Google Calendar credentials not configured');
  }
  
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXTAUTH_URL}/api/calendar/callback`
  );
}

// Get authorization URL for user consent
export function getAuthUrl(): string {
  if (!hasGoogleCredentials) {
    throw new Error('Google Calendar credentials not configured');
  }
  
  const oauth2Client = getOAuth2Client();
  
  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events'
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });
}

// Exchange authorization code for tokens
export async function getTokensFromCode(code: string): Promise<{
  access_token: string;
  refresh_token?: string;
  expiry_date?: number;
}> {
  const oauth2Client = getOAuth2Client();
  
  const { tokens } = await oauth2Client.getToken(code);
  
  if (!tokens.access_token) {
    throw new Error('No access token received from Google');
  }
  
  return {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token || undefined,
    expiry_date: tokens.expiry_date || undefined
  };
}

// Create authenticated calendar client
function getCalendarClient(integration: CalendarIntegration) {
  const oauth2Client = getOAuth2Client();
  
  oauth2Client.setCredentials({
    access_token: integration.accessToken,
    refresh_token: integration.refreshToken,
  });

  return google.calendar({ version: 'v3', auth: oauth2Client });
}

// Create a calendar event
export async function createCalendarEvent(
  integration: CalendarIntegration,
  event: CalendarEvent,
  calendarId: string = 'primary'
): Promise<{ success: boolean; eventId?: string; error?: string }> {
  try {
    const calendar = getCalendarClient(integration);
    
    const response = await calendar.events.insert({
      calendarId,
      requestBody: {
        summary: event.summary,
        description: event.description,
        start: event.start,
        end: event.end,
        attendees: event.attendees,
      },
    });

    return {
      success: true,
      eventId: response.data.id!
    };
  } catch (error: any) {
    console.error('Calendar event creation error:', error);
    return {
      success: false,
      error: error.message || 'Failed to create calendar event'
    };
  }
}

// Get calendar events
export async function getCalendarEvents(
  integration: CalendarIntegration,
  timeMin?: string,
  timeMax?: string,
  calendarId: string = 'primary'
): Promise<{ success: boolean; events?: any[]; error?: string }> {
  try {
    const calendar = getCalendarClient(integration);
    
    const response = await calendar.events.list({
      calendarId,
      timeMin: timeMin || new Date().toISOString(),
      timeMax,
      maxResults: 50,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return {
      success: true,
      events: response.data.items || []
    };
  } catch (error: any) {
    console.error('Calendar events fetch error:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch calendar events'
    };
  }
}

// Update a calendar event
export async function updateCalendarEvent(
  integration: CalendarIntegration,
  eventId: string,
  updates: Partial<CalendarEvent>,
  calendarId: string = 'primary'
): Promise<{ success: boolean; error?: string }> {
  try {
    const calendar = getCalendarClient(integration);
    
    await calendar.events.patch({
      calendarId,
      eventId,
      requestBody: updates,
    });

    return { success: true };
  } catch (error: any) {
    console.error('Calendar event update error:', error);
    return {
      success: false,
      error: error.message || 'Failed to update calendar event'
    };
  }
}

// Delete a calendar event
export async function deleteCalendarEvent(
  integration: CalendarIntegration,
  eventId: string,
  calendarId: string = 'primary'
): Promise<{ success: boolean; error?: string }> {
  try {
    const calendar = getCalendarClient(integration);
    
    await calendar.events.delete({
      calendarId,
      eventId,
    });

    return { success: true };
  } catch (error: any) {
    console.error('Calendar event deletion error:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete calendar event'
    };
  }
}

// Helper function to create a meeting event for a project
export async function createProjectMeeting(
  integration: CalendarIntegration,
  projectData: {
    title: string;
    clientName: string;
    clientEmail: string;
    startTime: Date;
    durationMinutes: number;
    description?: string;
  }
): Promise<{ success: boolean; eventId?: string; error?: string }> {
  const endTime = new Date(projectData.startTime);
  endTime.setMinutes(endTime.getMinutes() + projectData.durationMinutes);

  const event: CalendarEvent = {
    summary: `Reunión: ${projectData.title}`,
    description: `
      Reunión del proyecto: ${projectData.title}
      Cliente: ${projectData.clientName}
      ${projectData.description || ''}
      
      --
      Code Solutions Studio
    `.trim(),
    start: {
      dateTime: projectData.startTime.toISOString(),
      timeZone: 'America/Mexico_City',
    },
    end: {
      dateTime: endTime.toISOString(),
      timeZone: 'America/Mexico_City',
    },
    attendees: [
      {
        email: projectData.clientEmail,
        displayName: projectData.clientName,
      },
    ],
  };

  return createCalendarEvent(integration, event);
}
