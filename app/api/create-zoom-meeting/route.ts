// import { NextResponse } from 'next/server';
// import axios from 'axios';
// import jwt from 'jsonwebtoken';

// // Function to generate a Zoom JWT token
// function generateZoomJWT() {
//   const payload = {
//     iss: process.env.ZOOM_API_KEY,
//     exp: Math.floor(Date.now() / 1000) + 60 * 60, // Expires in 1 hour
//   };
  
//   return jwt.sign(payload, process.env.ZOOM_API_SECRET as string);
// }

// export async function POST(request: Request) {
//   try {
//     const data = await request.json();
//     const { topic, startTime, duration } = data;
    
//     // Format start time for Zoom API (ISO format)
//     const formattedStartTime = new Date(startTime).toISOString();
//     // Create Zoom meeting
//     const token = generateZoomJWT();
//     const response = await axios.post(
//       'https://api.zoom.us/v2/users/me/meetings',
//       {
//         topic,
//         type: 2, // Scheduled meeting
//         start_time: formattedStartTime,
//         duration, // Duration in minutes
//         timezone: 'UTC',
//         agenda: `Qira'at Hub class session for ${topic}`,
//         settings: {
//           host_video: true,
//           participant_video: true,
//           join_before_host: true,
//           mute_upon_entry: false,
//           waiting_room: false,
//           auto_recording: 'none',
//         },
//       },
//       {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );
    
//     // Return the meeting details
//     return NextResponse.json({
//       success: true,
//       meeting: {
//         id: response.data.id,
//         join_url: response.data.join_url,
//         password: response.data.password,
//         start_url: response.data.start_url,
//       },
//     });
//   } catch (error: any) {
//     console.error('Error creating Zoom meeting:', error.response?.data || error.message);
//     return NextResponse.json(
//       { error: 'Failed to create Zoom meeting' },
//       { status: 500 }
//     );
//   }
// }