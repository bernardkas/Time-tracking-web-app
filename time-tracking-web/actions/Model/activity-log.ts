'use server';
import { auth } from '@/auth';
import prisma from '@/db/db';

export const getActivityLogsByDate = async (employeeId: string) => {
  const currentUser = await auth();

  if (!currentUser) {
    throw new Error('Unauthorized');
  }

  const activityLogs = await prisma.$queryRaw`
    SELECT 
      DATE(timestamp) AS activityDate, 
      COUNT(*) AS totalLogs, 
      SUM(mouseClicks) AS totalMouseClicks, 
      SUM(keyboardClicks) AS totalKeyboardClicks, 
      SUM(screenTime) AS totalScreenTime
    FROM "ActivityLog"
    WHERE "employeeId" = ${employeeId}
    GROUP BY DATE(timestamp)
    ORDER BY activityDate DESC
  `;

  return activityLogs;
};
